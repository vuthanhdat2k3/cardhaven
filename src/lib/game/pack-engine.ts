import { CardPrinting, OpeningCardResult, OpeningSession, PackTemplate, Rarity, UserCollectionEntry } from '@/types';
import { CARD_PRINTINGS } from '@/data/cards';
import { PACK_TEMPLATES_MAP } from '@/data/pack-templates';
import { PRODUCTS_MAP } from '@/data/products';

// Realistic weighted probabilities for the hit slot (rare_or_higher)
export const HIT_SLOT_WEIGHTS: Record<Rarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 0,
  holo_rare: 60,                // 60% Holo Rare hit
  double_rare: 25,              // 25% Pokémon ex / VSTAR / Mega
  ultra_rare: 8,                // 8% Full Art Ultra Rare
  special_illustration_rare: 5, // 5% Special Illustration Rare (SIR / SAR)
  hyper_rare: 2,                // 2% Gold Secret Hyper Rare
};

// Weighted probabilities for the reverse/parallel wildcard slot
export const REVERSE_SLOT_WEIGHTS: Record<Rarity, number> = {
  common: 52,
  uncommon: 34,
  rare: 9,
  holo_rare: 3.5,
  double_rare: 1,
  ultra_rare: 0.4,
  special_illustration_rare: 0.1,
  hyper_rare: 0,
};

export function pickWeightedRarity(weights: Record<Rarity, number>): Rarity {
  const entries = Object.entries(weights) as [Rarity, number][];
  const total = entries.reduce((acc, [, w]) => acc + w, 0);
  let random = Math.random() * total;

  for (const [rarity, weight] of entries) {
    if (random <= weight) {
      return rarity;
    }
    random -= weight;
  }
  return 'holo_rare';
}

function getRandomItem<T>(arr: T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Helper to pick a strictly unique card that has not yet appeared in this pack.
 * 1. Checks primary candidates (matching set + slot criteria).
 * 2. If exhausted, checks secondary pool (matching set, any criteria).
 * 3. If exhausted, checks global pool.
 * NEVER returns a card whose ID is in seenInThisPack unless all cards in existence are exhausted.
 */
function pickStrictlyUnique(
  primaryCandidates: CardPrinting[],
  secondaryPool: CardPrinting[],
  globalPool: CardPrinting[],
  seenInThisPack: Set<string>
): CardPrinting {
  const freshPrimary = primaryCandidates.filter((c) => !seenInThisPack.has(c.id));
  if (freshPrimary.length > 0) {
    return getRandomItem(freshPrimary);
  }

  const freshSecondary = secondaryPool.filter((c) => !seenInThisPack.has(c.id));
  if (freshSecondary.length > 0) {
    return getRandomItem(freshSecondary);
  }

  const freshGlobal = globalPool.filter((c) => !seenInThisPack.has(c.id));
  if (freshGlobal.length > 0) {
    return getRandomItem(freshGlobal);
  }

  // Absolute fallback
  return getRandomItem(globalPool);
}

/**
 * Opens a single booster pack following authentic factory collation rules:
 * 1. 100% Guaranteed ZERO duplicate cards within the same pack.
 * 2. Authentic slot collation (Commons -> Uncommons -> Reverse Holo -> Rare Hit -> Energy).
 * 3. Optional forcedHitRarity for seeded booster boxes.
 */
export function openSingleBooster(
  template: PackTemplate,
  existingCollection: UserCollectionEntry[] = [],
  poolOverride?: CardPrinting[],
  forcedHitRarity?: Rarity
): OpeningCardResult[] {
  const allCards = poolOverride || CARD_PRINTINGS;
  const setCards = allCards.filter((c) => c.setId === template.setId);
  const fallbackCards = setCards.length > 0 ? setCards : allCards;

  const commons = fallbackCards.filter((c) => c.rarity === 'common' && c.cardType === 'pokemon');
  const commonTrainers = fallbackCards.filter((c) => c.rarity === 'common');
  const uncommons = fallbackCards.filter((c) => c.rarity === 'uncommon');
  const energies = fallbackCards.filter((c) => c.cardType === 'energy');
  const rares = fallbackCards.filter((c) =>
    ['rare', 'holo_rare', 'double_rare', 'ultra_rare', 'special_illustration_rare', 'hyper_rare'].includes(c.rarity)
  );

  const ownedPrintingIds = new Set(existingCollection.map((e) => e.printingId));
  const seenInThisPack = new Set<string>();
  const results: OpeningCardResult[] = [];

  for (const slot of template.slots) {
    let picked: CardPrinting | null = null;

    if (slot.poolCategory === 'common') {
      const candidates = commons.length > 0 ? commons : commonTrainers;
      picked = pickStrictlyUnique(candidates, fallbackCards, allCards, seenInThisPack);
    } else if (slot.poolCategory === 'uncommon') {
      picked = pickStrictlyUnique(uncommons, fallbackCards, allCards, seenInThisPack);
    } else if (slot.poolCategory === 'energy') {
      picked = pickStrictlyUnique(energies, fallbackCards, allCards, seenInThisPack);
    } else if (slot.poolCategory === 'reverse_or_rare') {
      const targetRarity = pickWeightedRarity(REVERSE_SLOT_WEIGHTS);
      const candidates = fallbackCards.filter((c) => c.rarity === targetRarity);
      picked = pickStrictlyUnique(candidates, fallbackCards, allCards, seenInThisPack);
    } else if (slot.poolCategory === 'rare_or_higher') {
      const targetRarity = forcedHitRarity || pickWeightedRarity(HIT_SLOT_WEIGHTS);
      const matching = fallbackCards.filter((c) => c.rarity === targetRarity);
      picked = pickStrictlyUnique(
        matching.length > 0 ? matching : rares,
        rares.length > 0 ? rares : fallbackCards,
        allCards,
        seenInThisPack
      );
    }

    if (!picked) {
      picked = pickStrictlyUnique(fallbackCards, allCards, allCards, seenInThisPack);
    }

    seenInThisPack.add(picked.id);

    const isNew = !ownedPrintingIds.has(picked.id);
    results.push({
      slotIndex: slot.slotIndex,
      printing: picked,
      isNew,
      revealed: false,
    });
  }

  return results;
}

/**
 * Pre-generates an entire sealed Booster Box (e.g. 36 packs) with authentic seeded hit distribution:
 * - Exactly 5-6 Double Rare (ex / Mega) hits
 * - Exactly 2 Illustration Rare (IR / AR / SIR) hits
 * - Exactly 1 Ultra Rare Full Art hit
 * - 40% chance of a Secret Hyper Rare (Gold) grail
 * - Remaining packs contain Holo Rares / regular hits
 * The packs are shuffled so hits are spread realistically throughout the box.
 */
export function generateSeededBoosterBoxPacks(
  template: PackTemplate,
  existingCollection: UserCollectionEntry[] = [],
  packCount: number = 36
): OpeningCardResult[][] {
  const hitDistribution: Rarity[] = [];

  // Seed guaranteed hits for a 36-pack display
  hitDistribution.push('ultra_rare'); // 1 guaranteed Full Art Ultra Rare
  hitDistribution.push('special_illustration_rare'); // 1-2 SIR / IR
  hitDistribution.push('special_illustration_rare');

  // 40% chance of a Gold Hyper Rare in this box
  if (Math.random() < 0.4) {
    hitDistribution.push('hyper_rare');
  } else {
    hitDistribution.push('double_rare');
  }

  // 5 Double Rare ex hits
  for (let i = 0; i < 5; i++) {
    hitDistribution.push('double_rare');
  }

  // Fill remaining packs with Holo Rare hits
  while (hitDistribution.length < packCount) {
    hitDistribution.push('holo_rare');
  }

  // Fisher-Yates shuffle the hit distribution across the 36 packs
  for (let i = hitDistribution.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [hitDistribution[i], hitDistribution[j]] = [hitDistribution[j], hitDistribution[i]];
  }

  // Generate each pack with its assigned seeded hit
  return hitDistribution.map((forcedRarity) =>
    openSingleBooster(template, existingCollection, undefined, forcedRarity)
  );
}

export function createOpeningSession(
  productId: string,
  existingCollection: UserCollectionEntry[] = [],
  preGeneratedCards?: OpeningCardResult[]
): OpeningSession {
  const product = PRODUCTS_MAP.get(productId);
  if (!product) {
    throw new Error(`Product with ID "${productId}" not found.`);
  }

  const template = PACK_TEMPLATES_MAP.get(product.contents.packTemplateId);
  if (!template) {
    throw new Error(`Pack template "${product.contents.packTemplateId}" not found.`);
  }

  const cards = preGeneratedCards || openSingleBooster(template, existingCollection);

  // Find top pull based on rarity priority and estimated market value
  const topPull = [...cards].sort((a, b) => b.printing.estimatedValue - a.printing.estimatedValue)[0].printing;
  const totalMarketValue = Number(cards.reduce((sum, c) => sum + c.printing.estimatedValue, 0).toFixed(2));

  return {
    id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    productId: product.id,
    productName: product.name,
    setId: product.setId,
    timestamp: new Date().toISOString(),
    cards,
    topPull,
    totalMarketValue,
  };
}
