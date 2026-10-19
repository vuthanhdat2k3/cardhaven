'use client';

import React, { useState } from 'react';
import { CardPrinting, Rarity } from '@/types';
import { resolveCardCdnUrl, resolveCardImageUrl } from '@/data/cards';
import { EnergyIcon } from './EnergyIcon';
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

const RARITY_SYMBOLS: Record<Rarity, { symbol: string; color: string; label: string }> = {
  common: { symbol: '●', color: 'text-zinc-400', label: 'Common' },
  uncommon: { symbol: '◆', color: 'text-zinc-300', label: 'Uncommon' },
  rare: { symbol: '★', color: 'text-zinc-200', label: 'Rare' },
  holo_rare: { symbol: '★H', color: 'text-purple-400 font-bold', label: 'Holo Rare' },
  double_rare: { symbol: '★★', color: 'text-rose-400 font-bold', label: 'Double Rare (ex)' },
  ultra_rare: { symbol: '★★★', color: 'text-amber-300 font-bold', label: 'Ultra Rare' },
  special_illustration_rare: { symbol: '★★★ SIR', color: 'text-fuchsia-300 font-extrabold', label: 'Special Illustration Rare' },
  hyper_rare: { symbol: '★★★ HR', color: 'text-yellow-300 font-extrabold', label: 'Hyper Rare (Gold)' },
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
  const [failedCards, setFailedCards] = useState<Record<string, boolean>>({});
  const [cdnCards, setCdnCards] = useState<Record<string, boolean>>({});

  const cardKey = card.id;
  const isCdnActive = Boolean(cdnCards[cardKey]);
  const isFailed = Boolean(failedCards[cardKey]);

  const activeSrc = isCdnActive
    ? resolveCardCdnUrl(card)
    : card.imageUrl || resolveCardImageUrl(card);

  const handleImageError = () => {
    if (!isCdnActive) {
      const cdn = resolveCardCdnUrl(card);
      if (cdn && cdn !== activeSrc) {
        setCdnCards((prev) => ({ ...prev, [cardKey]: true }));
        return;
      }
    }
    setFailedCards((prev) => ({ ...prev, [cardKey]: true }));
  };

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

  const isFullArt =
    card.rarity === 'special_illustration_rare' ||
    card.rarity === 'hyper_rare' ||
    card.rarity === 'ultra_rare';

  const isCrownZenith = card.setId.includes('crz');
  const isJP = card.language === 'JP';
  const rarityMeta = RARITY_SYMBOLS[card.rarity] || RARITY_SYMBOLS.common;

  // Exact card proportions: 63mm x 88mm (~1 : 1.4)
  const sizeClasses = {
    sm: 'w-36 h-[200px] text-[9px]',
    md: 'w-48 h-[270px] text-[11px]',
    lg: 'w-64 h-[360px] text-xs',
    xl: 'w-76 h-[426px] text-sm',
  }[size];

  if (!isOwned) {
    return (
      <div
        onClick={onClick}
        className={`relative ${sizeClasses} rounded-2xl border-2 border-zinc-800 bg-zinc-950/90 p-4 flex flex-col items-center justify-center text-center shadow-md select-none cursor-pointer transition hover:border-zinc-700`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 mb-2">
          <Lock className="h-6 w-6" />
        </div>
        <p className="font-mono text-xs font-bold text-zinc-500">#{card.setNumber}</p>
        <p className="font-bold text-zinc-500 line-clamp-1">{card.name}</p>
        <span className={`mt-1 text-[10px] font-medium ${rarityMeta.color}`}>
          {rarityMeta.label}
        </span>
      </div>
    );
  }

  // Border Style based on expansion series
  const borderClass =
    card.rarity === 'hyper_rare'
      ? 'border-[#eab308] bg-gradient-to-b from-[#ca8a04] via-[#a16207] to-[#713f12]'
      : isFullArt
      ? 'border-indigo-400/80 bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950'
      : isCrownZenith
      ? 'border-[#eab308] bg-[#fef08a]' // Classic Yellow border for SWSH
      : isJP
      ? 'border-[#94a3b8] bg-[#cbd5e1]' // Japanese Silver border
      : 'border-[#94a3b8] bg-[#cbd5e1]'; // SV Modern Silver border

  const hasValidImage = Boolean(activeSrc) && !isFailed;

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: interactive
          ? `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : undefined,
        transition: rotateX === 0 && rotateY === 0 ? 'transform 0.4s ease-out' : 'none',
      }}
      className={`group relative ${sizeClasses} rounded-2xl overflow-hidden shadow-2xl select-none transition-all ${
        hasValidImage
          ? 'p-0 ring-1 ring-black/50 bg-zinc-950'
          : `border-4 p-1.5 ${borderClass}`
      }`}
    >
      {/* Background Foil Shimmer Overlay */}
      {card.foilPattern === 'rainbow_shimmer' && <div className="absolute inset-0 foil-rainbow-shimmer z-20 pointer-events-none rounded-2xl" />}
      {card.foilPattern === 'textured_gold' && <div className="absolute inset-0 foil-gold-glitter z-20 pointer-events-none rounded-2xl" />}
      {card.foilPattern === 'holo_sheen' && <div className="absolute inset-0 foil-holo-sheen z-20 pointer-events-none rounded-2xl" />}
      {card.foilPattern === 'cosmos_stars' && <div className="absolute inset-0 foil-holo-sheen opacity-60 z-20 pointer-events-none rounded-2xl" />}

      {/* Dynamic Cursor Glare */}
      {interactive && (
        <div
          className="absolute inset-0 pointer-events-none z-30 transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Japanese Masterball Mirror Stamp Watermark */}
      {card.name.includes('Masterball') && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 opacity-35">
          <div className="flex flex-col items-center text-purple-300">
            <span className="text-6xl drop-shadow-lg">🟣</span>
            <span className="font-mono text-[9px] font-black uppercase tracking-widest bg-black/60 px-1 rounded">MASTER BALL</span>
          </div>
        </div>
      )}

      {/* 30th Celebration Pikachu Stamp Watermark */}
      {card.setId === 'meg-30th-en' && card.name.toLowerCase().includes('pikachu') && !card.name.includes('Code Card') && (
        <div className="absolute top-2 right-2 pointer-events-none z-20">
          <span className="rounded-full bg-amber-500/90 text-black px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-md border border-yellow-200 flex items-center space-x-0.5">
            <span>⚡</span>
            <span>30th</span>
          </span>
        </div>
      )}

      {/* 30th Celebration RGB Mew (YOSHIROTTEN) Futuristic Rare Badge */}
      {card.setId === 'meg-30th-en' && card.id.includes('rgb') && (
        <div className="absolute top-2 right-2 pointer-events-none z-20">
          <span className={`rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider shadow-lg border flex items-center space-x-1 ${
            card.id.includes('rgb-r')
              ? 'bg-rose-600/90 text-white border-rose-300'
              : card.id.includes('rgb-g')
              ? 'bg-emerald-600/90 text-white border-emerald-300'
              : 'bg-blue-600/90 text-white border-blue-300'
          }`}>
            <span>{card.id.includes('rgb-r') ? '🔴' : card.id.includes('rgb-g') ? '🟢' : '🔵'}</span>
            <span>{card.setNumber}</span>
          </span>
        </div>
      )}

      {/* Authentic Pokémon TCG Live Code Card */}
      {card.name.includes('Code Card') || card.id.includes('code') ? (
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-zinc-950 via-emerald-950/70 to-zinc-950 border-2 border-emerald-500/50 p-3 flex flex-col justify-between text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-xl">🎟️</span>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">POKÉMON TCG LIVE</div>
                <div className="text-[8px] text-zinc-400">Digital Booster Code</div>
              </div>
            </div>
            <span className="rounded bg-emerald-500/20 px-1 py-0.5 text-[7px] font-mono font-bold text-emerald-300 border border-emerald-500/30">ONLINE CODE</span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center p-2 rounded-xl bg-black/60 border border-white/10 text-center">
            {/* Simulated QR Code */}
            <div className="w-16 h-16 bg-white p-1 rounded-md flex items-center justify-center shadow-md mb-2">
              <div className="grid grid-cols-4 gap-0.5 w-full h-full bg-zinc-900 p-0.5 rounded">
                <div className="bg-white col-span-2 row-span-2 rounded-xs"></div>
                <div className="bg-white"></div>
                <div className="bg-white"></div>
                <div className="bg-white"></div>
                <div className="bg-white col-span-2 row-span-2 rounded-xs"></div>
              </div>
            </div>
            <div className="text-[9px] font-mono font-bold tracking-widest text-amber-300 bg-zinc-900 px-2 py-0.5 rounded border border-amber-500/30">
              CEL30-9X4K-8M2P-91L7
            </div>
            <p className="text-[7.5px] text-zinc-400 mt-1.5 leading-tight">
              Quét mã QR hoặc nhập tại <span className="text-emerald-400 underline">pokemon.com/tcglive</span> để nhận booster pack kỹ thuật số.
            </p>
          </div>

          <div className="text-[7px] text-zinc-500 text-center border-t border-white/5 pt-1">
            © 2026 Pokémon / Nintendo / Creatures / GAME FREAK
          </div>
        </div>
      ) : hasValidImage ? (
        <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-zinc-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSrc}
            alt={card.name}
            onError={handleImageError}
            className="w-full h-full object-fill rounded-2xl filter drop-shadow-md select-none"
            loading="lazy"
          />
        </div>
      ) : (
        /* ========================================================= */
        /* VECTOR FALLBACK: INNER CARD BODY CONTAINER */
        /* ========================================================= */
        <div className="relative z-10 w-full h-full rounded-xl bg-zinc-950 overflow-hidden flex flex-col justify-between border border-black/40 text-zinc-100">
        
        {/* ========================================================= */}
        {/* 1. CARD HEADER: Stage, Name, HP, Energy Type */}
        {/* ========================================================= */}
        <div className="px-2.5 py-1 bg-gradient-to-b from-zinc-800 to-zinc-900 border-b border-white/10 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-1.5 truncate">
            {card.stage && (
              <span className="rounded bg-black/70 px-1 py-0.2 text-[8px] font-black uppercase text-amber-300 border border-amber-500/30">
                {card.stage}
              </span>
            )}
            <h4 className="font-black text-white tracking-wide truncate">{card.name}</h4>
          </div>

          {card.hp && card.pokemonType && (
            <div className="flex items-center space-x-1 font-mono text-xs font-black shrink-0">
              <span className="text-[9px] text-zinc-400">HP</span>
              <span className="text-white text-sm">{card.hp}</span>
              <EnergyIcon type={card.pokemonType} size="sm" />
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 2. ARTWORK WINDOW */}
        {/* ========================================================= */}
        <div
          className={`relative mx-2 my-1 rounded-lg overflow-hidden flex items-center justify-center border-2 border-zinc-700/80 shadow-inner ${
            isFullArt ? 'h-[46%]' : 'h-[42%]'
          }`}
          style={{
            background: `radial-gradient(circle at 50% 30%, ${card.accentColor}55 0%, #09090b 95%)`,
          }}
        >
          {/* Artwork Emoji Theme with 3D drop shadow */}
          <span className="text-5xl sm:text-6xl transform group-hover:scale-110 transition duration-300 drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)]">
            {card.illustrationTheme}
          </span>

          {/* Illustrator Credit */}
          <div className="absolute bottom-1 right-2 text-[8px] font-medium text-white/70 bg-black/60 px-1 rounded backdrop-blur-xs">
            Illus. {card.artist}
          </div>

          {/* JP Badge if Japanese */}
          {card.language === 'JP' && (
            <div className="absolute top-1 left-2 text-[8px] font-bold text-emerald-300 bg-black/70 px-1 rounded">
              JP 151
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 3. ATTACKS & RULES BOX */}
        {/* ========================================================= */}
        <div className="px-2 space-y-1 my-auto">
          {card.attacks && card.attacks.length > 0 ? (
            card.attacks.slice(0, 2).map((atk, i) => (
              <div key={i} className="rounded bg-black/40 p-1 border border-white/5">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  {/* Energy Cost Icons */}
                  <div className="flex items-center space-x-0.5 mr-1">
                    {atk.cost && atk.cost.length > 0 ? (
                      atk.cost.map((cType, cIdx) => <EnergyIcon key={cIdx} type={cType} size="xs" />)
                    ) : (
                      <span className="text-[8px] text-zinc-500 font-mono">FREE</span>
                    )}
                    <span className="text-amber-200 ml-1 truncate">{atk.name}</span>
                  </div>
                  <span className="font-mono text-white font-black shrink-0">{atk.damage}</span>
                </div>
                {atk.text && (
                  <p className="text-[8px] text-zinc-400 line-clamp-1 leading-tight mt-0.5">{atk.text}</p>
                )}
              </div>
            ))
          ) : (
            <div className="rounded bg-black/40 p-1 text-[9px] text-zinc-400 italic">
              {card.flavorText || 'Standard basic Energy card for powering attacks.'}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 4. AUTHENTIC CARD FOOTER */}
        {/* ========================================================= */}
        <div className="px-2 py-1 bg-black/80 border-t border-white/10 text-[8px] text-zinc-400 flex flex-col space-y-0.5">
          {/* Weakness, Resistance, Retreat Row */}
          <div className="flex items-center justify-between border-b border-white/5 pb-0.5 font-mono text-[8px]">
            <div className="flex items-center space-x-1">
              <span>weakness</span>
              {card.weakness ? (
                <div className="flex items-center">
                  <EnergyIcon type={card.weakness.type} size="xs" />
                  <span className="ml-0.5">{card.weakness.modifier}</span>
                </div>
              ) : (
                <span>none</span>
              )}
            </div>
            <div>resistance —</div>
            <div className="flex items-center space-x-0.5">
              <span>retreat</span>
              {Array.from({ length: card.retreatCost || 1 }).map((_, rIdx) => (
                <EnergyIcon key={rIdx} type="Colorless" size="xs" />
              ))}
            </div>
          </div>

          {/* Set Code, Card Number, Regulation Mark, Value */}
          <div className="flex items-center justify-between font-mono pt-0.5">
            <div className="flex items-center space-x-1">
              <span className="bg-zinc-800 text-white px-1 py-0.2 rounded font-bold">
                {card.setId.includes('151') ? (isJP ? 'SV2a' : 'MEW') : card.setId.includes('pre') ? 'PRE' : 'CRZ'}
              </span>
              <span className="font-bold text-white">#{card.setNumber}/{card.totalInSet}</span>
              <span className={rarityMeta.color}>{rarityMeta.symbol}</span>
              <span className="border border-zinc-700 px-0.5 text-zinc-400">[G]</span>
            </div>

            {/* Display market price ONLY on valuable rare/chase cards */}
            {card.estimatedValue > 0 && !['common', 'uncommon'].includes(card.rarity) && card.cardType !== 'energy' && (
              <span className="text-emerald-400 font-sans font-bold">
                ${card.estimatedValue.toFixed(2)}
              </span>
            )}
          </div>
        </div>

      </div>
      )}

      {/* Floating Market Price Badge on High-Res Scanned Cards for valuable hits */}
      {hasValidImage && card.estimatedValue >= 1.00 && !['common', 'uncommon'].includes(card.rarity) && card.cardType !== 'energy' && (
        <div className="absolute bottom-2 right-2 z-30 pointer-events-none">
          <div className="rounded-md bg-black/85 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-black text-emerald-400 border border-emerald-500/40 shadow-lg flex items-center space-x-0.5">
            <span className="text-[7.5px] text-zinc-400">TCG</span>
            <span>${card.estimatedValue.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Duplicate Count Badge */}
      {showDuplicateBadge && count > 1 && (
        <div className="absolute top-1 right-1 z-40 flex h-5 px-1.5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-black shadow-lg shadow-amber-500/50 ring-1 ring-white">
          x{count}
        </div>
      )}
    </div>
  );
};
