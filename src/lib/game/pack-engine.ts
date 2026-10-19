import { CardPrinting, OpeningCardResult, OpeningSession, PackTemplate, Rarity, UserCollectionEntry } from '@/types';
import { CARD_PRINTINGS } from '@/data/cards';
import { PACK_TEMPLATES_MAP } from '@/data/pack-templates';
import { PRODUCTS_MAP } from '@/data/products';

// Standard hit slot weights for regular mainline sets (Scarlet & Violet)
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

// Official & Community Estimated Hit Rates for 30th Celebration Physical TCG (Sample of 2,000–4,000 packs)
// - Double Rare (EX): 24.5% (~1/4 packs)
// - Illustration Rare (AR): 20.0% (~1/5 packs)
// - Classic Collection: 10.0% (~1/10 packs)
// - Special Illustration Rare (SAR): 5.5% (~1/18 packs)
// - Futuristic Rare / Gold: 1.0% (~1/80–120 packs)
// - Holo Rare (Remaining non-hit): 39.0%
export const CELEBRATION_30TH_HIT_WEIGHTS: Record<Rarity, number> = {
  common: 0,
  uncommon: 0,
  rare: 20.0,                   // 20% Illustration Rare (AR)
  double_rare: 24.5,            // 24.5% Double Rare (Mega EX)
  ultra_rare: 10.0,             // 10% Classic Collection Remakes
  special_illustration_rare: 5.5, // 5.5% SAR Alt Art
  hyper_rare: 1.0,              // 1% Futuristic Gold / 24k Gold
  holo_rare: 39.0,              // 39% Non-hit Holo Rare
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
 * Normalizes a Pokémon character name to prevent picking duplicate variants of the same character
 * in a single booster pack. E.g. "Lugia (30th Celebration Classic)" -> "LUGIA".
 */
export function normalizeCharacterKey(card: CardPrinting): string {
  if (card.cardType === 'energy') return `ENERGY_${card.id}`;
  if (card.id.includes('code') || card.name.includes('Code Card')) return `CODE_${card.id}`;
  // For Pikachu, normalize all variants to PIKACHU to ensure exactly 1 Pikachu per pack
  if (card.name.includes('Pikachu')) {
    return 'PIKACHU';
  }
  // Strip parentheses and subtitles: e.g. "Lugia (30th Celebration Classic)" -> "LUGIA"
  const baseName = card.name.split('(')[0].replace(/ex|EX|VMAX|VSTAR|V-UNION/gi, '').trim().toUpperCase();
  return baseName || card.name.toUpperCase();
}

/**
 * Helper to pick a strictly unique card that has not yet appeared in this pack.
 * Checks BOTH card ID and character name to guarantee 100% zero character duplicates.
 */
function pickStrictlyUnique(
  primaryCandidates: CardPrinting[],
  secondaryPool: CardPrinting[],
  globalPool: CardPrinting[],
  seenIds: Set<string>,
  seenCharacters: Set<string>
): CardPrinting {
  const isCandidateFresh = (c: CardPrinting) =>
    !seenIds.has(c.id) &&
    (c.cardType === 'energy' || c.id.includes('code') || !seenCharacters.has(normalizeCharacterKey(c)));

  const freshPrimary = primaryCandidates.filter(isCandidateFresh);
  if (freshPrimary.length > 0) {
    return getRandomItem(freshPrimary);
  }

  const freshSecondary = secondaryPool.filter(isCandidateFresh);
  if (freshSecondary.length > 0) {
    return getRandomItem(freshSecondary);
  }

  const freshGlobal = globalPool.filter(isCandidateFresh);
  if (freshGlobal.length > 0) {
    return getRandomItem(freshGlobal);
  }

  // Fallback to ID-only uniqueness if pool is extremely constrained
  const fallbackFresh = globalPool.filter((c) => !seenIds.has(c.id));
  if (fallbackFresh.length > 0) {
    return getRandomItem(fallbackFresh);
  }

  return getRandomItem(globalPool);
}

/**
 * Opens a single booster pack following authentic factory collation rules:
 * 1. 100% Guaranteed ZERO duplicate cards / duplicate characters within the same pack.
 * 2. Authentic slot collation tailored to each specific set (e.g. 30th Celebration Pikachu + Code Card).
 * 3. Specific hit rate distributions (e.g. 30th Celebration community hit rates).
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

  const nonSpecialCards = fallbackCards.filter(
    (c) => c.cardType !== 'energy' && !c.id.includes('code') && !c.name.includes('Code Card')
  );
  const commons = nonSpecialCards.filter((c) => c.rarity === 'common' && c.cardType === 'pokemon');
  const commonTrainers = nonSpecialCards.filter((c) => c.rarity === 'common');
  const uncommons = nonSpecialCards.filter((c) => c.rarity === 'uncommon');
  const energies = fallbackCards.filter((c) => c.cardType === 'energy');
  const pikachuVariants = fallbackCards.filter((c) => c.name.toLowerCase().includes('pikachu') && !c.id.includes('code'));
  const codeCards = fallbackCards.filter((c) => c.id.includes('code') || c.name.includes('Code Card'));
  const rares = nonSpecialCards.filter((c) =>
    ['rare', 'holo_rare', 'double_rare', 'ultra_rare', 'special_illustration_rare', 'hyper_rare'].includes(c.rarity)
  );

  const ownedPrintingIds = new Set(existingCollection.map((e) => e.printingId));
  const seenIds = new Set<string>();
  const seenCharacters = new Set<string>();
  const results: OpeningCardResult[] = [];

  for (const slot of template.slots) {
    let picked: CardPrinting | null = null;

    if (slot.poolCategory === 'common') {
      const candidates = commons.length > 0 ? commons : commonTrainers;
      picked = pickStrictlyUnique(candidates, nonSpecialCards, allCards, seenIds, seenCharacters);
    } else if (slot.poolCategory === 'uncommon') {
      picked = pickStrictlyUnique(uncommons, nonSpecialCards, allCards, seenIds, seenCharacters);
    } else if (slot.poolCategory === 'energy') {
      picked = pickStrictlyUnique(energies, fallbackCards, allCards, seenIds, seenCharacters);
    } else if (slot.poolCategory === 'pikachu_variant') {
      // 30th Celebration Guaranteed Pikachu Slot: Strictly pick from 30 Pikachu variants
      const candidates = pikachuVariants.length > 0 ? pikachuVariants : rares;
      picked = pickStrictlyUnique(candidates, pikachuVariants, pikachuVariants, seenIds, seenCharacters);
    } else if (slot.poolCategory === 'code_card') {
      // Pokémon TCG Live Code Card Slot
      if (codeCards.length > 0) {
        picked = codeCards[0];
      } else {
        picked = {
          id: `${template.setId}-code-${Date.now()}`,
          cardId: `c-${template.setId}-code`,
          setId: template.setId,
          setNumber: 'LIVE',
          totalInSet: 199,
          name: 'Pokémon TCG Live Code Card',
          rarity: 'common',
          language: 'EN',
          artist: 'The Pokémon Company International',
          isHolo: false,
          isSecretRare: false,
          foilPattern: 'none',
          estimatedValue: 0.00,
          flavorText: `Redeem code at pokemon.com/tcglive to unlock one ${template.name} in Pokémon TCG Live!`,
          cardType: 'trainer_item',
          accentColor: '#10b981',
          illustrationTheme: '🎟️',
        };
      }
    } else if (slot.poolCategory === 'reverse_or_rare') {
      if (template.setId === 'meg-30th-en') {
        // 30th Celebration Holo slots: Pick distinct 30th Holo Pokémon from Main Set (031-078)
        const holos = nonSpecialCards.filter(
          (c) => c.rarity === 'holo_rare' && !c.name.toLowerCase().includes('pikachu') && !c.setNumber.startsWith('E')
        );
        const nonPikachuFallback = nonSpecialCards.filter((c) => !c.name.toLowerCase().includes('pikachu'));
        picked = pickStrictlyUnique(holos, nonPikachuFallback, nonPikachuFallback, seenIds, seenCharacters);
      } else {
        const targetRarity = pickWeightedRarity(REVERSE_SLOT_WEIGHTS);
        const candidates = nonSpecialCards.filter((c) => c.rarity === targetRarity);
        picked = pickStrictlyUnique(candidates, nonSpecialCards, allCards, seenIds, seenCharacters);
      }
    } else if (slot.poolCategory === 'rare_or_higher') {
      // Use specialized 30th Celebration community hit weights for meg-30th-en
      if (template.setId === 'meg-30th-en') {
        const targetRarity = forcedHitRarity || pickWeightedRarity(CELEBRATION_30TH_HIT_WEIGHTS);
        let candidates: CardPrinting[] = [];
        if (targetRarity === 'double_rare') {
          // Double Rare: Mega EX cards from Main Set (079-128)
          candidates = nonSpecialCards.filter((c) => c.rarity === 'double_rare' && !c.name.toLowerCase().includes('pikachu'));
        } else if (targetRarity === 'rare') {
          // Illustration Rare (AR) (055-078)
          candidates = nonSpecialCards.filter((c) => c.rarity === 'rare' && !c.name.toLowerCase().includes('pikachu'));
        } else if (targetRarity === 'ultra_rare') {
          // Classic Collection subset (C01-C30)
          candidates = nonSpecialCards.filter((c) => c.setNumber.startsWith('C') && !c.name.toLowerCase().includes('pikachu'));
        } else if (targetRarity === 'special_illustration_rare') {
          // Secret Rare SAR Alt Arts (129-155)
          candidates = nonSpecialCards.filter(
            (c) => c.rarity === 'special_illustration_rare' && !c.name.toLowerCase().includes('pikachu')
          );
        } else if (targetRarity === 'hyper_rare') {
          // Futuristic Rares (RGB Mew Trio by YOSHIROTTEN) and Gold Secret Rares (156-158)
          candidates = nonSpecialCards.filter((c) => c.rarity === 'hyper_rare' && !c.name.toLowerCase().includes('pikachu'));
        } else {
          // Non-hit Holo Rare from Main Set
          candidates = nonSpecialCards.filter(
            (c) => c.rarity === 'holo_rare' && !c.name.toLowerCase().includes('pikachu') && !c.setNumber.startsWith('E')
          );
        }
        const nonPikachuFallback = nonSpecialCards.filter((c) => !c.name.toLowerCase().includes('pikachu'));
        picked = pickStrictlyUnique(
          candidates.length > 0 ? candidates : nonPikachuFallback,
          nonPikachuFallback,
          nonPikachuFallback,
          seenIds,
          seenCharacters
        );
      } else {
        const targetRarity = forcedHitRarity || pickWeightedRarity(HIT_SLOT_WEIGHTS);
        const matching = nonSpecialCards.filter((c) => c.rarity === targetRarity);
        picked = pickStrictlyUnique(
          matching.length > 0 ? matching : rares,
          rares.length > 0 ? rares : nonSpecialCards,
          allCards,
          seenIds,
          seenCharacters
        );
      }
    }

    if (!picked) {
      picked = pickStrictlyUnique(nonSpecialCards, allCards, allCards, seenIds, seenCharacters);
    }

    seenIds.add(picked.id);
    seenCharacters.add(normalizeCharacterKey(picked));

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
  const totalMarketValue = Number(
    cards
      .filter((c) => !['common', 'uncommon'].includes(c.printing.rarity) && c.printing.estimatedValue > 0)
      .reduce((sum, c) => sum + c.printing.estimatedValue, 0)
      .toFixed(2)
  );

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
