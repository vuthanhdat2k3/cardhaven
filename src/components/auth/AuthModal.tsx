'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/store/game-context';
import { X, Sparkles, LogIn, LogOut } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, loginAsGuest, loginUser, logoutUser } = useGame();

  const [mode, setMode] = useState<'view' | 'login' | 'register'>('view');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Vui lòng nhập tên tài khoản.');
      return;
    }
    setErrorMsg('');
    loginUser(username.trim(), displayName.trim() || username.trim());
    onClose();
  };

  const handleGuest = () => {
    loginAsGuest();
    onClose();
  };

  const handleLogout = () => {
    logoutUser();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🧢</span>
            <div>
              <h2 className="text-lg font-black text-white">Hồ Sơ Nhà Sưu Tập (Trainer)</h2>
              <p className="text-xs text-zinc-400">Quản lý phiên đăng nhập và định danh tài khoản</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Current Active User Card */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-zinc-900 p-4 flex items-center space-x-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-3xl border border-amber-500/40">
            {user.avatar}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black text-white">{user.displayName}</h3>
              {user.isGuest && (
                <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[9px] font-bold text-zinc-400">
                  Guest
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400">@{user.username}</p>
            <span className="text-[10px] text-amber-400 font-medium">
              Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* View / Switch Mode */}
        {mode === 'view' ? (
          <div className="space-y-3">
            <button
              onClick={() => setMode('login')}
              className="w-full flex items-center justify-center space-x-2 rounded-xl bg-amber-500 py-3 text-xs font-black text-black shadow-lg shadow-amber-500/20 hover:bg-amber-400 active:scale-98 transition"
            >
              <LogIn className="h-4 w-4" />
              <span>Đổi Tài Khoản / Đăng Nhập Khác</span>
            </button>

            <button
              onClick={handleGuest}
              className="w-full flex items-center justify-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Chuyển Sang Chế Độ Khách Demo (Guest)</span>
            </button>

            {!user.isGuest && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 rounded-xl border border-red-900/40 bg-red-950/20 py-2.5 text-xs font-bold text-red-400 hover:bg-red-900/40 transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng Xuất</span>
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Tên Nhà Sưu Tập (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="VD: cynthia_champion, ash_kanto..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Tên Hiển Thị (Display Name)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="VD: Cynthia (Sinnoh Master)"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('view')}
                className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-xs font-bold text-zinc-300 hover:bg-zinc-700 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-amber-500 py-2.5 text-xs font-black text-black hover:bg-amber-400 transition"
              >
                Xác Nhận
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
