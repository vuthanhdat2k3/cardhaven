import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PACK_ASSETS = [
  {
    name: 'sv-151-pack.webp',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/sv3pt5/packshots/151_Booster.webp',
  },
  {
    name: 'sv-pre-pack.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/sv8pt5/packshots/Pokemon_TCG_Scarlet_Violet%E2%80%94Prismatic_Evolutions_Booster_Wrap_Eevee_and_Sylveon.png',
  },
  {
    name: 'sv-151-jp-pack.webp',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/ja_sv2a/packshots/booster-7pack.webp',
  },
  {
    name: 'swsh-crz-pack.webp',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/swsh12pt5/packshots/Crown_Zenith_Booster.webp',
  },
  {
    name: 'meg-30th-pack.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/me6pt5/packshots/Pokemon_TCG_30th_Celebration_Booster_Wrap.png',
  },
  {
    name: 'pocket-charizard-pack.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/tcgp1/packshots/A1_Booster_Charizard_EN.png',
  },
  {
    name: 'pocket-mewtwo-pack.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/tcgp1/packshots/A1_Booster_Mewtwo_EN.png',
  },
  {
    name: 'pocket-pikachu-pack.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/tcgp1/packshots/A1_Booster_Pikachu_EN.png',
  },
];

const BOX_ASSETS = [
  {
    name: 'sv-pre-box.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/sv8pt5/display.png',
  },
  {
    name: 'sv-151-bundle.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/sv3pt5/booster-bundle.png',
  },
  {
    name: 'sv-151-jp-box.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/ja_sv2a/display.png',
  },
  {
    name: 'sv-151-etb.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/sv3pt5/elite-trainer-box-svp-51.png',
  },
  {
    name: 'sv-pre-etb.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/sv8pt5/elite-trainer-box-svp-173.png',
  },
  {
    name: 'sv-151-upc.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/sv3pt5/ultra-premium-collection.png',
  },
  {
    name: 'meg-30th-etb.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/me6pt5/elite-trainer-box.png',
  },
  {
    name: 'meg-30th-box.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/me1/display.png',
  },
  {
    name: 'pocket-bundle.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/tcgp1/booster-bundle.png',
  },
  {
    name: 'pocket-box.png',
    url: 'https://raw.githubusercontent.com/1niceroli/ptcg-assets/master/tcgp1/display.png',
  },
];

const CARD_ASSETS = [
  // Scarlet & Violet: 151
  { name: 'sv-151-001.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/001/high.webp' },
  { name: 'sv-151-004.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/004/high.webp' },
  { name: 'sv-151-007.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/007/high.webp' },
  { name: 'sv-151-025.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/025/high.webp' },
  { name: 'sv-151-094.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/094/high.webp' },
  { name: 'sv-151-149.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/149/high.webp' },
  { name: 'sv-151-003.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/003/high.webp' },
  { name: 'sv-151-009.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/009/high.webp' },
  { name: 'sv-151-006.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/006/high.webp' },
  { name: 'sv-151-151.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/151/high.webp' },
  { name: 'sv-151-173.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/173/high.webp' },
  { name: 'sv-151-199.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/199/high.webp' },
  // Japanese 151
  { name: 'sv-151-jp-025.webp', url: 'https://assets.tcgdex.net/ja/SV/SV2a/025/high.webp' },
  { name: 'sv-151-jp-183.webp', url: 'https://assets.tcgdex.net/ja/SV/SV2a/183/high.webp' },
  { name: 'sv-151-jp-201.webp', url: 'https://assets.tcgdex.net/ja/SV/SV2a/201/high.webp' },
  // Crown Zenith
  { name: 'swsh-crz-gg44.webp', url: 'https://assets.tcgdex.net/en/swsh/swsh12.5/GG44/high.webp' },
  { name: 'swsh-crz-gg69.webp', url: 'https://assets.tcgdex.net/en/swsh/swsh12.5/GG69/high.webp' },
  { name: 'swsh-crz-gg70.webp', url: 'https://assets.tcgdex.net/en/swsh/swsh12.5/GG70/high.webp' },
  // Prismatic Evolutions
  { name: 'sv-pre-010.webp', url: 'https://assets.tcgdex.net/en/sv/sv08.5/010/high.webp' },
  { name: 'sv-pre-040.webp', url: 'https://assets.tcgdex.net/en/sv/sv08.5/040/high.webp' },
  { name: 'sv-pre-168.webp', url: 'https://assets.tcgdex.net/en/sv/sv08.5/168/high.webp' },
  { name: 'sv-pre-175.webp', url: 'https://assets.tcgdex.net/en/sv/sv08.5/175/high.webp' },
  // 30th Celebration (Mega Evolution Series)
  { name: 'meg-30th-001.png', url: 'https://images.pokemontcg.io/cel25/5_hires.png' },
  { name: 'meg-30th-006.webp', url: 'https://assets.tcgdex.net/en/xy/g1/12/high.webp' },
  { name: 'meg-30th-098.webp', url: 'https://assets.tcgdex.net/en/xy/xy6/76/high.webp' },
  { name: 'meg-30th-150.webp', url: 'https://assets.tcgdex.net/en/xy/xy8/159/high.webp' },
  { name: 'meg-30th-113.webp', url: 'https://assets.tcgdex.net/en/xy/xy3/113/high.webp' },
  { name: 'meg-30th-121.webp', url: 'https://assets.tcgdex.net/en/xy/xy4/121/high.webp' },
  { name: 'meg-30th-025.png', url: 'https://images.pokemontcg.io/cel25/25_hires.png' },
  { name: 'meg-30th-022.webp', url: 'https://assets.tcgdex.net/en/swsh/cel25/22/high.webp' },
  // Pokémon TCG Pocket: Genetic Apex
  { name: 'pocket-a1-001.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/199/high.webp' },
  { name: 'pocket-a1-002.webp', url: 'https://assets.tcgdex.net/ja/SV/SV2a/183/high.webp' },
  { name: 'pocket-a1-003.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/173/high.webp' },
  { name: 'pocket-a1-004.webp', url: 'https://assets.tcgdex.net/en/swsh/swsh12.5/GG44/high.webp' },
  { name: 'pocket-a1-005.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/149/high.webp' },
  { name: 'pocket-a1-006.webp', url: 'https://assets.tcgdex.net/en/sv/sv03.5/006/high.webp' },
  // Basic Energy
  { name: 'energy-grass.png', url: 'https://images.pokemontcg.io/sve/1_hires.png' },
  { name: 'energy-fire.png', url: 'https://images.pokemontcg.io/sve/2_hires.png' },
  { name: 'energy-water.png', url: 'https://images.pokemontcg.io/sve/3_hires.png' },
  { name: 'energy-lightning.png', url: 'https://images.pokemontcg.io/sve/4_hires.png' },
  { name: 'energy-psychic.png', url: 'https://images.pokemontcg.io/sve/5_hires.png' },
];

async function downloadFile(url, destPath) {
  if (fs.existsSync(destPath)) {
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[WARN] Failed to fetch ${url} (status: ${res.status})`);
      return;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buffer);
    console.log(`[SAVED] ${path.basename(destPath)} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`[ERROR] Could not download ${url}:`, err.message);
  }
}

async function main() {
  console.log('=== CardHaven Asset Synchronizer ===');
  
  const packsDir = path.join(ROOT_DIR, 'public', 'assets', 'packs');
  const boxesDir = path.join(ROOT_DIR, 'public', 'assets', 'boxes');
  const cardsDir = path.join(ROOT_DIR, 'public', 'assets', 'cards');

  for (const item of PACK_ASSETS) {
    await downloadFile(item.url, path.join(packsDir, item.name));
  }

  for (const item of BOX_ASSETS) {
    await downloadFile(item.url, path.join(boxesDir, item.name));
  }

  for (const item of CARD_ASSETS) {
    await downloadFile(item.url, path.join(cardsDir, item.name));
  }

  console.log('=== Asset sync complete! ===');
}

main().catch(console.error);
