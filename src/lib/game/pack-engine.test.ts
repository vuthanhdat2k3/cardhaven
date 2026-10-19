import { describe, it, expect } from 'vitest';
import { openSingleBooster, generateSeededBoosterBoxPacks } from './pack-engine';
import { PACK_TEMPLATES } from '@/data/pack-templates';

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

  it('should guarantee ZERO duplicate cards in the same pack across all templates', () => {
    for (const template of PACK_TEMPLATES) {
      for (let iteration = 0; iteration < 20; iteration++) {
        const cards = openSingleBooster(template, []);
        const cardIds = cards.map((c) => c.printing.id);
        const uniqueIds = new Set(cardIds);

        // Every single card in the pack MUST have a unique ID
        expect(uniqueIds.size).toBe(cards.length);
      }
    }
  });

  it('should generate a seeded 36-pack booster box with authentic hit rates', () => {
    const template151 = PACK_TEMPLATES.find((t) => t.setId === 'sv-151-en')!;
    const boxPacks = generateSeededBoosterBoxPacks(template151, [], 36);

    expect(boxPacks).toHaveLength(36);

    // Verify all packs in the box have zero internal duplicates
    boxPacks.forEach((pack) => {
      const ids = pack.map((c) => c.printing.id);
      expect(new Set(ids).size).toBe(pack.length);
    });

    // Check hit slots across the box
    const hits = boxPacks.map((pack) => {
      // Find the hit slot (slot 8 or rare_or_higher)
      const hitCard = pack.find((c) =>
        ['double_rare', 'ultra_rare', 'special_illustration_rare', 'hyper_rare', 'holo_rare'].includes(
          c.printing.rarity
        )
      );
      return hitCard?.printing.rarity;
    });

    // Should contain multiple Double Rare ex hits
    const exHits = hits.filter((r) => r === 'double_rare');
    expect(exHits.length).toBeGreaterThanOrEqual(4);

    // Should contain guaranteed Ultra Rare / SIR
    const ultraHits = hits.filter((r) => r === 'ultra_rare' || r === 'special_illustration_rare');
    expect(ultraHits.length).toBeGreaterThanOrEqual(2);
  });
});
