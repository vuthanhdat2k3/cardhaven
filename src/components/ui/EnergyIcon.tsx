'use client';

import React from 'react';
import { PokemonEnergyType } from '@/types';

interface EnergyIconProps {
  type: PokemonEnergyType | 'Colorless';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  xs: 'w-3 h-3 text-[8px]',
  sm: 'w-4 h-4 text-[10px]',
  md: 'w-5 h-5 text-xs',
  lg: 'w-7 h-7 text-sm',
};

const ENERGY_COLORS: Record<string, { bg: string; border: string; symbol: string; text: string }> = {
  Grass: { bg: 'from-emerald-500 to-green-700', border: 'border-emerald-300', symbol: '🍃', text: '#ecfdf5' },
  Fire: { bg: 'from-orange-500 to-red-600', border: 'border-orange-300', symbol: '🔥', text: '#fff7ed' },
  Water: { bg: 'from-sky-400 to-blue-600', border: 'border-sky-300', symbol: '💧', text: '#f0f9ff' },
  Lightning: { bg: 'from-amber-300 to-yellow-500', border: 'border-yellow-200', symbol: '⚡', text: '#000000' },
  Psychic: { bg: 'from-purple-500 to-fuchsia-700', border: 'border-purple-300', symbol: '👁️', text: '#faf5ff' },
  Fighting: { bg: 'from-amber-700 to-orange-900', border: 'border-amber-400', symbol: '🥊', text: '#fffbeb' },
  Darkness: { bg: 'from-slate-700 to-zinc-900', border: 'border-slate-500', symbol: '🌙', text: '#f8fafc' },
  Metal: { bg: 'from-slate-300 to-zinc-500', border: 'border-slate-200', symbol: '⚙️', text: '#0f172a' },
  Dragon: { bg: 'from-amber-500 via-emerald-600 to-indigo-700', border: 'border-amber-300', symbol: '🐉', text: '#ffffff' },
  Colorless: { bg: 'from-zinc-200 to-slate-400', border: 'border-white', symbol: '⭐', text: '#18181b' },
};

export const EnergyIcon: React.FC<EnergyIconProps> = ({ type, size = 'sm', className = '' }) => {
  const conf = ENERGY_COLORS[type] || ENERGY_COLORS.Colorless;
  const sizeClass = SIZE_MAP[size];

  return (
    <span
      title={type}
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-b ${conf.bg} ${conf.border} border shadow-xs select-none shrink-0 ${sizeClass} ${className}`}
    >
      <span className="scale-75 transform leading-none">{conf.symbol}</span>
    </span>
  );
};
