'use client';

import React from 'react';
import { Product } from '@/types';
import { Eye, Flame, Shield, Award } from 'lucide-react';
import { BoosterPackFoil } from '@/components/ui/BoosterPackFoil';
import { SealedBoxProduct } from '@/components/ui/SealedBoxProduct';

interface HobbyShopSceneProps {
  products: Product[];
  onInspectProduct: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
}

export const HobbyShopScene: React.FC<HobbyShopSceneProps> = ({
  products,
  onInspectProduct,
  onQuickBuy,
}) => {
  const featuredGrails = products.filter((p) => p.featured).slice(0, 3);
  const boosterBoxes = products.filter((p) => p.productType === 'booster_box' || p.productType === 'elite_trainer_box');
  const boosterPacks = products.filter((p) => p.productType === 'booster_pack' || p.productType === 'bundle');

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-amber-900/40 bg-[#0d0a08] shadow-2xl">
      {/* Ambient Lighting & Shop Interior Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-zinc-950/80 to-black pointer-events-none" />
      
      {/* Ceiling Warm Spotlights */}
      <div className="absolute top-0 inset-x-0 h-40 bg-[radial-gradient(circle_at_30%_0%,rgba(251,191,36,0.15),transparent_60%),radial-gradient(circle_at_70%_0%,rgba(251,191,36,0.15),transparent_60%)] pointer-events-none" />

      {/* Main Content Area */}
      <div className="relative z-10 p-4 sm:p-8 space-y-10">
        
        {/* ============================================================== */}
        {/* TOP TIER: Center Glass Showcase Cabinet (Featured / Grails) */}
        {/* ============================================================== */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Award className="h-4 w-4" />
              </span>
              <div>
                <h2 className="text-base font-black uppercase tracking-wider text-amber-100 sm:text-lg">
                  Tủ Kính Trưng Bày — Sản Phẩm Đắt Giá (Grail Showcase)
                </h2>
                <p className="text-xs text-amber-200/60">
                  Các ấn bản sealed cao cấp nhất được bảo quản trong tủ chống tia UV
                </p>
              </div>
            </div>
          </div>

          {/* Glass Display Case */}
          <div className="glass-showcase rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredGrails.map((product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-xl border border-amber-500/20 bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 p-4 transition-all duration-300 hover:border-amber-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20"
                >
                  {/* Spotlight on item */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 bg-amber-400/20 blur-xl pointer-events-none rounded-full" />

                  {/* Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-500/40">
                      {product.badge || 'GRAIL'}
                    </span>
                    <span className="text-xs font-bold text-amber-400">★ {product.rating.toFixed(1)}</span>
                  </div>

                  {/* Authentic Physical Product Display */}
                  <div
                    onClick={() => onInspectProduct(product)}
                    className="relative my-3 flex h-48 w-full cursor-pointer items-center justify-center rounded-lg p-1 group-hover:scale-105 transition duration-300"
                  >
                    {product.productType === 'booster_pack' ? (
                      <BoosterPackFoil product={product} size="sm" interactive={false} />
                    ) : (
                      <SealedBoxProduct product={product} size="sm" interactive={false} />
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3
                      onClick={() => onInspectProduct(product)}
                      className="text-sm font-bold text-amber-100 hover:text-amber-400 cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{product.description}</p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-zinc-800">
                      <span className="text-base font-black text-amber-300">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => onInspectProduct(product)}
                          className="rounded-lg border border-zinc-700 bg-zinc-800 p-1.5 text-zinc-300 hover:text-white"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onQuickBuy(product)}
                          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-extrabold text-black hover:bg-amber-400 active:scale-95 transition"
                        >
                          Mua Ngay
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* MIDDLE TIER: Sealed Booster Boxes & Elite Trainer Boxes Shelf */}
        {/* ============================================================== */}
        <section>
          <div className="flex items-center space-x-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Shield className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-100 sm:text-base">
              Kệ Hộp Nguyên Sealed — Booster Boxes & ETB
            </h2>
          </div>

          {/* Wooden Shelf Display */}
          <div className="rounded-2xl border border-amber-950/60 p-4 shop-wood-shelf">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {boosterBoxes.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onInspectProduct(product)}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/90 p-3 shadow-lg cursor-pointer transition-all duration-300 hover:border-amber-500/60 hover:-translate-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-400">{product.language}</span>
                    <span className="text-zinc-400 font-mono">Stock: {product.stock}</span>
                  </div>

                  <div className="my-2 flex h-44 items-center justify-center p-1">
                    <SealedBoxProduct product={product} size="sm" interactive={false} />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400">${product.price.toFixed(2)}</span>
                      <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        {product.contents.boosterPacksCount} Packs
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shelf Wooden Edge Bar */}
            <div className="h-3 w-full rounded-b-xl mt-4 shop-wood-edge border-t border-amber-700/30" />
          </div>
        </section>

        {/* ============================================================== */}
        {/* BOTTOM TIER: Booster Packs Counter Shelf */}
        {/* ============================================================== */}
        <section>
          <div className="flex items-center space-x-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-500/20 text-red-400 border border-red-500/30">
              <Flame className="h-3.5 w-3.5" />
            </span>
            <h2 className="text-sm font-black uppercase tracking-wider text-amber-100 sm:text-base">
              Kệ Gói Lẻ — Single Booster Packs
            </h2>
          </div>

          <div className="rounded-2xl border border-amber-950/60 p-4 shop-wood-shelf">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {boosterPacks.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onInspectProduct(product)}
                  className="group relative flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/90 p-3 shadow-lg cursor-pointer transition-all duration-300 hover:border-amber-500/60 hover:-translate-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="rounded bg-zinc-800 px-1.5 py-0.2 font-bold text-amber-300">
                      {product.badge || 'PACK'}
                    </span>
                    <span className="font-bold text-zinc-400">{product.language}</span>
                  </div>

                  <div className="my-2 flex h-52 items-center justify-center p-1">
                    <BoosterPackFoil product={product} size="sm" interactive={false} />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 group-hover:text-amber-300 line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400">${product.price.toFixed(2)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickBuy(product);
                        }}
                        className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black hover:bg-amber-400"
                      >
                        Mua
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shelf Wooden Edge Bar */}
            <div className="h-3 w-full rounded-b-xl mt-4 shop-wood-edge border-t border-amber-700/30" />
          </div>
        </section>

      </div>
    </div>
  );
};
