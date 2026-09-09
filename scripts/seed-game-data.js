const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding categories and game modes...');

  const cats = [
    { name: 'Mobile Esports', slug: 'mobile-esports', platform: 'MOBILE', description: 'Official competitive Clash Squad format', sortOrder: 1 },
    { name: 'Craftland Custom', slug: 'craftland-custom', platform: 'MOBILE', description: 'Custom maps & specialized duels', sortOrder: 2 },
    { name: 'Battle Royale', slug: 'battle-royale', platform: 'MOBILE', description: 'Classic survival lobbies', sortOrder: 3 },
    { name: 'PC Emulator League', slug: 'pc-emulator-league', platform: 'PC', description: 'Isolated PC/Emulator only queue', sortOrder: 4 },
  ];

  for (const cat of cats) {
    const existing = await prisma.gameCategory.findFirst({ where: { OR: [{ slug: cat.slug }, { name: cat.name }] } });
    if (existing) {
      await prisma.gameCategory.update({ where: { id: existing.id }, data: { slug: cat.slug, platform: cat.platform, description: cat.description, isActive: true, sortOrder: cat.sortOrder } });
    } else {
      await prisma.gameCategory.create({ data: { name: cat.name, slug: cat.slug, platform: cat.platform, description: cat.description, isActive: true, sortOrder: cat.sortOrder } });
    }
    console.log('Upserted category:', cat.name);
  }

  const esports = await prisma.gameCategory.findUnique({ where: { slug: 'mobile-esports' } });
  const craftland = await prisma.gameCategory.findUnique({ where: { slug: 'craftland-custom' } });
  const br = await prisma.gameCategory.findUnique({ where: { slug: 'battle-royale' } });
  const pc = await prisma.gameCategory.findUnique({ where: { slug: 'pc-emulator-league' } });

  const modes = [
    { name: 'Standard Clash Squad', slug: 'standard-cs', desc: 'Official 4v4 Clash Squad', categoryId: esports.id, formats: ['4v4'], platforms: ['MOBILE'] },
    { name: 'Desert Eagle Only (One Tap)', slug: 'deagle-1v1', desc: 'Pure headshot challenge', categoryId: esports.id, formats: ['1v1', '2v2'], platforms: ['MOBILE'] },
    { name: 'M590 Shotgun Only', slug: 'm590-1v1', desc: 'Close-quarters shotgun duel', categoryId: esports.id, formats: ['1v1'], platforms: ['MOBILE'] },
    { name: 'Craftland Deathmatch', slug: 'cl-deathmatch', desc: 'Craftland custom map battle', categoryId: craftland.id, formats: ['1v1','2v2','3v3','4v4','5v5','6v6'], platforms: ['MOBILE'] },
    { name: 'Battle Royale Solo', slug: 'br-solo', desc: 'Solo survival match', categoryId: br.id, formats: ['1v1','20 Players','32 Players','48 Players'], platforms: ['MOBILE'] },
    { name: 'Battle Royale Duo', slug: 'br-duo', desc: 'Duo survival match', categoryId: br.id, formats: ['2v2','20 Players','32 Players'], platforms: ['MOBILE'] },
    { name: 'Battle Royale Squad', slug: 'br-squad', desc: '4-player squad survival', categoryId: br.id, formats: ['4v4','32 Players','48 Players'], platforms: ['MOBILE'] },
    { name: 'PC Desert Eagle 1v1', slug: 'pc-deagle-1v1', desc: 'PC emulator headshot duel', categoryId: pc.id, formats: ['1v1'], platforms: ['PC'] },
    { name: 'PC Standard CS 4v4', slug: 'pc-standard-cs', desc: 'PC 4v4 Clash Squad', categoryId: pc.id, formats: ['4v4'], platforms: ['PC'] },
  ];

  for (const m of modes) {
    const existing = await prisma.gameMode.findUnique({ where: { slug: m.slug } });
    if (existing) {
      await prisma.gameMode.update({ where: { slug: m.slug }, data: { name: m.name, allowedFormats: m.formats, allowedPlatforms: m.platforms, isActive: true } });
    } else {
      await prisma.gameMode.create({ data: { name: m.name, slug: m.slug, description: m.desc, categoryId: m.categoryId, allowedFormats: m.formats, allowedPlatforms: m.platforms, isActive: true } });
    }
    console.log('Upserted mode:', m.name);
  }

  const maps = [
    { name: 'Bermuda', slug: 'bermuda' },
    { name: 'Purgatory', slug: 'purgatory' },
    { name: 'Kalahari', slug: 'kalahari' },
    { name: 'Next Era', slug: 'next-era' },
    { name: 'Solara', slug: 'solara' },
  ];

  for (const mp of maps) {
    const existing = await prisma.map.findUnique({ where: { slug: mp.slug } });
    if (existing) {
      await prisma.map.update({ where: { slug: mp.slug }, data: { name: mp.name, isActive: true } });
    } else {
      await prisma.map.create({ data: { name: mp.name, slug: mp.slug, isActive: true } });
    }
    console.log('Upserted map:', mp.name);
  }

  // Link all maps to all modes (full cross-link)
  const allModes = await prisma.gameMode.findMany();
  const allMaps = await prisma.map.findMany();

  for (const mode of allModes) {
    for (const map of allMaps) {
      await prisma.gameModeMap.upsert({
        where: { gameModeId_mapId: { gameModeId: mode.id, mapId: map.id } },
        update: {},
        create: { gameModeId: mode.id, mapId: map.id },
      });
    }
  }
  console.log('Linked maps to modes.');
  console.log('Seeding complete!');
  await prisma.$disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
