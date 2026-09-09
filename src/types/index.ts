export interface SessionUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: 'USER' | 'MANAGER' | 'ADMIN';
  permissions: string[];
  profileImageUrl?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface WalletSummary {
  available: number;
  reserved: number;
  pending: number;
  totalWinnings: number;
  totalDeposits: number;
  totalWithdrawals: number;
  lifetimeEarnings: number;
  currency: string;
}

export interface MatchDetails {
  id: string;
  publicId: string;
  format: string;
  status: string;
  entryFee: number;
  prizePool: number;
  category: { id: string; name: string };
  gameMode: { id: string; name: string };
  map?: { id: string; name: string };
  creator: PublicUser;
  opponent?: PublicUser;
  schedule?: {
    scheduledDate: string;
    startTime: string;
    timezone: string;
  };
  result?: {
    winnerSide: number;
    score: Record<string, number>;
  };
}

export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl?: string;
  rating: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
}

export interface ChallengeCardData {
  id: string;
  publicId: string;
  creator: PublicUser;
  creatorTeam?: { id: string; name: string; logoUrl?: string };
  category: { id: string; name: string };
  gameMode: { id: string; name: string };
  map?: { id: string; name: string };
  format: string;
  platform: string;
  entryFee: number;
  prizePool: number;
  status: string;
  visibility: string;
  expiresAt?: string;
  createdAt: string;
  rulesPreview?: string;
}

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface TeamData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  leader: PublicUser;
  memberCount: number;
  rating: number;
  wins: number;
  losses: number;
  matchesPlayed: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt: string;
}

export interface TransactionData {
  id: string;
  type: string;
  status: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  currency: string;
  description: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: string;
}

export interface FileAsset {
  id: string;
  path: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageProvider: string;
  url: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: unknown;
  category: string;
  description?: string;
  isPublic: boolean;
  updatedAt: string;
}
