'use client';

import React, { useState, useMemo } from 'react';
import { CardPrinting } from '@/types';
import { CARD_PRINTINGS } from '@/data/cards';
import { POKEMON_SETS } from '@/data/sets';
import { useGame } from '@/lib/store/game-context';
import { PokemonCardView } from '@/components/ui/PokemonCardView';
import {
  BookOpen,
  Search,
  Filter,
  X,
} from 'lucide-react';

export const CollectionAlbum: React.FC = () => {
  const { collection, getCardCount, getSetCompletion } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState<string>('ALL');
  const [selectedRarity, setSelectedRarity] = useState<string>('ALL');
  const [ownershipFilter, setOwnershipFilter] = useState<'ALL' | 'OWNED' | 'MISSING'>('ALL');
  const [inspectedCard, setInspectedCard] = useState<CardPrinting | null>(null);

  // Filtered Cards
  const displayedCards = useMemo(() => {
    return CARD_PRINTINGS.filter((card) => {
      const count = getCardCount(card.id);
      const isOwned = count > 0;

      if (ownershipFilter === 'OWNED' && !isOwned) return false;
      if (ownershipFilter === 'MISSING' && isOwned) return false;

      if (selectedSet !== 'ALL' && card.setId !== selectedSet) return false;
      if (selectedRarity !== 'ALL' && card.rarity !== selectedRarity) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = card.name.toLowerCase().includes(q);
        const matchesNumber = card.setNumber.includes(q);
        const matchesArtist = card.artist.toLowerCase().includes(q);
        if (!matchesName && !matchesNumber && !matchesArtist) return false;
      }

      return true;
    });
  }, [searchQuery, selectedSet, selectedRarity, ownershipFilter, getCardCount]);

  // Overall Statistics
  const totalUniqueOwned = CARD_PRINTINGS.filter((c) => getCardCount(c.id) > 0).length;
  const totalCardEntries = collection.reduce((sum, entry) => sum + entry.count, 0);
  const totalPortfolioValue = CARD_PRINTINGS.reduce((sum, c) => {
    const count = getCardCount(c.id);
    return sum + (count > 0 ? c.estimatedValue * count : 0);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      
      {/* Top Album Header & Metrics */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
              <BookOpen className="h-4 w-4" />
              <span>Master Collector Binder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Album Bộ Sưu Tập Thẻ Bài</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
              Theo dõi toàn bộ thẻ bài đã mở từ các expansion packs. Khám phá các thẻ Illustration Rare bí mật và hoàn thiện mục tiêu Master Set.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Thẻ Khác Nhau</span>
              <span className="text-lg font-black text-amber-300">
                {totalUniqueOwned} / {CARD_PRINTINGS.length}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Tổng Bản Sao</span>
              <span className="text-lg font-black text-indigo-300">{totalCardEntries} Thẻ</span>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Ước Tính Trị Giá</span>
              <span className="text-lg font-black text-emerald-400">${totalPortfolioValue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Set Completion Progress Row */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
            Tiến độ hoàn thành từng Expansion Set:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POKEMON_SETS.map((set) => {
              const comp = getSetCompletion(set.id);
              return (
                <div
                  key={set.id}
                  onClick={() => setSelectedSet(set.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    selectedSet === set.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-white truncate">{set.name}</span>
                    <span className="text-amber-400 ml-1">{comp.percentage}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                      style={{ width: `${comp.percentage}%` }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-zinc-400">
                    <span>{comp.ownedUnique} đã sưu tầm</span>
                    <span>{set.language}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên Pokémon, số thẻ, họa sĩ..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedSet}
            onChange={(e) => setSelectedSet(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">Tất cả Set Thẻ</option>
            {POKEMON_SETS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">Tất cả độ hiếm (Rarity)</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="holo_rare">Holo Rare</option>
            <option value="double_rare">Double Rare (ex)</option>
            <option value="ultra_rare">Ultra Rare (Full Art)</option>
            <option value="special_illustration_rare">Special Illustration Rare (SIR)</option>
            <option value="hyper_rare">Hyper Rare (Gold)</option>
          </select>
        </div>

        {/* Ownership Toggle Buttons */}
        <div className="flex rounded-xl border border-zinc-800 bg-zinc-900 p-1">
          <button
            onClick={() => setOwnershipFilter('ALL')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              ownershipFilter === 'ALL' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setOwnershipFilter('OWNED')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              ownershipFilter === 'OWNED' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Đã có
          </button>
          <button
            onClick={() => setOwnershipFilter('MISSING')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition ${
              ownershipFilter === 'MISSING' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Chưa có
          </button>
        </div>
      </div>

      {/* Cards Grid Album Binder */}
      <div className="rounded-3xl border border-zinc-800/90 bg-zinc-950 p-6 sm:p-8 min-h-[480px]">
        {displayedCards.length === 0 ? (
          <div className="py-20 text-center">
            <Filter className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
            <h3 className="text-base font-bold text-zinc-300">Không có thẻ bài phù hợp với bộ lọc</h3>
            <p className="text-xs text-zinc-500 mt-1">Hãy thử chọn lại độ hiếm hoặc chuyển sang chế độ &quot;Tất cả&quot;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 justify-items-center">
            {displayedCards.map((card) => {
              const count = getCardCount(card.id);
              const isOwned = count > 0;

              return (
                <div key={card.id} className="relative">
                  <PokemonCardView
                    card={card}
                    isOwned={isOwned}
                    count={count}
                    size="md"
                    onClick={() => setInspectedCard(card)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Inspector Modal */}
      {inspectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-amber-500/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8">
            <button
              onClick={() => setInspectedCard(null)}
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left: 3D interactive Card */}
            <div className="shrink-0">
              <PokemonCardView
                card={inspectedCard}
                isOwned={getCardCount(inspectedCard.id) > 0}
                count={getCardCount(inspectedCard.id)}
                size="xl"
                interactive={true}
              />
            </div>

            {/* Right: Card Dossier Details */}
            <div className="space-y-4 text-xs text-zinc-300 w-full">
              <div>
                <span className="rounded-md bg-amber-500/20 px-2.5 py-1 font-bold text-amber-300 border border-amber-500/30 uppercase text-[10px]">
                  {inspectedCard.rarity.replace(/_/g, ' ')}
                </span>
                <h2 className="text-2xl font-black text-white mt-2">{inspectedCard.name}</h2>
                {inspectedCard.japaneseName && (
                  <p className="text-xs text-zinc-400 font-medium">{inspectedCard.japaneseName}</p>
                )}
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Mã số thẻ:</span>
                  <span className="font-mono font-bold text-white">#{inspectedCard.setNumber} / {inspectedCard.totalInSet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Họa sĩ minh họa:</span>
                  <span className="font-bold text-amber-200">{inspectedCard.artist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Hiệu ứng bề mặt:</span>
                  <span className="font-mono text-zinc-300 capitalize">{inspectedCard.foilPattern.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Số bản sao trong album:</span>
                  <span className="font-bold text-emerald-400">{getCardCount(inspectedCard.id)} thẻ</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-800">
                  <span className="text-zinc-400 font-bold">Giá thị trường TCGplayer:</span>
                  {inspectedCard.estimatedValue > 0 && !['common', 'uncommon'].includes(inspectedCard.rarity) ? (
                    <span className="text-base font-black text-emerald-400">${inspectedCard.estimatedValue.toFixed(2)}</span>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">Thẻ phổ thông (Bulk card)</span>
                  )}
                </div>
              </div>

              {inspectedCard.flavorText && (
                <p className="italic text-zinc-400 border-l-2 border-amber-500/50 pl-3 leading-relaxed">
                  &ldquo;{inspectedCard.flavorText}&rdquo;
                </p>
              )}

              <button
                onClick={() => setInspectedCard(null)}
                className="w-full rounded-xl bg-zinc-800 py-3 text-xs font-bold text-white hover:bg-zinc-700 transition"
              >
                Đóng thông tin
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
