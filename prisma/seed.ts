import { PrismaClient, UserRole, UserStatus, Platform, ChallengeStatus, ChallengeVisibility, MatchStatus, PaymentMethodType, TournamentStatus, TournamentBracketType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production') {
    console.error('ERROR: Cannot run seed script in production environment.');
    process.exit(1);
  }

  console.log('🌱 Seeding Educated Gamer Arena database...');

  const passwordHash = await bcrypt.hash('Password123!', 12);

  // 1. Create Default Payment Methods
  const easypaisa = await prisma.paymentMethod.upsert({
    where: { id: 'pm-easypaisa' },
    update: {},
    create: {
      id: 'pm-easypaisa',
      type: PaymentMethodType.EASYPAISA,
      name: 'Easypaisa Mobile Account',
      accountName: 'Educated Gamer Arena Admin',
      accountNumber: '0300-1234567',
      instructions: 'Send money to our official Easypaisa number. Enter the Transaction ID (TID) in the deposit form and upload a screenshot of the receipt.',
      isActive: true,
      sortOrder: 1,
    },
  });

  const jazzcash = await prisma.paymentMethod.upsert({
    where: { id: 'pm-jazzcash' },
    update: {},
    create: {
      id: 'pm-jazzcash',
      type: PaymentMethodType.JAZZCASH,
      name: 'JazzCash Account',
      accountName: 'Educated Gamer Arena Admin',
      accountNumber: '0321-9876543',
      instructions: 'Send money via JazzCash app or retail shop. Enter your 12-digit TID and upload proof.',
      isActive: true,
      sortOrder: 2,
    },
  });

  // 2. Create Game Categories
  const catEsports = await prisma.gameCategory.upsert({
    where: { slug: 'esports-mobile' },
    update: {},
    create: {
      name: 'Mobile Esports',
      slug: 'esports-mobile',
      description: 'Official competitive Free Fire mobile tournament and clash squad category. Strictly no PC emulators.',
      platform: Platform.MOBILE,
      sortOrder: 1,
    },
  });

  const catCraftland = await prisma.gameCategory.upsert({
    where: { slug: 'craftland-custom' },
    update: {},
    create: {
      name: 'Craftland Custom',
      slug: 'craftland-custom',
      description: 'Custom community maps, one-tap challenges, and specialized weapon duel arenas.',
      platform: Platform.MOBILE,
      sortOrder: 2,
    },
  });

  const catBR = await prisma.gameCategory.upsert({
    where: { slug: 'battle-royale-mobile' },
    update: {},
    create: {
      name: 'Battle Royale (Full Map)',
      slug: 'battle-royale-mobile',
      description: 'Classic survival lobbies for 20, 32, or 48 players.',
      platform: Platform.MOBILE,
      sortOrder: 3,
    },
  });

  const catPC = await prisma.gameCategory.upsert({
    where: { slug: 'pc-isolated-category' },
    update: {},
    create: {
      name: 'PC Emulator League',
      slug: 'pc-isolated-category',
      description: 'Isolated category strictly for PC/Emulator players. Never mixed with mobile players.',
      platform: Platform.PC,
      sortOrder: 4,
    },
  });

  // 3. Create Maps
  const mapBermuda = await prisma.map.upsert({
    where: { slug: 'bermuda' },
    update: {},
    create: {
      name: 'Bermuda',
      slug: 'bermuda',
      description: 'The iconic Free Fire classic battlefield.',
      sortOrder: 1,
    },
  });

  const mapPurgatory = await prisma.map.upsert({
    where: { slug: 'purgatory' },
    update: {},
    create: {
      name: 'Purgatory',
      slug: 'purgatory',
      description: 'High-ground tactical canyon warfare.',
      sortOrder: 2,
    },
  });

  const mapKalahari = await prisma.map.upsert({
    where: { slug: 'kalahari' },
    update: {},
    create: {
      name: 'Kalahari',
      slug: 'kalahari',
      description: 'Fast-paced desert terrain combat.',
      sortOrder: 3,
    },
  });

  const mapNextEra = await prisma.map.upsert({
    where: { slug: 'next-era' },
    update: {},
    create: {
      name: 'Next Era',
      slug: 'next-era',
      description: 'Futuristic urban battleground.',
      sortOrder: 4,
    },
  });

  // 4. Create Game Modes
  const modeStandardCS = await prisma.gameMode.upsert({
    where: { slug: 'standard-clash-squad' },
    update: {},
    create: {
      name: 'Standard Clash Squad',
      slug: 'standard-clash-squad',
      description: 'Standard 4v4 Clash Squad competitive format with default weapon economy.',
      categoryId: catEsports.id,
      allowedFormats: ['1v1', '2v2', '4v4', '6v6', 'GvG'],
      allowedPlatforms: ['MOBILE'],
      defaultEntryFee: 100,
      defaultPrize: 180,
      sortOrder: 1,
    },
  });

  const modeDeagle = await prisma.gameMode.upsert({
    where: { slug: 'desert-eagle-only' },
    update: {},
    create: {
      name: 'Desert Eagle Only (One Tap)',
      slug: 'desert-eagle-only',
      description: 'Pure mechanical headshot challenge. No other firearms allowed.',
      categoryId: catEsports.id,
      allowedFormats: ['1v1', '2v2', '4v4'],
      allowedPlatforms: ['MOBILE'],
      defaultEntryFee: 200,
      defaultPrize: 360,
      sortOrder: 2,
    },
  });

  const modeM590 = await prisma.gameMode.upsert({
    where: { slug: 'm590-shotgun-only' },
    update: {},
    create: {
      name: 'M590 Shotgun Only',
      slug: 'm590-shotgun-only',
      description: 'Close-quarters shotgun reflex duel.',
      categoryId: catCraftland.id,
      allowedFormats: ['1v1', '2v2', '4v4'],
      allowedPlatforms: ['MOBILE'],
      defaultEntryFee: 150,
      defaultPrize: 270,
      sortOrder: 3,
    },
  });

  // 5. Create Core Users
  // Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@educatedgamer.com' },
    update: {},
    create: {
      email: 'admin@educatedgamer.com',
      username: 'arena_admin',
      displayName: 'EG Master Admin',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '0300-0000001',
      dateOfBirth: new Date('1995-01-01'),
      termsAcceptedAt: new Date(),
    },
  });

  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      freeFireUid: '999999999',
      inGameName: 'EG_Admin',
      bio: 'Head of Operations at Educated Gamer Arena.',
      rating: 2500,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      availableBalance: 100000,
      currency: 'PKR',
    },
  });

  // Manager
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@educatedgamer.com' },
    update: {},
    create: {
      email: 'manager@educatedgamer.com',
      username: 'match_manager_01',
      displayName: 'EG Operations Manager',
      passwordHash,
      role: UserRole.MANAGER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '0300-0000002',
      dateOfBirth: new Date('1998-05-15'),
      termsAcceptedAt: new Date(),
    },
  });

  await prisma.profile.upsert({
    where: { userId: managerUser.id },
    update: {},
    create: {
      userId: managerUser.id,
      freeFireUid: '888888888',
      inGameName: 'EG_Referee',
      bio: 'Official match referee and tournament manager.',
      rating: 2000,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: managerUser.id },
    update: {},
    create: {
      userId: managerUser.id,
      availableBalance: 50000,
      currency: 'PKR',
    },
  });

  // Competitive Players
  const player1 = await prisma.user.upsert({
    where: { email: 'player1@educatedgamer.com' },
    update: {},
    create: {
      email: 'player1@educatedgamer.com',
      username: 'SniperKing_PK',
      displayName: 'SniperKing PK',
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '0312-3456789',
      dateOfBirth: new Date('2002-08-20'),
      termsAcceptedAt: new Date(),
    },
  });

  await prisma.profile.upsert({
    where: { userId: player1.id },
    update: {},
    create: {
      userId: player1.id,
      freeFireUid: '184920491',
      inGameName: 'EG_SniperKing',
      bio: 'Top ranked 1v1 and Clash Squad IGL.',
      rating: 2450,
      wins: 142,
      losses: 18,
      matchesPlayed: 160,
      totalEarnings: 85400,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: player1.id },
    update: {},
    create: {
      userId: player1.id,
      availableBalance: 12500,
      totalWinnings: 85400,
      totalDeposits: 20000,
      totalWithdrawals: 92900,
      currency: 'PKR',
    },
  });

  const player2 = await prisma.user.upsert({
    where: { email: 'player2@educatedgamer.com' },
    update: {},
    create: {
      email: 'player2@educatedgamer.com',
      username: 'ShadowNinja_99',
      displayName: 'ShadowNinja',
      passwordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      phone: '0333-7654321',
      dateOfBirth: new Date('2003-11-12'),
      termsAcceptedAt: new Date(),
    },
  });

  await prisma.profile.upsert({
    where: { userId: player2.id },
    update: {},
    create: {
      userId: player2.id,
      freeFireUid: '891048201',
      inGameName: 'Shadow_N99',
      bio: 'Craftland One-Tap Specialist.',
      rating: 2380,
      wins: 128,
      losses: 24,
      matchesPlayed: 152,
      totalEarnings: 64200,
    },
  });

  await prisma.wallet.upsert({
    where: { userId: player2.id },
    update: {},
    create: {
      userId: player2.id,
      availableBalance: 8400,
      totalWinnings: 64200,
      totalDeposits: 15000,
      totalWithdrawals: 70800,
      currency: 'PKR',
    },
  });

  // 6. Create Sample Open Challenge
  await prisma.challenge.upsert({
    where: { publicId: 'EG-CH-10001' },
    update: {},
    create: {
      publicId: 'EG-CH-10001',
      creatorId: player1.id,
      categoryId: catEsports.id,
      gameModeId: modeDeagle.id,
      mapId: mapBermuda.id,
      format: '1v1',
      platform: Platform.MOBILE,
      entryFee: 500,
      prizePool: 1000,
      status: ChallengeStatus.OPEN,
      visibility: ChallengeVisibility.PUBLIC,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await prisma.challenge.upsert({
    where: { publicId: 'EG-CH-10002' },
    update: {},
    create: {
      publicId: 'EG-CH-10002',
      creatorId: player2.id,
      categoryId: catEsports.id,
      gameModeId: modeStandardCS.id,
      mapId: mapPurgatory.id,
      format: '4v4',
      platform: Platform.MOBILE,
      entryFee: 1000,
      prizePool: 2000,
      status: ChallengeStatus.OPEN,
      visibility: ChallengeVisibility.PUBLIC,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // 7. Create Sample Tournament
  await prisma.tournament.upsert({
    where: { publicId: 'EG-T-1001' },
    update: {},
    create: {
      publicId: 'EG-T-1001',
      name: 'Free Fire Karachi Masters Cup',
      slug: 'karachi-masters-cup',
      description: 'The premier 4v4 squad championship of Sindh. 32 teams single-elimination tournament.',
      categoryId: catEsports.id,
      gameModeId: modeStandardCS.id,
      platform: Platform.MOBILE,
      entryFee: 500,
      prizePool: 25000,
      maxTeams: 32,
      minTeamSize: 4,
      maxTeamSize: 5,
      bracketType: TournamentBracketType.SINGLE_ELIMINATION,
      registrationStartAt: new Date(),
      registrationEndAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      status: TournamentStatus.REGISTRATION_OPEN,
      createdById: adminUser.id,
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('Credentials:');
  console.log('  Admin:   admin@educatedgamer.com   / Password123!');
  console.log('  Manager: manager@educatedgamer.com / Password123!');
  console.log('  Player1: player1@educatedgamer.com / Password123!');
  console.log('  Player2: player2@educatedgamer.com / Password123!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
