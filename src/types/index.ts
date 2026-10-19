export type Language = 'EN' | 'JP';

export type Rarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'holo_rare'
  | 'double_rare'
  | 'ultra_rare'
  | 'special_illustration_rare'
  | 'hyper_rare';

export type CardType =
  | 'pokemon'
  | 'trainer_supporter'
  | 'trainer_item'
  | 'trainer_stadium'
  | 'energy';

export type PokemonEnergyType =
  | 'Grass'
  | 'Fire'
  | 'Water'
  | 'Lightning'
  | 'Psychic'
  | 'Fighting'
  | 'Darkness'
  | 'Metal'
  | 'Dragon'
  | 'Colorless';

export type FoilPattern =
  | 'none'
  | 'holo_sheen'
  | 'cosmos_stars'
  | 'textured_gold'
  | 'rainbow_shimmer'
  | 'stellar_sparkle';

export interface PokemonSet {
  id: string;
  code: string;
  name: string;
  japaneseName?: string;
  series: string;
  releaseYear: number;
  totalCards: number;
  language: Language;
  badgeColor: string;
  description: string;
  symbol: string;
  accentGradient: string;
}

export interface Attack {
  name: string;
  cost: PokemonEnergyType[];
  damage: string;
  text: string;
}

export interface Card {
  id: string;
  name: string;
  japaneseName?: string;
  cardType: CardType;
  hp?: number;
  pokemonType?: PokemonEnergyType;
  stage?: 'Basic' | 'Stage 1' | 'Stage 2' | 'VMAX' | 'VSTAR' | 'ex';
  attacks?: Attack[];
  rule?: string;
  weakness?: { type: PokemonEnergyType; modifier: string };
  retreatCost?: number;
}

export interface CardPrinting {
  id: string;
  cardId: string;
  setId: string;
  setNumber: string;
  totalInSet: number;
  name: string;
  japaneseName?: string;
  rarity: Rarity;
  language: Language;
  artist: string;
  isHolo: boolean;
  isSecretRare: boolean;
  foilPattern: FoilPattern;
  estimatedValue: number;
  flavorText?: string;
  cardType: CardType;
  hp?: number;
  pokemonType?: PokemonEnergyType;
  stage?: string;
  attacks?: Attack[];
  accentColor: string;
  illustrationTheme: string;
  weakness?: { type: PokemonEnergyType; modifier: string };
  retreatCost?: number;
  imageUrl?: string;
}

export type ProductType =
  | 'booster_pack'
  | 'booster_box'
  | 'elite_trainer_box'
  | 'collector_tin'
  | 'bundle';

export interface ProductContents {
  boosterPacksCount: number;
  packTemplateId: string;
  promoCards?: string[]; // CardPrinting IDs
  bonusDescription?: string;
}

export interface Product {
  id: string;
  setId: string;
  name: string;
  productType: ProductType;
  price: number;
  language: Language;
  stock: number;
  featured?: boolean;
  isNew?: boolean;
  badge?: string;
  description: string;
  contents: ProductContents;
  accentColor: string;
  rating: number;
  releaseDate: string;
  imageUrl?: string;
  boxImageUrl?: string;
}

export interface SetPrintWave {
  setId: string;
  waveNumber: number; // e.g. 1 (Đợt 1 - First Print Run)
  maxBoxes: number; // e.g. 6 Boxes / Case
  remainingBoxes: number;
  maxLoosePacks: number; // e.g. 36 packs in active display
  remainingLoosePacks: number;
  status: 'available' | 'low_stock' | 'sold_out';
}

export interface PackSlot {
  slotIndex: number;
  name: string;
  poolCategory: 'common' | 'uncommon' | 'reverse_or_rare' | 'rare_or_higher' | 'energy';
  guaranteedRarities?: Rarity[];
}

export interface PackTemplate {
  id: string;
  setId: string;
  name: string;
  cardsPerPack: number;
  slots: PackSlot[];
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isGuest: boolean;
  createdAt: string;
}

export interface UserSettings {
  animationSpeed: 'normal' | 'fast' | 'instant';
  soundEnabled: boolean;
  soundVolume: number;
  confirmBeforeOpen: boolean;
  reducedMotion: boolean;
  uiLanguage: 'EN' | 'VI';
  cardLanguageFilter: 'ALL' | 'EN' | 'JP';
}

export interface WalletTransaction {
  id: string;
  type: 'PURCHASE' | 'GRANT' | 'REWARD' | 'REFUND';
  amount: number;
  balanceAfter: number;
  description: string;
  timestamp: string;
  idempotencyKey?: string;
}

export interface Wallet {
  balance: number;
  transactions: WalletTransaction[];
}

export interface UserInventoryItem {
  id: string;
  productId: string;
  quantity: number;
  acquiredAt: string;
}

export interface UserCollectionEntry {
  printingId: string;
  count: number;
  firstAcquiredAt: string;
  lastAcquiredAt: string;
}

export interface OpeningCardResult {
  slotIndex: number;
  printing: CardPrinting;
  isNew: boolean;
  revealed: boolean;
}

export interface OpeningSession {
  id: string;
  productId: string;
  productName: string;
  setId: string;
  timestamp: string;
  cards: OpeningCardResult[];
  topPull: CardPrinting;
  totalMarketValue: number;
}
