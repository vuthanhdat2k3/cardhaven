'use client';

import React, { useState } from 'react';
import { CardPrinting, Rarity } from '@/types';
import { Lock } from 'lucide-react';

interface PokemonCardViewProps {
  card: CardPrinting;
  isOwned?: boolean;
  count?: number;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  showDuplicateBadge?: boolean;
}

const RARITY_LABELS: Record<Rarity, { label: string; color: string; border: string }> = {
  common: { label: 'Common', color: 'text-zinc-400', border: 'border-zinc-700' },
  uncommon: { label: 'Uncommon', color: 'text-emerald-400', border: 'border-emerald-600/50' },
  rare: { label: 'Rare', color: 'text-blue-400', border: 'border-blue-500/50' },
  holo_rare: { label: 'Holo Rare', color: 'text-purple-400', border: 'border-purple-500' },
  double_rare: { label: 'Double Rare (ex)', color: 'text-rose-400', border: 'border-rose-500 shadow-rose-500/20' },
  ultra_rare: { label: 'Ultra Rare (Full Art)', color: 'text-amber-300', border: 'border-amber-400 shadow-amber-500/30' },
  special_illustration_rare: {
    label: 'Special Illustration Rare',
    color: 'text-fuchsia-300',
    border: 'border-fuchsia-400 shadow-fuchsia-500/40',
  },
  hyper_rare: {
    label: 'Hyper Rare (Gold Secret)',
    color: 'text-yellow-300 font-extrabold',
    border: 'border-yellow-300 shadow-yellow-500/50',
  },
};

export const PokemonCardView: React.FC<PokemonCardViewProps> = ({
  card,
  isOwned = true,
  count = 1,
  interactive = true,
  size = 'md',
  onClick,
  showDuplicateBadge = true,
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const rarityMeta = RARITY_LABELS[card.rarity] || RARITY_LABELS.common;

  // Sizing styles
  const sizeClasses = {
    sm: 'w-36 h-52 text-[10px]',
    md: 'w-48 h-68 text-xs',
    lg: 'w-64 h-90 text-sm',
    xl: 'w-80 h-112 text-base',
  }[size];

  if (!isOwned) {
    return (
      <div
        onClick={onClick}
        className={`relative ${sizeClasses} rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 flex flex-col items-center justify-center text-center shadow-md cursor-pointer transition hover:border-zinc-700`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 mb-2">
          <Lock className="h-6 w-6" />
        </div>
        <p className="font-mono text-[11px] font-bold text-zinc-500">#{card.setNumber}</p>
        <p className="font-semibold text-zinc-600 line-clamp-1">{card.name}</p>
        <span className={`mt-1 text-[10px] font-medium ${rarityMeta.color}`}>
          {rarityMeta.label}
        </span>
      </div>
    );
  }

  const isFullArt =
    card.rarity === 'special_illustration_rare' ||
    card.rarity === 'hyper_rare' ||
    card.rarity === 'ultra_rare';

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactive
          ? `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`
          : undefined,
        transition: rotateX === 0 && rotateY === 0 ? 'transform 0.4s ease-out' : 'none',
      }}
      className={`group relative ${sizeClasses} rounded-xl overflow-hidden border-2 cursor-pointer shadow-xl select-none transition-shadow ${
        rarityMeta.border
      } ${
        card.rarity === 'hyper_rare'
          ? 'bg-gradient-to-b from-yellow-700 via-amber-900 to-yellow-950'
          : card.rarity === 'special_illustration_rare'
          ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950'
          : 'bg-zinc-900'
      }`}
    >
      {/* Background Foil Shimmer Overlay */}
      {card.foilPattern === 'rainbow_shimmer' && <div className="absolute inset-0 foil-rainbow-shimmer z-10" />}
      {card.foilPattern === 'textured_gold' && <div className="absolute inset-0 foil-gold-glitter z-10" />}
      {card.foilPattern === 'holo_sheen' && <div className="absolute inset-0 foil-holo-sheen z-10" />}
      {card.foilPattern === 'cosmos_stars' && <div className="absolute inset-0 foil-rainbow-shimmer opacity-40 z-10" />}

      {/* Dynamic Cursor Glare */}
      {interactive && (
        <div
          className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.35) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Card Header */}
      <div className="relative z-10 flex items-center justify-between p-2 pb-1 bg-black/40 backdrop-blur-xs border-b border-white/10">
        <div className="flex items-center space-x-1.5 truncate">
          {card.stage && (
            <span className="rounded bg-zinc-800 px-1 py-0.2 text-[8px] font-bold uppercase text-zinc-300">
              {card.stage}
            </span>
          )}
          <span className="font-bold text-white tracking-wide truncate">{card.name}</span>
        </div>
        {card.hp && (
          <div className="flex items-center space-x-1 font-mono text-xs font-black text-rose-300 shrink-0">
            <span className="text-[9px] text-zinc-400">HP</span>
            <span>{card.hp}</span>
            <span className="text-amber-400">{card.illustrationTheme}</span>
          </div>
        )}
      </div>

      {/* Artwork Box */}
      <div
        className={`relative z-10 mx-2 my-1.5 overflow-hidden rounded-lg flex items-center justify-center shadow-inner border border-white/15 ${
          isFullArt ? 'h-[46%]' : 'h-[42%]'
        }`}
        style={{
          background: `radial-gradient(circle, ${card.accentColor}55 0%, #09090b 90%)`,
        }}
      >
        <span className="text-5xl transform transition-transform duration-300 group-hover:scale-115">
          {card.illustrationTheme}
        </span>
        <div className="absolute bottom-1 right-2 text-[9px] font-medium text-white/60">
          Illus. {card.artist}
        </div>
        {card.language === 'JP' && (
          <div className="absolute top-1 left-2 text-[9px] font-semibold text-emerald-300 bg-black/60 px-1 rounded">
            JP
          </div>
        )}
      </div>

      {/* Attacks / Abilities Section */}
      <div className="relative z-10 px-2 space-y-1 text-zinc-200">
        {card.attacks && card.attacks.length > 0 ? (
          card.attacks.slice(0, 2).map((atk, i) => (
            <div key={i} className="rounded bg-black/30 p-1 border border-white/5">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-amber-200 truncate">{atk.name}</span>
                <span className="font-mono text-amber-400 shrink-0 ml-1">{atk.damage}</span>
              </div>
              {atk.text && (
                <p className="text-[9px] text-zinc-400 line-clamp-1 leading-tight mt-0.5">{atk.text}</p>
              )}
            </div>
          ))
        ) : (
          <div className="rounded bg-black/30 p-1 text-[10px] text-zinc-400 italic">
            {card.flavorText || 'Standard basic Energy card for powering attacks.'}
          </div>
        )}
      </div>

      {/* Card Footer: Set number, rarity, and price */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex items-center justify-between p-1.5 bg-black/60 backdrop-blur-xs border-t border-white/10 text-[9px] text-zinc-400 font-mono">
        <div>
          <span>#{card.setNumber}</span>
          <span className="text-zinc-600">/{card.totalInSet}</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className={`font-bold ${rarityMeta.color}`}>
            {card.rarity === 'hyper_rare' || card.rarity === 'special_illustration_rare' ? '★' : '◆'}
          </span>
          <span className="text-amber-300 font-sans font-bold">
            ${card.estimatedValue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Duplicates Counter Badge */}
      {showDuplicateBadge && count > 1 && (
        <div className="absolute top-1 right-1 z-30 flex h-5 px-1.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-black shadow-lg shadow-amber-500/50 ring-1 ring-white">
          x{count}
        </div>
      )}
    </div>
  );
};
