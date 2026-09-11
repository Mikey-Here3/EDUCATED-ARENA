import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  displayName: z.string().min(2).max(30),
  phone: z.string().regex(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/, "Must be a valid Pakistani phone number"),
  dateOfBirth: z.string().datetime(),
  termsAccepted: z.literal(true),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(passwordRegex),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(2).max(30).optional(),
  freeFireUid: z.string().min(5).max(15).optional(),
  inGameName: z.string().max(30).optional(),
  phone: z.string().regex(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/).optional(),
  bio: z.string().max(500).optional(),
  dateOfBirth: z.string().datetime().optional(),
});

export const teamCreateSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(500).optional(),
});

export const guildCreateSchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(500).optional(),
  maxCapacity: z.number().int().min(10).max(100),
});

export const challengeCreateSchema = z.object({
  categoryId: z.string().min(1),
  gameModeId: z.string().min(1),
  mapId: z.string().min(1).optional(),
  mapSeriesId: z.string().min(1).optional(),
  format: z.string().min(1),
  platform: z.string().min(1),
  entryFee: z.number().min(100),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'DIRECT']),
  expiresAt: z.string().datetime().optional(),
  rules: z.array(z.string()).optional(),
}).refine(data => {
  if (!data.expiresAt) return true;
  const expiry = new Date(data.expiresAt).getTime();
  return expiry >= Date.now() + 30 * 60 * 1000;
}, { message: "Expiry must be at least 30 minutes in the future", path: ["expiresAt"] });

export const matchScheduleSchema = z.object({
  scheduledDate: z.string().datetime(),
  startTime: z.string(),
  timezone: z.string(),
  notes: z.string().max(500).optional(),
});

export const matchRoomSchema = z.object({
  roomId: z.string().min(1),
  roomPassword: z.string().min(1),
});

export const matchResultSchema = z.object({
  winnerSide: z.number().int().min(1).max(2),
  score: z.record(z.string(), z.number()).optional(),
  notes: z.string().max(500).optional(),
});

export const depositSchema = z.object({
  amount: z.coerce.number().min(50, 'Minimum deposit is PKR 50'),
  method: z.string().min(1, 'Payment method is required'),
  transactionReference: z.string().optional().nullable().or(z.literal('')),
  accountName: z.string().optional().nullable().or(z.literal('')),
  screenshotId: z.string().optional().nullable().or(z.literal('')),
});

export const withdrawalSchema = z.object({
  amount: z.coerce.number().min(200, 'Minimum withdrawal is PKR 200'),
  method: z.string().min(1, 'Payment method is required'),
  accountName: z.string().min(1).optional().nullable(),
  accountNumber: z.string().min(5, 'Valid account number is required'),
  accountTitle: z.string().optional().nullable(),
  userNote: z.string().max(200).optional().nullable(),
});

export const adminAdjustmentSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number(),
  reason: z.string().min(5).max(200),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  platform: z.string().min(1),
});

export const gameModeCreateSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
  categoryId: z.string().uuid(),
  allowedFormats: z.array(z.string()).min(1),
  allowedPlatforms: z.array(z.string()).min(1),
});

export const mapCreateSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(500).optional(),
});

export const ruleCreateSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10),
  categoryId: z.string().uuid().optional(),
  gameModeId: z.string().uuid().optional(),
  isDefault: z.boolean().default(false),
  isLocked: z.boolean().default(false),
});

export const settingUpdateSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export const penaltyCreateSchema = z.object({
  userId: z.string().uuid(),
  type: z.string().min(1),
  reason: z.string().min(5),
  evidence: z.string().url().optional(),
  duration: z.number().int().positive().optional(), // in hours
});

export const banCreateSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(5),
  isPermanent: z.boolean().default(false),
  expiresAt: z.string().datetime().optional(),
});

export const tournamentCreateSchema = z.object({
  name: z.string().min(5).max(100),
  description: z.string().max(2000),
  categoryId: z.string().uuid(),
  gameModeId: z.string().uuid(),
  platform: z.string().min(1),
  entryFee: z.number().min(0),
  prizePool: z.number().min(0),
  maxTeams: z.number().int().min(2),
  minTeamSize: z.number().int().min(1),
  maxTeamSize: z.number().int().min(1),
  bracketType: z.enum(['SINGLE_ELIMINATION', 'DOUBLE_ELIMINATION', 'ROUND_ROBIN']),
  registrationStartAt: z.string().datetime(),
  registrationEndAt: z.string().datetime(),
  startAt: z.string().datetime(),
});
