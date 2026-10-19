'use client';

import React from 'react';
import { Product } from '@/types';
import { POKEMON_SETS } from '@/data/sets';
import { BoosterPackFoil } from '@/components/ui/BoosterPackFoil';
import { SealedBoxProduct } from '@/components/ui/SealedBoxProduct';
import { useGame } from '@/lib/store/game-context';
import { ShoppingCart, Info, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onInspect: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onInspect, onQuickBuy }) => {
  const { storeWaves, restockCollectionWave } = useGame();
  const setInfo = POKEMON_SETS.find((s) => s.id === product.setId);
  const wave = storeWaves[product.setId];

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0 || wave?.status === 'sold_out';

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/90 via-zinc-900/70 to-zinc-950 p-4 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10">
      {/* Top Badges */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1.5">
          {product.badge && (
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-amber-300 border border-amber-500/40">
              {product.badge}
            </span>
          )}
          {wave && (
            <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 border border-zinc-700">
              Đợt #{wave.waveNumber}
            </span>
          )}
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
              product.language === 'JP'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                : 'bg-blue-950/80 text-blue-300 border border-blue-800/50'
            }`}
          >
            {product.language}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-xs text-amber-400">
          <Star className="h-3.5 w-3.5 fill-amber-400" />
          <span className="font-bold text-zinc-300">{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Visual Product Display (Foil Wrapper / Box) */}
      <div
        onClick={() => onInspect(product)}
        className="relative mx-auto flex h-60 w-full cursor-pointer items-center justify-center rounded-xl p-2 group-hover:scale-102 transition duration-300"
      >
        {product.productType === 'booster_pack' ? (
          <BoosterPackFoil product={product} size="md" interactive={false} />
        ) : (
          <SealedBoxProduct product={product} size="md" interactive={false} />
        )}
      </div>

      {/* Product Info */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">
          {setInfo?.name || 'Expansion'}
        </p>
        <h3
          onClick={() => onInspect(product)}
          className="text-sm font-bold text-zinc-100 hover:text-amber-300 cursor-pointer line-clamp-1 transition"
        >
          {product.name}
        </h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mt-1 min-h-[32px]">
          {product.description}
        </p>
      </div>

      {/* Stock & Wave Status Bar */}
      <div className="mt-2 pt-2 border-t border-zinc-800/80">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-zinc-400">Đợt #{wave?.waveNumber || 1}:</span>
          {isOutOfStock ? (
            <button
              onClick={() => restockCollectionWave(product.setId)}
              className="text-[10px] font-bold text-emerald-400 hover:underline"
            >
              Hết hàng • Nhập đợt mới
            </button>
          ) : isLowStock ? (
            <span className="font-bold text-amber-400 animate-pulse">Sắp hết ({product.stock})</span>
          ) : (
            <span className="font-medium text-emerald-400">
              {product.productType === 'booster_pack'
                ? `${wave?.remainingLoosePacks ?? product.stock} pack lẻ`
                : `${wave?.remainingBoxes ?? product.stock} box`}
            </span>
          )}
        </div>
      </div>

      {/* Price & Actions */}
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-400 block uppercase font-medium">Giá bán</span>
          <span className="text-lg font-black text-amber-300">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onInspect(product)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
            title="Xem chi tiết sản phẩm"
          >
            <Info className="h-4 w-4" />
          </button>

          <button
            onClick={() => onQuickBuy(product)}
            disabled={isOutOfStock}
            className={`flex items-center space-x-1.5 rounded-xl px-3 py-2 text-xs font-bold transition active:scale-95 ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Mua</span>
          </button>
        </div>
      </div>
    </div>
  );
};
