'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/store/game-context';
import { Clock, ShoppingCart, Sparkles, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { wallet, openingHistory } = useGame();
  const [activeTab, setActiveTab] = useState<'openings' | 'purchases'>('openings');

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Clock className="h-4 w-4" />
              <span>Collector Activity Log</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Lịch Sử Hoạt Động & Giao Dịch</h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Nhật ký toàn bộ các phiên mở gói thẻ bài và các giao dịch mua sắm tại cửa hàng.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl border border-zinc-800 bg-zinc-900 p-1 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('openings')}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === 'openings'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Lịch Sử Mở Gói ({openingHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                activeTab === 'purchases'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Giao Dịch Ví ({wallet.transactions.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'openings' ? (
        <div className="space-y-4">
          {openingHistory.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/60 p-12 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-zinc-600 mb-3" />
              <h3 className="text-base font-bold text-white">Chưa có phiên mở gói nào</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Hãy vào Kho đồ và mở những pack đầu tiên để xem nhật ký kéo thẻ tại đây.
              </p>
            </div>
          ) : (
            openingHistory.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg space-y-4 transition hover:border-amber-500/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-xl border border-amber-500/30">
                      🎴
                    </span>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{session.productName}</h4>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {new Date(session.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <div className="rounded-lg bg-zinc-800 px-3 py-1 text-zinc-300">
                      Top hit: <strong className="text-amber-300">{session.topPull.name}</strong>
                    </div>
                    <div className="rounded-lg bg-emerald-950/80 px-3 py-1 text-emerald-300 border border-emerald-800/40 font-bold">
                      Trị giá: ${session.totalMarketValue.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Cards Pulled Preview Pill List */}
                <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 gap-2">
                  {session.cards.map((res, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-zinc-800 bg-black/50 p-2 text-center text-[10px] space-y-1"
                    >
                      <span className="text-2xl block">{res.printing.illustrationTheme}</span>
                      <p className="font-semibold text-zinc-200 line-clamp-1">{res.printing.name}</p>
                      {res.printing.estimatedValue > 0 && !['common', 'uncommon'].includes(res.printing.rarity) ? (
                        <p className="text-[9px] font-bold text-emerald-400">${res.printing.estimatedValue.toFixed(2)}</p>
                      ) : (
                        <p className="text-[8px] text-zinc-600">—</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 text-[10px] uppercase text-zinc-500 font-bold">
                <tr>
                  <th className="pb-3 pl-2">Loại GD</th>
                  <th className="pb-3">Mô tả</th>
                  <th className="pb-3">Thời gian</th>
                  <th className="pb-3 text-right">Số tiền</th>
                  <th className="pb-3 pr-2 text-right">Số dư sau GD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-medium">
                {wallet.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-900/40 transition">
                    <td className="py-3 pl-2">
                      <span
                        className={`inline-flex items-center space-x-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          tx.type === 'PURCHASE'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                        }`}
                      >
                        {tx.type === 'PURCHASE' ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        <span>{tx.type}</span>
                      </span>
                    </td>
                    <td className="py-3 text-zinc-200">{tx.description}</td>
                    <td className="py-3 text-zinc-400 font-mono text-[11px]">
                      {new Date(tx.timestamp).toLocaleString('vi-VN')}
                    </td>
                    <td
                      className={`py-3 text-right font-bold ${
                        tx.amount < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td className="py-3 pr-2 text-right font-mono text-zinc-300">
                      ${tx.balanceAfter.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
