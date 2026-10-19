import { describe, it, expect } from 'vitest';
import { openSingleBooster, createOpeningSession } from './pack-engine';
import { PACK_TEMPLATES } from '@/data/pack-templates';
import { PRODUCTS } from '@/data/products';

describe('Pack Opening Engine', () => {
  it('should generate the exact number of cards specified in the pack template', () => {
    const template151 = PACK_TEMPLATES.find((t) => t.setId === 'sv-151-en')!;
    const cards = openSingleBooster(template151, []);

    expect(cards).toHaveLength(10);
    expect(cards[0].slotIndex).toBe(0);
    expect(cards[9].slotIndex).toBe(9);
  });

  it('should flag cards as isNew: true when collection is empty', () => {
    const template151 = PACK_TEMPLATES.find((t) => t.setId === 'sv-151-en')!;
    const cards = openSingleBooster(template151, []);

    expect(cards.every((c) => c.isNew)).toBe(true);
  });

  it('should flag cards as isNew: false when card is already in user collection', () => {
    const template151 = PACK_TEMPLATES.find((t) => t.setId === 'sv-151-en')!;
    const knownPrintingId = 'sv-151-001'; // Bulbasaur
    const cards = openSingleBooster(template151, [
      { printingId: knownPrintingId, count: 1, firstAcquiredAt: '', lastAcquiredAt: '' },
    ]);

    const pulledBulbasaur = cards.find((c) => c.printing.id === knownPrintingId);
    if (pulledBulbasaur) {
      expect(pulledBulbasaur.isNew).toBe(false);
    }
  });

  it('should create a valid OpeningSession with total market value and top pull', () => {
    const boosterProduct = PRODUCTS.find((p) => p.productType === 'booster_pack')!;
    const session = createOpeningSession(boosterProduct.id, []);

    expect(session.id).toBeDefined();
    expect(session.productId).toBe(boosterProduct.id);
    expect(session.cards.length).toBeGreaterThan(0);
    expect(session.topPull).toBeDefined();
    expect(session.totalMarketValue).toBeGreaterThan(0);
  });
});
