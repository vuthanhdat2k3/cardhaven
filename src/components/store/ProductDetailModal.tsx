'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { POKEMON_SETS } from '@/data/sets';
import { useGame } from '@/lib/store/game-context';
import { BoosterPackFoil } from '@/components/ui/BoosterPackFoil';
import { SealedBoxProduct } from '@/components/ui/SealedBoxProduct';
import { X, ShoppingBag, Plus, Minus, Package, Star, AlertCircle, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenImmediately?: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenImmediately,
}) => {
  const { wallet, purchaseProduct, storeWaves, restockCollectionWave } = useGame();
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);

  if (!product) return null;

  const wave = storeWaves[product.setId];

  const setInfo = POKEMON_SETS.find((s) => s.id === product.setId);
  const totalCost = Number((product.price * quantity).toFixed(2));
  const hasEnoughFunds = wallet.balance >= totalCost;
  const isOutOfStock = product.stock <= 0;

  const handleBuy = () => {
    setBuying(true);
    const res = purchaseProduct(product.id, quantity);
    setBuying(false);
    if (res.success) {
      onClose();
    }
  };

  const handleBuyAndOpen = () => {
    const res = purchaseProduct(product.id, 1);
    if (res.success) {
      onClose();
      if (onOpenImmediately) {
        onOpenImmediately(product.id);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/30 bg-zinc-950 p-6 shadow-2xl sm:p-8 overflow-hidden">
        
        {/* Subtle accent backdrop */}
        <div
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl pointer-events-none opacity-30"
          style={{ background: product.accentColor }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left: Product Visual Box */}
          <div
            className="flex flex-col items-center justify-center rounded-2xl border border-white/10 p-6 shadow-inner"
            style={{
              background: `radial-gradient(circle, ${product.accentColor}33 0%, #09090b 80%)`,
            }}
          >
            <div className="flex items-center justify-center py-2">
              {product.productType === 'booster_pack' ? (
                <BoosterPackFoil product={product} size="lg" interactive={false} />
              ) : (
                <SealedBoxProduct product={product} size="md" interactive={false} />
              )}
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/40">
                {product.language === 'JP' ? 'Japanese Edition' : 'English Edition'}
              </span>
              <span className="flex items-center text-xs font-bold text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                {product.rating.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Right: Product Details & Controls */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {setInfo?.name} ({setInfo?.series})
              </p>
              <h2 className="text-xl font-black text-white leading-tight mt-1">{product.name}</h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{product.description}</p>
            </div>

            {/* Contents Breakdown */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 space-y-1.5 text-xs">
              <div className="flex items-center text-zinc-300 font-semibold mb-1">
                <Package className="h-4 w-4 text-amber-400 mr-1.5" />
                <span>Quy cách đóng gói:</span>
              </div>
              <p className="text-zinc-400 pl-5">
                • Chứa <strong className="text-amber-200">{product.contents.boosterPacksCount} booster packs</strong>.
              </p>
              {product.contents.bonusDescription && (
                <p className="text-zinc-400 pl-5">• {product.contents.bonusDescription}</p>
              )}
            </div>

            {/* Price & Quantity Selector */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
              <div>
                <span className="text-[11px] text-zinc-400 uppercase font-bold block">Tổng cộng</span>
                <span className="text-2xl font-black text-amber-300">
                  ${totalCost.toFixed(2)}
                </span>
              </div>

              {/* Counter */}
              <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-900 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Balance warning */}
            {!hasEnoughFunds && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-semibold bg-rose-950/30 p-2 rounded-lg border border-rose-800/40">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  Bạn còn thiếu ${(totalCost - wallet.balance).toFixed(2)}. Hãy nhấn nạp PokéCoins!
                </span>
              </div>
            )}

            {/* Print Wave Status */}
            {wave && (
              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-xs">
                <div>
                  <span className="font-bold text-amber-300">Đợt hàng #{wave.waveNumber}</span>
                  <span className="text-zinc-400 block text-[11px]">
                    {product.productType === 'booster_pack'
                      ? `Còn ${wave.remainingLoosePacks} pack lẻ trên kệ`
                      : `Còn ${wave.remainingBoxes} box sealed`}
                  </span>
                </div>
                {wave.status === 'sold_out' ? (
                  <button
                    onClick={() => restockCollectionWave(product.setId)}
                    className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 transition"
                  >
                    Nhập Đợt #{wave.waveNumber + 1}
                  </button>
                ) : (
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      wave.status === 'low_stock'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {wave.status === 'low_stock' ? 'Sắp Hết' : 'Sẵn Hàng'}
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleBuy}
                disabled={isOutOfStock || !hasEnoughFunds || buying}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-black text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-98"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>
                  {isOutOfStock
                    ? 'Hết hàng đợt này'
                    : !hasEnoughFunds
                    ? 'Không đủ PokéCoins'
                    : `Mua ngay (${quantity} cái) — $${totalCost.toFixed(2)}`}
                </span>
              </button>

              {product.contents.boosterPacksCount === 1 && hasEnoughFunds && !isOutOfStock && onOpenImmediately && (
                <button
                  onClick={handleBuyAndOpen}
                  className="w-full flex items-center justify-center space-x-2 rounded-xl border border-amber-500/40 bg-amber-500/10 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition active:scale-98"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Mua & Mở Ngay Lập Tức</span>
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
