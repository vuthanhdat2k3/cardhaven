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

  it('should follow authentic 30th celebration physical rules and never duplicate characters across 1000 opens', () => {
    const template30th = PACK_TEMPLATES.find((t) => t.setId === 'meg-30th-en')!;
    expect(template30th.cardsPerPack).toBe(7);

    for (let i = 0; i < 1000; i++) {
      const cards = openSingleBooster(template30th, []);
      expect(cards).toHaveLength(7);

      // Verify slot 0 is Energy
      expect(cards[0].printing.cardType).toBe('energy');

      // Verify slot 4 is guaranteed a Pikachu variant
      expect(cards[4].printing.name.toLowerCase()).toContain('pikachu');

      // Verify slot 6 is Code Card
      expect(cards[6].printing.name).toContain('Code Card');

      // Verify ID deduplication
      const ids = cards.map((c) => c.printing.id);
      expect(new Set(ids).size).toBe(cards.length);

      // Verify Character deduplication (e.g. no 2 Lugias or 2 Charizards)
      const nonSpecialCards = cards.filter(
        (c) => c.printing.cardType !== 'energy' && !c.printing.name.includes('Code Card')
      );
      const characterNames = nonSpecialCards.map((c) =>
        c.printing.name.split('(')[0].replace(/ex|EX|VMAX|VSTAR|V-UNION/gi, '').trim().toUpperCase()
      );
      expect(new Set(characterNames).size).toBe(nonSpecialCards.length);
    }
  });

  it('should match community 2,000–4,000 pack hit rate distribution within reasonable confidence intervals', () => {
    const template30th = PACK_TEMPLATES.find((t) => t.setId === 'meg-30th-en')!;
    const SAMPLE_SIZE = 3000;
    const hitCounts = {
      double_rare: 0,
      rare_ar: 0,
      classic_collection: 0,
      sar: 0,
      gold_futuristic: 0,
    };

    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const cards = openSingleBooster(template30th, []);
      // Slot 5 is the climax hit slot
      const hit = cards[5].printing;
      if (hit.rarity === 'double_rare') hitCounts.double_rare++;
      if (hit.rarity === 'rare') hitCounts.rare_ar++;
      if (hit.rarity === 'ultra_rare') hitCounts.classic_collection++;
      if (hit.rarity === 'special_illustration_rare') hitCounts.sar++;
      if (hit.rarity === 'hyper_rare') hitCounts.gold_futuristic++;
    }

    // Double Rare EX: ~24.5% (allow 21% - 28%)
    const exRate = (hitCounts.double_rare / SAMPLE_SIZE) * 100;
    expect(exRate).toBeGreaterThanOrEqual(21);
    expect(exRate).toBeLessThanOrEqual(28);

    // Illustration Rare (AR): ~20% (allow 17% - 24%)
    const arRate = (hitCounts.rare_ar / SAMPLE_SIZE) * 100;
    expect(arRate).toBeGreaterThanOrEqual(17);
    expect(arRate).toBeLessThanOrEqual(24);

    // Classic Collection: ~10% (allow 8% - 13%)
    const classicRate = (hitCounts.classic_collection / SAMPLE_SIZE) * 100;
    expect(classicRate).toBeGreaterThanOrEqual(8);
    expect(classicRate).toBeLessThanOrEqual(13);

    // SAR: ~5.5% (allow 4% - 8%)
    const sarRate = (hitCounts.sar / SAMPLE_SIZE) * 100;
    expect(sarRate).toBeGreaterThanOrEqual(4);
    expect(sarRate).toBeLessThanOrEqual(8);

    // Futuristic / Gold: ~1% (allow 0.3% - 2.5%)
    const goldRate = (hitCounts.gold_futuristic / SAMPLE_SIZE) * 100;
    expect(goldRate).toBeGreaterThanOrEqual(0.3);
    expect(goldRate).toBeLessThanOrEqual(2.5);
  });
});
