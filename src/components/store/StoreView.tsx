'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import { useGame } from '@/lib/store/game-context';
import { POKEMON_SETS } from '@/data/sets';
import { HobbyShopScene } from './HobbyShopScene';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import {
  Search,
  LayoutGrid,
  Store,
  Sparkles,
  Filter,
} from 'lucide-react';

interface StoreViewProps {
  onOpenPackDirectly?: (productId: string) => void;
}

export const StoreView: React.FC<StoreViewProps> = ({ onOpenPackDirectly }) => {
  const { products, purchaseProduct } = useGame();

  const [viewMode, setViewMode] = useState<'scene' | 'catalog'>('scene');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesQuery =
          searchQuery.trim() === '' ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSet = selectedSet === 'ALL' || p.setId === selectedSet;
        const matchesType = selectedType === 'ALL' || p.productType === selectedType;
        const matchesLanguage = selectedLanguage === 'ALL' || p.language === selectedLanguage;

        return matchesQuery && matchesSet && matchesType && matchesLanguage;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default: featured first
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchQuery, selectedSet, selectedType, selectedLanguage, sortBy]);

  const handleQuickBuy = (product: Product) => {
    purchaseProduct(product.id, 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      
      {/* Top Banner / Store Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-zinc-950 via-amber-950/30 to-zinc-950 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Official Pokémon TCG Collector Exchange</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-50">
              Cửa Hàng Thẻ Bài Pokémon TCG
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Nơi tụ họp các series sealed chính hãng từ Kanto 151 đến Prismatic Evolutions. Săn tìm các thẻ bài bí mật SIR và Gold Holo giá trị cao.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 self-start md:self-auto shrink-0">
            <button
              onClick={() => setViewMode('scene')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'scene'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Phối cảnh 2.5D</span>
            </button>
            <button
              onClick={() => setViewMode('catalog')}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === 'catalog'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Catalog Grid</span>
            </button>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 border-t border-zinc-800/80">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên sản phẩm, thẻ bài..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Set Filter */}
          <div>
            <select
              value={selectedSet}
              onChange={(e) => setSelectedSet(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">Tất cả Set / Series</option>
              {POKEMON_SETS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.language})
                </option>
              ))}
            </select>
          </div>

          {/* Product Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">Tất cả loại sản phẩm</option>
              <option value="booster_pack">Gói lẻ (Booster Pack)</option>
              <option value="booster_box">Hộp nguyên (Booster Box)</option>
              <option value="elite_trainer_box">Elite Trainer Box (ETB)</option>
              <option value="collector_tin">Hộp thiếc / Special Tin</option>
              <option value="bundle">Booster Bundle</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating')}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="featured">Sắp xếp: Nổi bật nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Display: 2.5D Scene or Catalog Grid */}
      {viewMode === 'scene' ? (
        <HobbyShopScene
          products={filteredProducts}
          onInspectProduct={(p) => setInspectedProduct(p)}
          onQuickBuy={handleQuickBuy}
        />
      ) : (
        <div>
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-12 text-center">
              <Filter className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
              <h3 className="text-lg font-bold text-zinc-300">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-zinc-500 mt-1">Hãy thử xóa bộ lọc tìm kiếm hoặc chọn danh mục khác.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSet('ALL');
                  setSelectedType('ALL');
                  setSelectedLanguage('ALL');
                }}
                className="mt-4 rounded-xl bg-zinc-800 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-zinc-700"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onInspect={(p) => setInspectedProduct(p)}
                  onQuickBuy={handleQuickBuy}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onOpenImmediately={onOpenPackDirectly}
      />
    </div>
  );
};
