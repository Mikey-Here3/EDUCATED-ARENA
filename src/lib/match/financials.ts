/**
 * Central Financial Utility for Educated Gamer Arena
 * 
 * All stake calculations MUST go through this single function.
 * Both the UI preview and the actual settlement API use the same math.
 * NO hardcoded percentages in components.
 */

// Platform fee configuration (configurable in one place)
const PLATFORM_FEE_PERCENT = 10; // 10%
const LOSER_REFUND_FIXED = 10;    // Fixed PKR 10 refund to loser

export interface StakeCalculation {
  entryFee: number;
  opponentEntryFee: number;
  totalPot: number;
  platformFee: number;
  loserRefund: number;
  winnerPrize: number;
  platformFeePercent: number;
}

/**
 * Calculate match stakes from entry fee.
 * Returns whole-integer PKR values only.
 */
export function calculateStakes(entryFee: number): StakeCalculation {
  const fee = Math.round(entryFee); // Ensure integer PKR
  const totalPot = fee * 2;
  const platformFee = Math.round(totalPot * (PLATFORM_FEE_PERCENT / 100));
  const loserRefund = LOSER_REFUND_FIXED;
  const winnerPrize = totalPot - platformFee - loserRefund;

  return {
    entryFee: fee,
    opponentEntryFee: fee,
    totalPot,
    platformFee,
    loserRefund,
    winnerPrize,
    platformFeePercent: PLATFORM_FEE_PERCENT,
  };
}
