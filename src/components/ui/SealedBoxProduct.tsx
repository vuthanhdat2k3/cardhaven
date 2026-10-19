'use client';

import React from 'react';
import { Product } from '@/types';
import { POKEMON_SETS } from '@/data/sets';
import { ShieldCheck } from 'lucide-react';

interface SealedBoxProductProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const SealedBoxProduct: React.FC<SealedBoxProductProps> = ({
  product,
  size = 'md',
  interactive = true,
  onClick,
  className = '',
}) => {
  const setInfo = POKEMON_SETS.find((s) => s.id === product.setId);
  const isETB = product.productType === 'elite_trainer_box';
  const isBoosterBox = product.productType === 'booster_box';
  const isTin = product.productType === 'collector_tin';
  const isBundle = product.productType === 'bundle';
  const [imgError, setImgError] = React.useState(false);

  const sizeClasses = {
    sm: 'w-40 h-[190px] text-[10px]',
    md: 'w-56 h-[250px] text-xs',
    lg: 'w-72 h-[310px] text-sm',
  }[size];

  const hasValidImage = Boolean(product.boxImageUrl) && !imgError;

  return (
    <div
      onClick={onClick}
      className={`group relative ${sizeClasses} rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl border-2 select-none transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:-translate-y-2 hover:shadow-amber-500/25 active:scale-98' : ''
      } ${
        isETB
          ? 'border-purple-500/50 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black'
          : isBoosterBox
          ? 'border-amber-500/50 bg-gradient-to-b from-stone-900 via-zinc-900 to-black'
          : isTin
          ? 'border-red-500/50 bg-gradient-to-b from-zinc-800 via-zinc-900 to-stone-950'
          : 'border-zinc-700 bg-zinc-900'
      } ${className}`}
    >
      {/* ========================================================= */}
      {/* FACTORY SHRINK WRAP WITH POKÉBALL WATERMARK STAMPS */}
      {/* ========================================================= */}
      {(isBoosterBox || isETB) && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-35">
          <div className="absolute top-2 left-3 flex items-center space-x-1 text-[8px] font-mono text-white/70">
            <span>⚪</span>
            <span>POKÉMON</span>
          </div>
          <div className="absolute top-16 right-4 flex items-center space-x-1 text-[8px] font-mono text-white/70">
            <span>⚪</span>
            <span>POKÉMON</span>
          </div>
          <div className="absolute bottom-10 left-6 flex items-center space-x-1 text-[8px] font-mono text-white/70">
            <span>⚪</span>
            <span>POKÉMON</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* ========================================================= */}
      {/* BOX TOP FOLD / ETB LID ACCENT */}
      {/* ========================================================= */}
      <div
        className={`relative z-10 w-full px-3 py-1.5 flex items-center justify-between border-b ${
          isETB
            ? 'bg-gradient-to-r from-purple-950 to-indigo-950 border-purple-500/30'
            : isBoosterBox
            ? 'bg-gradient-to-r from-amber-950 to-stone-900 border-amber-500/30'
            : 'bg-zinc-800 border-zinc-700'
        }`}
      >
        <span className="text-[9px] font-black uppercase tracking-widest text-amber-300">
          {isETB ? 'ELITE TRAINER BOX' : isBoosterBox ? 'SEALED BOOSTER DISPLAY' : isTin ? 'COLLECTOR TIN' : 'BOOSTER BUNDLE'}
        </span>
        <span className="rounded bg-black/60 px-1.5 py-0.2 text-[8px] font-bold text-zinc-300">
          {product.language}
        </span>
      </div>

      {/* ========================================================= */}
      {/* BOX CENTER BODY: AUTHENTIC SCAN OR VECTOR FALLBACK */}
      {/* ========================================================= */}
      <div className="relative z-10 flex-1 p-2 flex flex-col items-center justify-center text-center overflow-hidden">
        {hasValidImage ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Real Authentic Box Shot */}
            <div className="relative w-full flex-1 flex items-center justify-center my-0.5 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.boxImageUrl}
                alt={product.name}
                onError={() => setImgError(true)}
                className="max-h-[140px] max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transform group-hover:scale-105 transition duration-300"
                loading="lazy"
              />
            </div>

            {/* Box Name Tag */}
            <h3 className="font-black text-xs text-white line-clamp-1 leading-snug drop-shadow-md">
              {product.name}
            </h3>
            <p className="text-[9px] text-zinc-400 font-medium line-clamp-1">
              {setInfo?.name} • {product.contents.boosterPacksCount} Packs
            </p>
          </div>
        ) : (
          <>
            {/* Glow */}
            <div
              className="absolute h-24 w-24 rounded-full blur-xl pointer-events-none opacity-40"
              style={{ background: product.accentColor }}
            />

        {/* Collection-Specific Mascot & Centerpiece */}
        <div className="relative my-1">
          {product.id === 'prod-sv151-etb' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(239,68,68,0.5)] transform group-hover:scale-110 transition duration-300">
                💤
              </span>
              <span className="text-[10px] font-black tracking-wider text-rose-300 uppercase mt-1">
                SNORLAX EDITION
              </span>
            </div>
          ) : product.id === 'prod-30th-etb' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition duration-300">
                🎖️
              </span>
              <span className="text-[10px] font-black tracking-wider text-amber-300 uppercase mt-1">
                30TH CELEBRATION
              </span>
            </div>
          ) : product.id === 'prod-30th-box' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition duration-300">
                🐉
              </span>
              <span className="text-[10px] font-black tracking-wider text-amber-300 uppercase mt-1">
                MEGA EVOLUTION DISPLAY
              </span>
            </div>
          ) : product.id === 'prod-pocket-bundle' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(56,189,248,0.5)] transform group-hover:scale-110 transition duration-300">
                📱
              </span>
              <span className="text-[10px] font-black tracking-wider text-cyan-300 uppercase mt-1">
                GENETIC APEX BUNDLE
              </span>
            </div>
          ) : product.id === 'prod-crz-etb' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition duration-300">
                🐺
              </span>
              <span className="text-[10px] font-black tracking-wider text-amber-300 uppercase mt-1">
                LUCARIO VSTAR
              </span>
            </div>
          ) : product.id === 'prod-jp151-box' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(16,185,129,0.5)] transform group-hover:scale-110 transition duration-300">
                🌸
              </span>
              <span className="text-[9px] font-bold text-emerald-300 mt-1">
                強化拡張パック
              </span>
            </div>
          ) : product.id === 'prod-pre-box' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(168,85,247,0.5)] transform group-hover:scale-110 transition duration-300">
                ✨
              </span>
              <span className="text-[10px] font-black tracking-wider text-fuchsia-300 uppercase mt-1">
                STELLAR TERA EEVEELUTIONS
              </span>
            </div>
          ) : product.id === 'prod-crz-tin' ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl sm:text-5xl drop-shadow-[0_10px_15px_rgba(249,115,22,0.5)] transform group-hover:scale-110 transition duration-300">
                🔥
              </span>
              <span className="text-[9px] font-black tracking-wider text-orange-300 uppercase mt-1">
                GALARIAN MOLTRES
              </span>
            </div>
          ) : (
            <span className="text-4xl sm:text-5xl drop-shadow-[0_12px_12px_rgba(0,0,0,0.9)] transform group-hover:scale-108 transition duration-300 block">
              {isETB ? '🎁' : isBoosterBox ? '📦' : isTin ? '🛡️' : '👝'}
            </span>
          )}
        </div>

        {/* Box Name */}
        <h3 className="font-black text-xs sm:text-sm text-white line-clamp-1 leading-snug drop-shadow-md mt-1">
          {product.name}
        </h3>
        <p className="text-[10px] text-zinc-400 font-medium line-clamp-1 mt-0.5">
          {setInfo?.name}
        </p>

        {/* ETB Feature Badge */}
        {isETB && (
          <div className="mt-2 rounded-md bg-purple-900/40 border border-purple-500/30 px-2 py-0.5 text-[9px] font-bold text-purple-200">
            ★ Promo Card + 65 Sleeves + {product.contents.boosterPacksCount} Packs
          </div>
        )}

        {/* Booster Box Feature Badge */}
        {isBoosterBox && (
          <div className="mt-2 rounded-md bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 text-[9px] font-extrabold text-amber-300">
            ★ {product.contents.boosterPacksCount} Packs Nguyên Seal
          </div>
        )}

        {/* Tin / Bundle Feature Badge */}
        {(isTin || isBundle) && (
          <div className="mt-2 rounded-md bg-zinc-800/80 border border-zinc-700 px-2 py-0.5 text-[9px] font-bold text-zinc-300">
            ★ {product.contents.boosterPacksCount} Packs Lẻ Bên Trong
          </div>
        )}
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* BOX BASE FOOTER */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full px-3 py-2 bg-black/80 backdrop-blur-xs border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-[10px] text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono">FACTORY SEALED</span>
        </div>
        <span className="text-xs font-black text-amber-300">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};
