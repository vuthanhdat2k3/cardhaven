'use client';

import React from 'react';
import { useGame } from '@/lib/store/game-context';
import {
  X,
  Volume2,
  Zap,
  Eye,
  Globe,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetDemoData } = useGame();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-white">Cài Đặt Trò Chơi</h2>
            <p className="text-xs text-zinc-400">Tùy chỉnh trải nghiệm mở gói và giao diện</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Gameplay Settings */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Zap className="h-4 w-4" />
            <span>Tốc Độ & Hoạt Ảnh Mở Gói</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'fast', 'instant'] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => updateSettings({ animationSpeed: spd })}
                className={`rounded-xl border py-2.5 text-xs font-bold capitalize transition ${
                  settings.animationSpeed === spd
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {spd === 'normal' ? 'Bình thường' : spd === 'fast' ? 'Nhanh' : 'Tức thì'}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Audio Settings */}
        <div className="space-y-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Volume2 className="h-4 w-4" />
              <span>Âm Thanh Hiệu Ứng (SFX)</span>
            </div>
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.soundEnabled ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.soundEnabled && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Âm lượng SFX</span>
                <span>{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>
          )}
        </div>

        {/* 3. Display & Motion */}
        <div className="space-y-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Eye className="h-4 w-4" />
              <span>Giảm Chuyển Động (Reduced Motion)</span>
            </div>
            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.reducedMotion ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 4. Language Settings */}
        <div className="space-y-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Globe className="h-4 w-4" />
            <span>Ngôn Ngữ Thẻ Bài Ưu Tiên</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['ALL', 'EN', 'JP'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => updateSettings({ cardLanguageFilter: lang })}
                className={`rounded-xl border py-2 text-xs font-bold transition ${
                  settings.cardLanguageFilter === lang
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {lang === 'ALL' ? 'Tất cả' : lang === 'EN' ? 'Tiếng Anh' : 'Tiếng Nhật'}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Danger Zone / Reset */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-red-400">
              <ShieldAlert className="h-4 w-4" />
              <span>Dữ Liệu Demo & Tiến Trình</span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Khôi phục lại số dư mặc định ($1,500), xóa toàn bộ thẻ bài trong bộ sưu tập và lịch sử mở gói.
            </p>
            <button
              onClick={() => {
                if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu demo về trạng thái ban đầu?')) {
                  resetDemoData();
                  onClose();
                }
              }}
              className="mt-2 flex items-center space-x-1.5 rounded-xl border border-red-700/60 bg-red-900/40 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-800/50 transition active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt Lại Dữ Liệu Demo</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
