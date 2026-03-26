import { getItem } from './storage';
import { type ReferralCode } from '../types';

export const validateReferralCode = (code: string): ReferralCode | null => {
  if (!code) return null;
  const codes = getItem<ReferralCode[]>('referralCodes', []);
  return codes.find(c => c.code.toLowerCase() === code.toLowerCase()) || null;
};
