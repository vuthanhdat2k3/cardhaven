'use client';

import React from 'react';
import { useGame } from '@/lib/store/game-context';
import {
  Coins,
  PlusCircle,
  Volume2,
  VolumeX,
  Settings,
  ShoppingBag,
  Package,
  BookOpen,
  Clock,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'store' | 'inventory' | 'collection' | 'history';
  onSelectTab: (tab: 'store' | 'inventory' | 'collection' | 'history') => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSettings,
  onOpenAuth,
}) => {
  const { user, wallet, inventory, settings, updateSettings, grantFunds } = useGame();

  const totalSealedProducts = inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-950/40 bg-zinc-950/90 backdrop-blur-md shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        
        {/* Brand Logo & Collector Rank */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('store')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-red-600 to-indigo-700 shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
            <span className="text-xl">🎴</span>
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-black">
              ★
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-black tracking-wider text-amber-100 sm:text-lg">
                CARD<span className="text-amber-400">HAVEN</span>
              </span>
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30">
                TCG SIM
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Hobby Shop & Pack Simulator</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center rounded-xl bg-zinc-900/80 p-1 border border-zinc-800">
          <button
            onClick={() => onSelectTab('store')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentTab === 'store'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Cửa Hàng</span>
          </button>

          <button
            onClick={() => onSelectTab('inventory')}
            className={`relative flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentTab === 'inventory'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>Kho Đồ</span>
            {totalSealedProducts > 0 && (
              <span className="ml-1 rounded-full bg-red-600 px-1.5 py-0.2 text-[10px] font-bold text-white animate-pulse">
                {totalSealedProducts}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('collection')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentTab === 'collection'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Bộ Sưu Tập</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              currentTab === 'history'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Lịch Sử</span>
          </button>
        </nav>

        {/* Right Section: Wallet, Audio, Settings, Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Wallet Balance */}
          <div className="flex items-center rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 p-1 pl-2.5 pr-1 border border-amber-500/30 shadow-inner">
            <div className="flex items-center space-x-1.5 mr-2">
              <Coins className="h-4 w-4 text-amber-400 animate-bounce" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-amber-500/80 leading-none">PokéCoins</span>
                <span className="text-sm font-extrabold text-amber-300 tabular-nums leading-tight">
                  ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <button
              onClick={() => grantFunds(500, 'Nạp tiền Demo')}
              title="Nhận thêm $500 Demo PokéCoins"
              className="flex items-center space-x-1 rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 transition active:scale-95"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">+$500</span>
            </button>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
              settings.soundEnabled
                ? 'border-zinc-700 bg-zinc-900 text-amber-400 hover:bg-zinc-800'
                : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:text-zinc-400'
            }`}
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettings}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-amber-300 transition"
            title="Cài đặt trò chơi"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* User Profile / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center space-x-1.5 rounded-lg border border-amber-600/40 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition active:scale-95"
          >
            <span className="text-base">{user.avatar}</span>
            <span className="hidden lg:inline max-w-[100px] truncate font-semibold text-amber-200">
              {user.displayName}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="flex md:hidden border-t border-zinc-800/80 bg-zinc-950 px-2 py-1 justify-around">
        <button
          onClick={() => onSelectTab('store')}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-bold ${
            currentTab === 'store' ? 'text-amber-400' : 'text-zinc-400'
          }`}
        >
          <ShoppingBag className="h-4 w-4 mb-0.5" />
          <span>Cửa hàng</span>
        </button>
        <button
          onClick={() => onSelectTab('inventory')}
          className={`relative flex flex-col items-center py-1 px-3 text-[10px] font-bold ${
            currentTab === 'inventory' ? 'text-amber-400' : 'text-zinc-400'
          }`}
        >
          <Package className="h-4 w-4 mb-0.5" />
          <span>Kho ({totalSealedProducts})</span>
        </button>
        <button
          onClick={() => onSelectTab('collection')}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-bold ${
            currentTab === 'collection' ? 'text-amber-400' : 'text-zinc-400'
          }`}
        >
          <BookOpen className="h-4 w-4 mb-0.5" />
          <span>Bộ sưu tập</span>
        </button>
        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center py-1 px-3 text-[10px] font-bold ${
            currentTab === 'history' ? 'text-amber-400' : 'text-zinc-400'
          }`}
        >
          <Clock className="h-4 w-4 mb-0.5" />
          <span>Lịch sử</span>
        </button>
      </div>
    </header>
  );
};
