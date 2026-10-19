'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  OpeningSession,
  Product,
  User,
  UserCollectionEntry,
  UserInventoryItem,
  UserSettings,
  Wallet,
  WalletTransaction,
} from '@/types';
import { PRODUCTS, PRODUCTS_MAP } from '@/data/products';
import { POKEMON_SETS } from '@/data/sets';
import { CARD_PRINTINGS } from '@/data/cards';
import { createOpeningSession } from '@/lib/game/pack-engine';
import { soundEffects } from '@/lib/audio/sound-effects';

const STORAGE_KEY = 'pokemon_tcg_store_save_v2';

const DEFAULT_USER: User = {
  id: 'usr_master_collector',
  username: 'red_trainer',
  displayName: 'Red (Kanto Champion)',
  avatar: '🧢',
  isGuest: false,
  createdAt: '2025-01-01T00:00:00.000Z',
};

const DEFAULT_SETTINGS: UserSettings = {
  animationSpeed: 'normal',
  soundEnabled: true,
  soundVolume: 0.75,
  confirmBeforeOpen: false,
  reducedMotion: false,
  uiLanguage: 'VI',
  cardLanguageFilter: 'ALL',
};

const INITIAL_WALLET: Wallet = {
  balance: 1500.0,
  transactions: [
    {
      id: 'tx_init_grant',
      type: 'GRANT',
      amount: 1500.0,
      balanceAfter: 1500.0,
      description: 'Starter PokéCoins Grant for Collector Demo',
      timestamp: new Date().toISOString(),
    },
  ],
};

const INITIAL_INVENTORY: UserInventoryItem[] = [
  {
    id: 'inv_init_151_pack',
    productId: 'prod-sv151-pack',
    quantity: 2,
    acquiredAt: new Date().toISOString(),
  },
  {
    id: 'inv_init_pre_pack',
    productId: 'prod-pre-pack',
    quantity: 1,
    acquiredAt: new Date().toISOString(),
  },
];

function getStoredState() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

interface GameContextType {
  user: User;
  settings: UserSettings;
  wallet: Wallet;
  inventory: UserInventoryItem[];
  collection: UserCollectionEntry[];
  openingHistory: OpeningSession[];
  activeOpeningSession: OpeningSession | null;
  products: Product[];
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  // Actions
  loginAsGuest: () => void;
  loginUser: (username: string, displayName: string) => void;
  logoutUser: () => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  grantFunds: (amount: number, reason?: string) => void;
  purchaseProduct: (productId: string, quantity: number) => { success: boolean; message: string };
  unpackBoxToPacks: (productId: string) => { success: boolean; message: string };
  startPackOpening: (productId: string) => OpeningSession | null;
  finishCurrentOpening: () => void;
  getCardCount: (printingId: string) => number;
  getSetCompletion: (setId: string) => { ownedUnique: number; totalInSet: number; percentage: number };
  resetDemoData: () => void;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => getStoredState()?.user || DEFAULT_USER);
  const [settings, setSettings] = useState<UserSettings>(() => getStoredState()?.settings || DEFAULT_SETTINGS);
  const [wallet, setWallet] = useState<Wallet>(() => getStoredState()?.wallet || INITIAL_WALLET);
  const [inventory, setInventory] = useState<UserInventoryItem[]>(() => getStoredState()?.inventory || INITIAL_INVENTORY);
  const [collection, setCollection] = useState<UserCollectionEntry[]>(() => getStoredState()?.collection || []);
  const [openingHistory, setOpeningHistory] = useState<OpeningSession[]>(() => getStoredState()?.openingHistory || []);
  const [activeOpeningSession, setActiveOpeningSession] = useState<OpeningSession | null>(null);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 4000);
  }, []);

  // Persist state to localStorage on state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          settings,
          wallet,
          inventory,
          collection,
          openingHistory,
        })
      );
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [user, settings, wallet, inventory, collection, openingHistory]);

  // Sync sound engine config with settings
  useEffect(() => {
    soundEffects.setConfig(settings.soundEnabled, settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const loginAsGuest = useCallback(() => {
    const guestUser: User = {
      id: `usr_guest_${Date.now()}`,
      username: 'guest_trainer',
      displayName: 'Khách Tham Quan (Guest)',
      avatar: '🎒',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    setUser(guestUser);
    showToast('Đã đăng nhập dưới dạng Khách Demo!', 'info');
  }, [showToast]);

  const loginUser = useCallback((username: string, displayName: string) => {
    const loggedInUser: User = {
      id: `usr_${username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      username,
      displayName: displayName || username,
      avatar: '⭐',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    setUser(loggedInUser);
    showToast(`Chào mừng trở lại, ${loggedInUser.displayName}!`, 'success');
  }, [showToast]);

  const logoutUser = useCallback(() => {
    loginAsGuest();
  }, [loginAsGuest]);

  const grantFunds = useCallback((amount: number, reason: string = 'Demo Grant') => {
    setWallet((prev) => {
      const newBalance = Number((prev.balance + amount).toFixed(2));
      const tx: WalletTransaction = {
        id: `tx_${Date.now()}`,
        type: 'GRANT',
        amount,
        balanceAfter: newBalance,
        description: reason,
        timestamp: new Date().toISOString(),
      };
      return {
        balance: newBalance,
        transactions: [tx, ...prev.transactions],
      };
    });
    soundEffects.playCoinClink();
    showToast(`Đã nhận +$${amount.toFixed(2)} PokéCoins!`, 'success');
  }, [showToast]);

  const purchaseProduct = useCallback(
    (productId: string, quantity: number): { success: boolean; message: string } => {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        return { success: false, message: 'Sản phẩm không tồn tại.' };
      }
      if (quantity <= 0) {
        return { success: false, message: 'Số lượng mua không hợp lệ.' };
      }
      if (product.stock < quantity) {
        return { success: false, message: `Chỉ còn ${product.stock} sản phẩm trong kho.` };
      }

      const totalCost = Number((product.price * quantity).toFixed(2));
      if (wallet.balance < totalCost) {
        showToast(`Số dư không đủ! Cần $${totalCost.toFixed(2)}, bạn chỉ có $${wallet.balance.toFixed(2)}.`, 'error');
        return {
          success: false,
          message: `Không đủ số dư. Cần $${totalCost.toFixed(2)}, bạn hiện có $${wallet.balance.toFixed(2)}.`,
        };
      }

      // Deduct balance & record transaction
      setWallet((prev) => {
        const newBalance = Number((prev.balance - totalCost).toFixed(2));
        const tx: WalletTransaction = {
          id: `tx_buy_${Date.now()}`,
          type: 'PURCHASE',
          amount: -totalCost,
          balanceAfter: newBalance,
          description: `Mua ${quantity}x ${product.name}`,
          timestamp: new Date().toISOString(),
        };
        return {
          balance: newBalance,
          transactions: [tx, ...prev.transactions],
        };
      });

      // Update product stock
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: p.stock - quantity } : p))
      );

      // Add to inventory
      setInventory((prev) => {
        const existingIdx = prev.findIndex((item) => item.productId === productId);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + quantity,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: `inv_${Date.now()}_${productId}`,
              productId,
              quantity,
              acquiredAt: new Date().toISOString(),
            },
          ];
        }
      });

      soundEffects.playCoinClink();
      showToast(`Mua thành công ${quantity}x ${product.name}! Đã thêm vào Kho đồ.`, 'success');
      return { success: true, message: 'Giao dịch thành công!' };
    },
    [products, wallet.balance, showToast]
  );

  // Unpack sealed box / ETB into individual booster packs
  const unpackBoxToPacks = useCallback(
    (productId: string): { success: boolean; message: string } => {
      const product = PRODUCTS_MAP.get(productId);
      if (!product) return { success: false, message: 'Sản phẩm không hợp lệ.' };

      const inventoryItem = inventory.find((i) => i.productId === productId && i.quantity > 0);
      if (!inventoryItem) {
        return { success: false, message: 'Bạn không có sản phẩm này trong kho đồ.' };
      }

      const packsInside = product.contents.boosterPacksCount;
      if (packsInside <= 1) {
        return { success: false, message: 'Sản phẩm này là gói lẻ, hãy chọn Mở Gói trực tiếp.' };
      }

      // Find the corresponding single booster pack for this set
      const singlePackProduct = products.find(
        (p) => p.setId === product.setId && p.productType === 'booster_pack'
      );
      if (!singlePackProduct) {
        return { success: false, message: 'Không tìm thấy loại booster pack tương ứng.' };
      }

      // Deduct 1 box and add N booster packs
      setInventory((prev) => {
        return prev
          .map((item) => {
            if (item.productId === productId) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
          .filter((item) => item.quantity > 0)
          .concat({
            id: `inv_unpack_${Date.now()}`,
            productId: singlePackProduct.id,
            quantity: packsInside,
            acquiredAt: new Date().toISOString(),
          });
      });

      soundEffects.playPackTear();
      showToast(
        `Đã bóc hộp ${product.name}! Bạn nhận được ${packsInside}x ${singlePackProduct.name}.`,
        'success'
      );
      return { success: true, message: `Nhận được ${packsInside} booster packs!` };
    },
    [inventory, products, showToast]
  );

  // Core Pack Opening trigger
  const startPackOpening = useCallback(
    (productId: string): OpeningSession | null => {
      const inventoryItem = inventory.find((i) => i.productId === productId && i.quantity > 0);
      if (!inventoryItem) {
        showToast('Bạn không còn gói này trong kho đồ để mở.', 'error');
        return null;
      }

      try {
        // Step 1: Pre-calculate opening result BEFORE animation to guarantee integrity
        const session = createOpeningSession(productId, collection);

        // Step 2: Deduct pack from inventory
        setInventory((prev) =>
          prev
            .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
            .filter((item) => item.quantity > 0)
        );

        // Step 3: Record cards into user collection
        setCollection((prevCollection) => {
          const map = new Map(prevCollection.map((c) => [c.printingId, { ...c }]));
          const nowStr = new Date().toISOString();

          session.cards.forEach((cardResult) => {
            const printingId = cardResult.printing.id;
            const existing = map.get(printingId);
            if (existing) {
              existing.count += 1;
              existing.lastAcquiredAt = nowStr;
            } else {
              map.set(printingId, {
                printingId,
                count: 1,
                firstAcquiredAt: nowStr,
                lastAcquiredAt: nowStr,
              });
            }
          });

          return Array.from(map.values());
        });

        // Step 4: Record in opening history
        setOpeningHistory((prev) => [session, ...prev]);

        // Step 5: Mount to active studio
        setActiveOpeningSession(session);
        return session;
      } catch (err) {
        console.error('Pack opening failure:', err);
        showToast('Lỗi khi mở gói. Vui lòng thử lại.', 'error');
        return null;
      }
    },
    [inventory, collection, showToast]
  );

  const finishCurrentOpening = useCallback(() => {
    setActiveOpeningSession(null);
  }, []);

  const getCardCount = useCallback(
    (printingId: string): number => {
      const entry = collection.find((c) => c.printingId === printingId);
      return entry ? entry.count : 0;
    },
    [collection]
  );

  const getSetCompletion = useCallback(
    (setId: string) => {
      const setCardPrintings = CARD_PRINTINGS.filter((c) => c.setId === setId);
      const targetSet = POKEMON_SETS.find((s) => s.id === setId);
      const totalInSet = targetSet ? targetSet.totalCards : setCardPrintings.length;

      const ownedUnique = setCardPrintings.filter((c) => {
        const count = collection.find((e) => e.printingId === c.id)?.count || 0;
        return count > 0;
      }).length;

      const percentage = totalInSet > 0 ? Math.min(100, Math.round((ownedUnique / totalInSet) * 100)) : 0;

      return { ownedUnique, totalInSet, percentage };
    },
    [collection]
  );

  const resetDemoData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(DEFAULT_USER);
    setSettings(DEFAULT_SETTINGS);
    setWallet(INITIAL_WALLET);
    setInventory(INITIAL_INVENTORY);
    setCollection([]);
    setOpeningHistory([]);
    setActiveOpeningSession(null);
    setProducts(PRODUCTS);
    showToast('Đã thiết lập lại dữ liệu Demo về ban đầu!', 'info');
  }, [showToast]);

  const value = useMemo(
    () => ({
      user,
      settings,
      wallet,
      inventory,
      collection,
      openingHistory,
      activeOpeningSession,
      products,
      toastMessage,
      loginAsGuest,
      loginUser,
      logoutUser,
      updateSettings,
      grantFunds,
      purchaseProduct,
      unpackBoxToPacks,
      startPackOpening,
      finishCurrentOpening,
      getCardCount,
      getSetCompletion,
      resetDemoData,
      showToast,
    }),
    [
      user,
      settings,
      wallet,
      inventory,
      collection,
      openingHistory,
      activeOpeningSession,
      products,
      toastMessage,
      loginAsGuest,
      loginUser,
      logoutUser,
      updateSettings,
      grantFunds,
      purchaseProduct,
      unpackBoxToPacks,
      startPackOpening,
      finishCurrentOpening,
      getCardCount,
      getSetCompletion,
      resetDemoData,
      showToast,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
