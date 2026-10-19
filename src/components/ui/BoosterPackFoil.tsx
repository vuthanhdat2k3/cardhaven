'use client';

import React from 'react';
import { Product } from '@/types';

interface BoosterPackFoilProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const BoosterPackFoil: React.FC<BoosterPackFoilProps> = ({
  product,
  size = 'md',
  interactive = true,
  onClick,
  className = '',
}) => {
  const isJP = product.language === 'JP';
  const [imgError, setImgError] = React.useState(false);
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  // Proportions: Physical booster packs are ~65mm x 120mm (~1 : 1.85)
  const sizeClasses = {
    sm: 'w-28 h-[200px] text-[9px]',
    md: 'w-36 h-[260px] text-[11px]',
    lg: 'w-48 h-[340px] text-xs',
    xl: 'w-64 h-[440px] text-sm',
  }[size];

  // Specific collection styling
  const is151 = product.setId.includes('151');
  const isPrismatic = product.setId.includes('pre');
  const isCrownZenith = product.setId.includes('crz');
  const is30th = product.setId.includes('30th');
  const isPocket = product.setId.includes('pocket');
  const hasValidImage = Boolean(product.imageUrl) && !imgError;

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`group relative ${sizeClasses} rounded-lg overflow-hidden flex flex-col justify-between shadow-2xl select-none transition-all duration-300 ${
        interactive ? 'cursor-pointer hover:-translate-y-2 hover:shadow-amber-500/30 active:scale-98' : ''
      } ${className}`}
      style={{
        background: hasValidImage
          ? 'transparent'
          : is30th
          ? 'linear-gradient(135deg, #18181b 0%, #713f12 40%, #fbbf24 80%, #18181b 100%)'
          : isPocket
          ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #0284c7 80%, #0f172a 100%)'
          : is151
          ? isJP
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #064e3b 80%, #022c22 100%)'
            : 'linear-gradient(135deg, #18181b 0%, #3f3f46 30%, #7f1d1d 70%, #18181b 100%)'
          : isPrismatic
          ? 'linear-gradient(135deg, #3b0764 0%, #701a75 35%, #4338ca 70%, #0f172a 100%)'
          : 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #78350f 85%, #451a03 100%)',
      }}
    >
      {/* Authentic Scanned Pack Render */}
      {hasValidImage ? (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
            loading="lazy"
          />

          {/* Dynamic Foil Reflection Sheen */}
          <div className="absolute inset-0 foil-holo-sheen opacity-35 pointer-events-none mix-blend-color-dodge z-20" />

          {/* Interactive Cursor Glare */}
          {interactive && (
            <div
              className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 65%)`,
                mixBlendMode: 'overlay',
              }}
            />
          )}
        </div>
      ) : (
        <>
          {/* Dynamic Foil Reflection Overlay */}
          <div className="absolute inset-0 foil-holo-sheen opacity-60 pointer-events-none z-20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-20" />

          {/* ========================================================= */}
          {/* TOP HEAT-SEALED CRIMP WITH SOMBRERO PUNCH HOLE */}
          {/* ========================================================= */}
          <div className="relative z-10 w-full h-8 bg-gradient-to-b from-zinc-700 via-zinc-400 to-zinc-600 border-b border-black/40 flex flex-col items-center justify-center shadow-inner">
            {/* Serrated heat-seal crimp indent lines */}
            <div className="absolute inset-x-0 top-0 h-1 bg-white/40" />
            <div className="flex space-x-0.5 w-full justify-center opacity-40">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="w-0.5 h-6 bg-black" />
              ))}
            </div>

            {/* Sombrero Retail Peg Hanging Punch Hole */}
            <div className="absolute top-1.5 flex flex-col items-center">
              <div className="h-1.5 w-5 rounded-full bg-zinc-900 border border-white/40 shadow-inner" />
              <div className="h-2 w-2 bg-zinc-900 -mt-1 rounded-b-sm border-b border-white/40" />
            </div>
          </div>

      {/* ========================================================= */}
      {/* PACK ARTWORK & BRANDING */}
      {/* ========================================================= */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-between p-3 text-center overflow-hidden">
        
        {/* Header Series Badge */}
        <div className="w-full">
          {isJP ? (
            <div className="bg-black/70 backdrop-blur-xs py-0.5 px-2 rounded border border-emerald-400/40 inline-block">
              <span className="text-[9px] font-black tracking-widest text-emerald-300 uppercase block">
                スカーレット&バイオレット
              </span>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-600 via-amber-500 to-violet-600 py-0.5 px-2.5 rounded-sm shadow-md inline-block">
              <span className="text-[9px] font-black tracking-wider text-white uppercase drop-shadow-sm">
                SCARLET & VIOLET
              </span>
            </div>
          )}
        </div>

        {/* Center Mascot & Logo Graphic */}
        <div className="my-auto py-2 flex flex-col items-center justify-center relative">
          
          {/* Background Aura */}
          <div
            className="absolute h-24 w-24 rounded-full blur-xl pointer-events-none opacity-50"
            style={{ background: product.accentColor }}
          />

          {/* Collection Mascot Silhouette / Graphic */}
          <div className="relative mb-2">
            <span className="text-5xl sm:text-6xl drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)] transform group-hover:scale-110 transition duration-300 block">
              {is30th ? '🎖️' : isPocket ? '📱' : is151 ? (isJP ? '🌸' : '🔥') : isPrismatic ? '✨' : '👑'}
            </span>
          </div>

          {/* Main Pack Title */}
          {is30th && (
            <div className="relative">
              <h3 className="font-black text-sm tracking-widest text-amber-300 drop-shadow-md uppercase">
                30TH CELEBRATION
              </h3>
              <p className="text-[9px] font-bold text-amber-200 uppercase">
                MEGA EVOLUTION
              </p>
            </div>
          )}

          {isPocket && (
            <div className="relative">
              <h3 className="font-black text-xs tracking-wider text-cyan-300 uppercase">
                TCG POCKET
              </h3>
              <p className="text-[9px] font-bold text-white uppercase">
                GENETIC APEX
              </p>
            </div>
          )}

          {is151 && !isJP && (
            <div className="relative">
              <h3 className="font-black text-2xl tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                151
              </h3>
              <p className="text-[9px] font-extrabold tracking-widest text-amber-300 uppercase -mt-1">
                MEW EXPANSION
              </p>
            </div>
          )}

          {is151 && isJP && (
            <div className="relative">
              <h3 className="font-black text-xs text-white leading-tight drop-shadow-md">
                強化拡張パック
              </h3>
              <p className="text-xl font-black text-emerald-300 tracking-wider">
                ポケモンカード151
              </p>
            </div>
          )}

          {isPrismatic && (
            <div className="relative">
              <h3 className="font-black text-sm tracking-widest text-white drop-shadow-[0_2px_8px_rgba(192,38,211,0.8)] uppercase">
                PRISMATIC
              </h3>
              <p className="text-xs font-black text-fuchsia-300 tracking-wider uppercase -mt-0.5">
                EVOLUTIONS
              </p>
            </div>
          )}

          {isCrownZenith && (
            <div className="relative">
              <h3 className="font-serif font-black text-sm tracking-widest text-amber-200 drop-shadow-md uppercase">
                CROWN ZENITH
              </h3>
              <p className="text-[8px] font-mono tracking-widest text-yellow-400 uppercase">
                GALARIAN GALLERY
              </p>
            </div>
          )}
        </div>

        {/* Bottom Additional Cards Badge */}
        <div className="w-full pt-1 border-t border-white/20">
          {isJP ? (
            <div className="text-[9px] font-bold text-zinc-300 flex justify-between px-1">
              <span>1パック / 7枚入り</span>
              <span className="text-emerald-400 font-mono">SV2a</span>
            </div>
          ) : is30th ? (
            <div className="flex flex-col items-center">
              <span className="font-black text-[9px] tracking-widest text-amber-300 uppercase">
                6 ALL-FOIL CARDS
              </span>
              <span className="text-[8px] text-zinc-400 font-mono">30TH ANNIVERSARY</span>
            </div>
          ) : isPocket ? (
            <div className="flex flex-col items-center">
              <span className="font-black text-[9px] tracking-widest text-cyan-300 uppercase">
                5 DIGITAL CARDS
              </span>
              <span className="text-[8px] text-zinc-400 font-mono">GENETIC APEX</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="font-black text-[9px] tracking-widest text-amber-200 uppercase">
                10 ADDITIONAL CARDS
              </span>
              <span className="text-[8px] text-zinc-400 font-mono">TRADING CARD GAME</span>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================= */}
      {/* BOTTOM HEAT-SEALED CRIMP */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full h-5 bg-gradient-to-t from-zinc-700 via-zinc-400 to-zinc-600 border-t border-black/40 flex items-center justify-center shadow-inner">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-black/60" />
        <div className="flex space-x-0.5 w-full justify-center opacity-40">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="w-0.5 h-4 bg-black" />
          ))}
        </div>
      </div>
        </>
      )}
    </div>
  );
};
