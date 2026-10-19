import { CardPrinting, OpeningCardResult, OpeningSession, PackTemplate, Rarity, UserCollectionEntry } from '@/types';
import { CARD_PRINTINGS } from '@/data/cards';
import { PACK_TEMPLATES_MAP } from '@/data/pack-templates';
import { PRODUCTS_MAP } from '@/data/products';

// Realistic weighted probabilities for the hit slot (rare_or_higher)
const HIT_SLOT_WEIGHTS: Record<Rarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 0,
  holo_rare: 65,            // 65% Holo Rare hit
  double_rare: 24,          // 24% Pokémon ex / VSTAR
  ultra_rare: 7,            // 7% Full Art Ultra Rare
  special_illustration_rare: 3.2, // 3.2% Special Illustration Rare
  hyper_rare: 0.8,          // 0.8% Gold Secret Hyper Rare
};

// Weighted probabilities for the reverse/parallel wildcard slot
const REVERSE_SLOT_WEIGHTS: Record<Rarity, number> = {
  common: 50,
  uncommon: 35,
  rare: 9,
  holo_rare: 4,
  double_rare: 1.5,
  ultra_rare: 0.4,
  special_illustration_rare: 0.1,
  hyper_rare: 0,
};

function pickWeightedRarity(weights: Record<Rarity, number>): Rarity {
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

export function openSingleBooster(
  template: PackTemplate,
  existingCollection: UserCollectionEntry[] = [],
  poolOverride?: CardPrinting[]
): OpeningCardResult[] {
  const allCards = poolOverride || CARD_PRINTINGS;
  const setCards = allCards.filter((c) => c.setId === template.setId);
  const fallbackCards = setCards.length > 0 ? setCards : allCards;

  const commons = fallbackCards.filter((c) => c.rarity === 'common' && c.cardType === 'pokemon');
  const uncommons = fallbackCards.filter((c) => c.rarity === 'uncommon' && c.cardType === 'pokemon');
  const energies = fallbackCards.filter((c) => c.cardType === 'energy');
  const rares = fallbackCards.filter((c) => ['rare', 'holo_rare', 'double_rare', 'ultra_rare', 'special_illustration_rare', 'hyper_rare'].includes(c.rarity));

  const ownedPrintingIds = new Set(existingCollection.map((e) => e.printingId));
  const seenInThisPack = new Set<string>();

  const results: OpeningCardResult[] = [];

  for (const slot of template.slots) {
    let picked: CardPrinting | null = null;

    if (slot.poolCategory === 'common') {
      const candidates = commons.filter((c) => !seenInThisPack.has(c.id));
      picked = getRandomItem(candidates.length > 0 ? candidates : commons);
    } else if (slot.poolCategory === 'uncommon') {
      const candidates = uncommons.filter((c) => !seenInThisPack.has(c.id));
      picked = getRandomItem(candidates.length > 0 ? candidates : (uncommons.length > 0 ? uncommons : commons));
    } else if (slot.poolCategory === 'energy') {
      picked = getRandomItem(energies.length > 0 ? energies : fallbackCards);
    } else if (slot.poolCategory === 'reverse_or_rare') {
      const targetRarity = pickWeightedRarity(REVERSE_SLOT_WEIGHTS);
      const candidates = fallbackCards.filter((c) => c.rarity === targetRarity);
      picked = getRandomItem(candidates.length > 0 ? candidates : fallbackCards);
    } else if (slot.poolCategory === 'rare_or_higher') {
      const targetRarity = pickWeightedRarity(HIT_SLOT_WEIGHTS);
      const matching = fallbackCards.filter((c) => c.rarity === targetRarity);
      if (matching.length > 0) {
        picked = getRandomItem(matching);
      } else {
        picked = getRandomItem(rares.length > 0 ? rares : fallbackCards);
      }
    }

    if (!picked) {
      picked = getRandomItem(fallbackCards);
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

export function createOpeningSession(
  productId: string,
  existingCollection: UserCollectionEntry[] = []
): OpeningSession {
  const product = PRODUCTS_MAP.get(productId);
  if (!product) {
    throw new Error(`Product with ID "${productId}" not found.`);
  }

  const template = PACK_TEMPLATES_MAP.get(product.contents.packTemplateId);
  if (!template) {
    throw new Error(`Pack template "${product.contents.packTemplateId}" not found.`);
  }

  const cards = openSingleBooster(template, existingCollection);
  
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
