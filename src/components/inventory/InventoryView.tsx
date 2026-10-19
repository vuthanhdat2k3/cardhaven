'use client';

import React from 'react';
import { useGame } from '@/lib/store/game-context';
import { PRODUCTS_MAP } from '@/data/products';
import { POKEMON_SETS } from '@/data/sets';
import { BoosterPackFoil } from '@/components/ui/BoosterPackFoil';
import { SealedBoxProduct } from '@/components/ui/SealedBoxProduct';
import { Package, Sparkles, Box, ShoppingBag, ShieldCheck } from 'lucide-react';

interface InventoryViewProps {
  onGoToStore: () => void;
  onOpenPack: (productId: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onGoToStore, onOpenPack }) => {
  const { inventory, unpackBoxToPacks } = useGame();

  const inventoryWithProducts = inventory
    .map((item) => ({
      item,
      product: PRODUCTS_MAP.get(item.productId),
    }))
    .filter((entry) => entry.product && entry.item.quantity > 0);

  const totalPacksReady = inventoryWithProducts.reduce((sum, entry) => {
    if (!entry.product) return sum;
    return sum + (entry.product.productType === 'booster_pack' ? entry.item.quantity : 0);
  }, 0);

  const totalBoxesSealed = inventoryWithProducts.reduce((sum, entry) => {
    if (!entry.product) return sum;
    return sum + (entry.product.productType !== 'booster_pack' ? entry.item.quantity : 0);
  }, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Sealed Product Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Kho Đồ & Sản Phẩm Đã Mua</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Quản lý các gói thẻ và hộp nguyên sealed của bạn. Bóc hộp để lấy gói lẻ hoặc mở pack để săn các lá bài hiếm.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Gói lẻ sẵn sàng</span>
              <span className="text-lg font-black text-amber-300">{totalPacksReady} Packs</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Hộp nguyên sealed</span>
              <span className="text-lg font-black text-purple-300">{totalBoxesSealed} Boxes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Items List */}
      {inventoryWithProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 p-12 text-center">
          <Package className="mx-auto h-16 w-16 text-zinc-600 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-white">Kho đồ của bạn đang trống</h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mt-2">
            Bạn chưa sở hữu bất kỳ sản phẩm nào. Hãy ghé thăm Cửa Hàng Thẻ Bài để sắm các booster pack và booster box đầu tiên!
          </p>
          <button
            onClick={onGoToStore}
            className="mt-6 inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-black text-black shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Ghé Thăm Cửa Hàng Ngay</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventoryWithProducts.map(({ item, product }) => {
            if (!product) return null;
            const setInfo = POKEMON_SETS.find((s) => s.id === product.setId);
            const isSinglePack = product.productType === 'booster_pack';

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-xl transition hover:border-amber-500/40 hover:shadow-2xl"
              >
                {/* Product Header */}
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-[11px] font-bold text-amber-300 border border-zinc-700">
                    {setInfo?.name}
                  </span>
                  <div className="flex items-center space-x-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 border border-amber-500/30">
                    <span>Sở hữu:</span>
                    <span className="text-sm">x{item.quantity}</span>
                  </div>
                </div>

                {/* Authentic Physical Product Display */}
                <div className="my-3 flex h-52 w-full items-center justify-center rounded-xl p-1">
                  {product.productType === 'booster_pack' ? (
                    <BoosterPackFoil product={product} size="sm" interactive={false} />
                  ) : (
                    <SealedBoxProduct product={product} size="sm" interactive={false} />
                  )}
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{product.description}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-3 border-t border-zinc-800/80">
                  {isSinglePack ? (
                    <button
                      onClick={() => onOpenPack(product.id)}
                      className="w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3 text-sm font-black text-black shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-98 transition"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Mở Gói Thẻ Bài Này</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => unpackBoxToPacks(product.id)}
                        className="w-full flex items-center justify-center space-x-2 rounded-xl border border-purple-500/50 bg-purple-950/40 py-2.5 text-xs font-bold text-purple-200 hover:bg-purple-900/50 active:scale-98 transition"
                      >
                        <Box className="h-4 w-4 text-purple-400" />
                        <span>Bóc Hộp Lấy {product.contents.boosterPacksCount} Packs Lẻ</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
