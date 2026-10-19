'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { OpeningSession, OpeningCardResult } from '@/types';
import { useGame } from '@/lib/store/game-context';
import { soundEffects } from '@/lib/audio/sound-effects';
import { PokemonCardView } from '@/components/ui/PokemonCardView';
import { BoosterPackFoil } from '@/components/ui/BoosterPackFoil';
import { PRODUCTS_MAP } from '@/data/products';
import {
  Sparkles,
  ChevronRight,
  FastForward,
  CheckCircle,
} from 'lucide-react';

interface PackOpeningStudioProps {
  session: OpeningSession;
  onFinish: () => void;
  onOpenAnother?: () => void;
}

export const PackOpeningStudio: React.FC<PackOpeningStudioProps> = ({
  session,
  onFinish,
  onOpenAnother,
}) => {
  const { settings, inventory } = useGame();

  // Phase 1: 'sealed' -> Phase 2: 'revealing' -> Phase 3: 'summary'
  const [phase, setPhase] = useState<'sealed' | 'revealing' | 'summary'>('sealed');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [tearStage, setTearStage] = useState<'intact' | 'ripping' | 'emerging'>('intact');
  const [screenShakeActive, setScreenShakeActive] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);

  const totalCards = session.cards.length;
  const currentCardResult: OpeningCardResult = session.cards[currentCardIndex];

  // Check if user still has this pack in inventory for "Open Another"
  const remainingCount = inventory.find((i) => i.productId === session.productId)?.quantity || 0;
  const product = PRODUCTS_MAP.get(session.productId);
  const isJP = product?.language === 'JP' || session.productName.includes('(JP)');

  // Trigger confetti & sound effects tailored specifically to each rarity tier
  const triggerHitCelebration = (rarity: string) => {
    if (['special_illustration_rare', 'hyper_rare'].includes(rarity)) {
      setScreenShakeActive(true);
      setTimeout(() => setScreenShakeActive(false), 600);
      soundEffects.playUltraRareFanfare();

      // Multi-stage fireworks for God Pull
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#ff007f', '#00e5ff', '#ff8800', '#a855f7'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ffd700', '#ffffff'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ffd700', '#ffffff'],
        });
      }, 250);
    } else if (rarity === 'ultra_rare') {
      soundEffects.playUltraRareFanfare();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#ffd700'],
      });
    } else if (rarity === 'double_rare') {
      soundEffects.playHoloShimmer();
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff'],
      });
    } else if (['holo_rare', 'rare'].includes(rarity)) {
      soundEffects.playHoloShimmer();
    } else {
      soundEffects.playCardFlip();
    }
  };

  const handleTearPack = () => {
    if (tearStage !== 'intact') return;
    setTearStage('ripping');
    soundEffects.playPackTear();

    // Metallic silver & gold confetti dust flying out of the ripped crimp
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.35 },
      colors: ['#c0c0c0', '#e2e8f0', '#ffd700', '#ffffff'],
    });

    const isInstant = settings.animationSpeed === 'instant';
    const isFast = settings.animationSpeed === 'fast';

    setTimeout(() => {
      setTearStage('emerging');
    }, isInstant ? 50 : isFast ? 200 : 400);

    setTimeout(() => {
      setPhase('revealing');
      setCurrentCardIndex(0);
      setCardRevealed(false);
      setTearStage('intact');
    }, isInstant ? 150 : isFast ? 450 : 850);
  };

  const handleRevealCard = () => {
    if (!cardRevealed) {
      setCardRevealed(true);
      triggerHitCelebration(currentCardResult.printing.rarity);
    } else {
      // Advance to next card
      if (currentCardIndex < totalCards - 1) {
        soundEffects.playCardFlip();
        setCurrentCardIndex((prev) => prev + 1);
        setCardRevealed(false);
      } else {
        // All cards revealed! Go to summary
        setPhase('summary');
        soundEffects.playHoloShimmer();
      }
    }
  };

  const handleSkipAll = () => {
    setPhase('summary');
    soundEffects.playHoloShimmer();
  };

  const currentRarity = currentCardResult?.printing.rarity;
  const isGodPull = ['special_illustration_rare', 'hyper_rare'].includes(currentRarity);
  const isUltraRare = currentRarity === 'ultra_rare';
  const isDoubleRare = currentRarity === 'double_rare';
  const isHolo = currentRarity === 'holo_rare';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#08090c] text-white overflow-hidden p-4 select-none ${
        screenShakeActive ? 'screen-shake' : ''
      }`}
    >
      {/* Background Arena Lighting (Dims darker on God Pull for dramatic spotlight) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
          cardRevealed && isGodPull
            ? 'bg-black/90'
            : 'bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]'
        }`}
      />

      {/* Top Header Bar */}
      <div className="relative z-20 flex w-full max-w-4xl items-center justify-between py-2 border-b border-zinc-800">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            Cinematic Opening Studio
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-white truncate max-w-xs sm:max-w-md">
            {session.productName}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          {phase === 'revealing' && (
            <button
              onClick={handleSkipAll}
              className="flex items-center space-x-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition"
            >
              <FastForward className="h-3.5 w-3.5" />
              <span>Xem Tất Cả</span>
            </button>
          )}

          <button
            onClick={onFinish}
            className="rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-bold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Main Center Stage */}
      <div className="relative z-10 flex flex-1 w-full items-center justify-center my-4">
        {/* ========================================================= */}
        {/* PHASE 1: SEALED PACK READY TO TEAR */}
        {/* ========================================================= */}
        {phase === 'sealed' && (
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
            {/* The Authentic Pack Foil with Realistic Tear Mechanism */}
            <div
              onClick={handleTearPack}
              className="relative cursor-pointer transition-all duration-300 hover:scale-102 flex flex-col items-center"
            >
              {/* Flying torn top piece during tear animation */}
              {(tearStage === 'ripping' || tearStage === 'emerging') && (
                <div className="pack-tear-flying absolute -top-4 left-0 right-0 z-30 pointer-events-none">
                  <div className="h-10 w-full bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-600 rounded-t-lg shadow-xl border-b-2 border-white/70 flex items-center justify-center">
                    <div className="flex space-x-0.5 opacity-60">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div key={i} className="w-0.5 h-6 bg-black/40" />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Emergent card deck sliding up out of the pack wrapper */}
              {tearStage === 'emerging' && (
                <div className="absolute -top-20 inset-x-4 z-10 cards-emerge flex justify-center pointer-events-none">
                  <div className="h-36 w-52 rounded-xl bg-gradient-to-b from-blue-900 to-indigo-950 border-2 border-amber-400/50 shadow-2xl flex flex-col items-center pt-2">
                    <div className="h-1.5 w-16 rounded-full bg-amber-400/70" />
                    <span className="text-[10px] font-mono font-bold text-amber-200 mt-2">
                      POKÉMON CARDS DECK
                    </span>
                  </div>
                </div>
              )}

              {/* Top tear guideline overlay when intact */}
              {tearStage === 'intact' && (
                <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-center pointer-events-none">
                  <div className="rounded-full bg-black/70 backdrop-blur-xs border border-amber-400/60 px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-300 shadow-lg flex items-center space-x-1.5">
                    <span>✂</span>
                    <span>NHẤN ĐỂ XÉ SEAL</span>
                  </div>
                </div>
              )}

              {product ? (
                <BoosterPackFoil
                  product={product}
                  size="xl"
                  interactive={false}
                  className="shadow-2xl shadow-amber-500/25"
                />
              ) : (
                <div className="h-[440px] w-64 rounded-xl border-2 border-amber-500 bg-zinc-900 flex items-center justify-center">
                  <span className="text-xl font-bold">POKÉMON TCG</span>
                </div>
              )}
            </div>

            {/* Instruction button */}
            <button
              onClick={handleTearPack}
              disabled={tearStage !== 'intact'}
              className="mt-6 flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-10 py-3.5 text-sm font-black text-black shadow-2xl shadow-amber-500/30 hover:brightness-110 active:scale-95 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>
                {tearStage === 'ripping'
                  ? 'Đang Xé Vỏ Gói...'
                  : tearStage === 'emerging'
                  ? 'Lấy Bộ Thẻ Ra...'
                  : '✂ Xé Niêm Phong Gói Này'}
              </span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 2: SEQUENTIAL CARD REVEAL WITH RARITY HIT VFX */}
        {/* ========================================================= */}
        {phase === 'revealing' && currentCardResult && (
          <div className="relative flex flex-col items-center max-w-sm w-full">
            {/* Cosmic Nebula Aura for God Pull / SIR / Hyper Rare */}
            {cardRevealed && isGodPull && (
              <div className="absolute -inset-24 rounded-full bg-[radial-gradient(circle,_rgba(234,179,8,0.45)_0%,_rgba(168,85,247,0.3)_40%,_transparent_70%)] blur-2xl cosmic-nebula pointer-events-none z-0" />
            )}

            {/* Card Progress Indicator */}
            <div className="relative z-10 flex items-center space-x-2 mb-3">
              <span className="text-xs font-mono text-zinc-400">
                Thẻ bài <strong className="text-amber-400">{currentCardIndex + 1}</strong> / {totalCards}
              </span>
              <div className="flex space-x-1">
                {session.cards.map((c, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-3 rounded-full transition-all ${
                      i < currentCardIndex
                        ? 'bg-zinc-600'
                        : i === currentCardIndex
                        ? 'bg-amber-400 w-5'
                        : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Rarity-Tiered Celebration Banner */}
            {cardRevealed && (
              <div className="relative z-20 mb-3 animate-in zoom-in duration-300">
                {currentCardResult.printing.name.includes('Code Card') ? (
                  <div className="rounded-full bg-emerald-950/90 border border-emerald-400/60 px-4 py-1 text-xs font-black tracking-wider text-emerald-300 shadow-md flex items-center space-x-1.5">
                    <span>🎟️</span>
                    <span>POKÉMON TCG LIVE CODE CARD</span>
                  </div>
                ) : currentCardResult.printing.setId === 'meg-30th-en' && currentCardResult.printing.name.toLowerCase().includes('pikachu') ? (
                  <div className="rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-lg shadow-amber-500/50 flex items-center space-x-1.5 animate-pulse">
                    <span>⚡</span>
                    <span>30TH PIKACHU VARIANT GUARANTEED</span>
                    <span>⚡</span>
                  </div>
                ) : currentCardResult.printing.setId === 'meg-30th-en' && currentCardResult.printing.name.includes('Classic') ? (
                  <div className="rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 px-5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-indigo-500/50">
                    🏆 CLASSIC COLLECTION VINTAGE REMAKE 🏆
                  </div>
                ) : isGodPull ? (
                  <div className="bg-gradient-to-r from-amber-500 via-fuchsia-500 to-amber-400 p-0.5 rounded-full shadow-[0_0_25px_rgba(234,179,8,0.8)]">
                    <div className="bg-black/90 backdrop-blur-md px-6 py-1.5 rounded-full flex items-center space-x-2">
                      <span className="text-amber-300 text-sm animate-pulse">★</span>
                      <span className="text-xs sm:text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-fuchsia-300 uppercase">
                        {currentRarity === 'hyper_rare'
                          ? 'GOD HIT: HYPER RARE GOLD SECRET'
                          : 'CHASE HIT: SPECIAL ILLUSTRATION RARE'}
                      </span>
                      <span className="text-amber-300 text-sm animate-pulse">★</span>
                    </div>
                  </div>
                ) : isUltraRare ? (
                  <div className="rounded-full bg-gradient-to-r from-purple-600 to-amber-500 px-5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-purple-500/50">
                    ★★★ ULTRA RARE (FULL ART) ★★★
                  </div>
                ) : isDoubleRare ? (
                  <div className="rounded-full bg-gradient-to-r from-rose-600 to-amber-500 px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-rose-500/50">
                    ★★ DOUBLE RARE (ex / MEGA) ★★
                  </div>
                ) : isHolo ? (
                  <div className="rounded-full bg-zinc-800/90 border border-purple-400/40 px-3 py-0.5 text-[11px] font-bold tracking-wider text-purple-300 shadow-md">
                    ★ HOLO RARE HIT
                  </div>
                ) : null}
              </div>
            )}

            {/* The Active Card (Front or Face Down) */}
            <div className="relative cursor-pointer z-10" onClick={handleRevealCard}>
              {!cardRevealed ? (
                // Authentic 1:1 Face Down Card Back
                <div className="relative h-[430px] w-[308px] rounded-2xl border-4 border-[#0b132b] bg-[#1c2d5a] p-4 flex flex-col items-center justify-between shadow-2xl shadow-blue-950/60 transform transition hover:scale-102 active:scale-98 overflow-hidden select-none">
                  {/* Outer subtle frame */}
                  <div className="absolute inset-1.5 rounded-xl border border-amber-400/30 pointer-events-none" />

                  {/* Cosmic Blue Galaxy background */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-700/50 via-indigo-950/90 to-[#070b19] pointer-events-none" />

                  {/* Top: Pokémon Logo / Pocket Monsters Header */}
                  <div className="relative z-10 w-full text-center pt-2">
                    {isJP ? (
                      <span className="font-black text-xs tracking-widest text-amber-300 uppercase drop-shadow-md">
                        ★ POCKET MONSTERS ★
                      </span>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="font-black text-2xl tracking-wider text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] -mb-1">
                          Pokémon
                        </span>
                        <span className="text-[8px] font-bold text-amber-200/80 tracking-widest uppercase">
                          TRADING CARD GAME
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Center: Iconic Pokéball with Energy Aura */}
                  <div className="relative z-10 my-auto flex items-center justify-center">
                    <div className="absolute h-36 w-36 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />

                    {/* Outer Pokéball sphere */}
                    <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-b from-red-600 0%, #dc2626 50%, #f8fafc 50%, #f8fafc 100%) shadow-2xl ring-4 ring-[#0b132b] overflow-hidden">
                      {/* Center band */}
                      <div className="absolute h-3.5 w-full bg-[#0b132b]" />
                      {/* Center button */}
                      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white border-4 border-[#0b132b] shadow-lg">
                        <div className="h-3.5 w-3.5 rounded-full bg-zinc-200 border-2 border-[#0b132b]" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Tap to reveal */}
                  <div className="relative z-10 text-center pb-1">
                    <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-4 py-1 text-[11px] font-black tracking-widest text-amber-300 uppercase shadow-sm">
                      CHẠM ĐỂ LẬT THẺ
                    </span>
                  </div>
                </div>
              ) : (
                // Revealed Front with Rarity-Tiered Aura
                <div
                  className={`animate-in flip-in-y duration-300 relative ${
                    isGodPull
                      ? 'ring-4 ring-amber-400/90 ring-offset-4 ring-offset-black rounded-2xl shadow-[0_0_50px_rgba(251,191,36,0.8)]'
                      : isDoubleRare
                      ? 'shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                      : ''
                  }`}
                >
                  <PokemonCardView
                    card={currentCardResult.printing}
                    isOwned={true}
                    interactive={true}
                    size="xl"
                    showDuplicateBadge={false}
                  />

                  {/* "NEW" badge indicator */}
                  {currentCardResult.isNew && (
                    <div className="absolute -top-3 -right-3 z-30 rounded-full bg-emerald-500 px-3 py-1 text-xs font-black text-black shadow-lg shadow-emerald-500/50 animate-bounce">
                      ★ MỚI SỞ HỮU
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Reveal / Next Button */}
            <button
              onClick={handleRevealCard}
              className="mt-6 flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3 text-sm font-black text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition z-10"
            >
              <span>
                {!cardRevealed
                  ? 'Lật Thẻ Này'
                  : currentCardIndex < totalCards - 1
                  ? 'Thẻ Tiếp Theo'
                  : 'Xem Tổng Kết Gói'}
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* PHASE 3: PULL SUMMARY SCREEN */}
        {/* ========================================================= */}
        {phase === 'summary' && (
          <div className="flex flex-col items-center w-full max-w-5xl h-full overflow-y-auto pr-2 py-4">
            
            {/* Top Pull Highlight Box */}
            <div className="flex items-center space-x-4 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-amber-950/40 p-4 mb-6 shadow-xl w-full justify-between">
              <div className="flex items-center space-x-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xl">
                  🏆
                </span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">Top Pull Đẹp Nhất</span>
                  <h4 className="text-base font-black text-white">{session.topPull.name}</h4>
                  {session.topPull.estimatedValue > 0 && !['common', 'uncommon'].includes(session.topPull.rarity) ? (
                    <p className="text-xs text-amber-300 font-bold">
                      Trị giá thị trường: ${session.topPull.estimatedValue.toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">Thẻ phổ thông</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Tổng giá trị pack</span>
                <span className="text-xl font-black text-emerald-400">${session.totalMarketValue.toFixed(2)}</span>
              </div>
            </div>

            {/* Grid of All Cards Pulled */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
              {session.cards.map((res, idx) => {
                const hasMarketPrice = res.printing.estimatedValue > 0 && !['common', 'uncommon'].includes(res.printing.rarity);
                return (
                  <div key={idx} className="relative flex flex-col items-center">
                    <PokemonCardView
                      card={res.printing}
                      isOwned={true}
                      interactive={false}
                      size="md"
                      showDuplicateBadge={false}
                    />
                    <div className="mt-1 flex items-center space-x-1.5">
                      {res.isNew && (
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-300 border border-emerald-500/40">
                          NEW
                        </span>
                      )}
                      {hasMarketPrice && (
                        <span className="rounded bg-black/90 px-2 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/40 shadow-xs">
                          ${res.printing.estimatedValue.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {remainingCount > 0 && onOpenAnother && (
                <button
                  onClick={onOpenAnother}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-black text-black shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 active:scale-95 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Mở Tiếp Gói Nữa (Còn {remainingCount})</span>
                </button>
              )}

              <button
                onClick={onFinish}
                className="flex items-center space-x-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-bold text-zinc-200 hover:bg-zinc-700 hover:text-white transition"
              >
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>Lưu Vào Album & Quay Lại</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
