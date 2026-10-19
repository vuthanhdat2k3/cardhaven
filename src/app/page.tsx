'use client';

import React, { useState } from 'react';
import { GameProvider, useGame } from '@/lib/store/game-context';
import { Navbar } from '@/components/layout/Navbar';
import { StoreView } from '@/components/store/StoreView';
import { InventoryView } from '@/components/inventory/InventoryView';
import { PackOpeningStudio } from '@/components/pack-opening/PackOpeningStudio';
import { CollectionAlbum } from '@/components/collection/CollectionAlbum';
import { HistoryView } from '@/components/history/HistoryView';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

function GameApp() {
  const {
    activeOpeningSession,
    startPackOpening,
    finishCurrentOpening,
    toastMessage,
  } = useGame();

  const [currentTab, setCurrentTab] = useState<'store' | 'inventory' | 'collection' | 'history'>('store');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleOpenPackFromAnywhere = (productId: string) => {
    startPackOpening(productId);
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'store' && (
          <StoreView onOpenPackDirectly={handleOpenPackFromAnywhere} />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            onGoToStore={() => setCurrentTab('store')}
            onOpenPack={handleOpenPackFromAnywhere}
          />
        )}

        {currentTab === 'collection' && <CollectionAlbum />}

        {currentTab === 'history' && <HistoryView />}
      </main>

      {/* Active Pack Opening Cinematic Studio Overlay */}
      {activeOpeningSession && (
        <PackOpeningStudio
          session={activeOpeningSession}
          onFinish={finishCurrentOpening}
          onOpenAnother={() => {
            const prodId = activeOpeningSession.productId;
            finishCurrentOpening();
            setTimeout(() => {
              startPackOpening(prodId);
            }, 100);
          }}
        />
      )}

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Global Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-2xl border border-zinc-800 bg-zinc-950/95 px-4 py-3 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
          {toastMessage.type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-400" />}
          {toastMessage.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400" />}
          {toastMessage.type === 'info' && <Sparkles className="h-5 w-5 text-amber-400" />}
          <span className="text-xs font-bold text-white max-w-sm">{toastMessage.text}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <p>Pokémon TCG Store Simulator & Pack Opening Experience</p>
        <p className="text-[11px] text-zinc-600 mt-1">
          Demo prototype intended for non-commercial collector simulation. All card designs and names are property of their respective creators.
        </p>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  );
}
