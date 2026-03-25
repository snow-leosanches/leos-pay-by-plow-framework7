import { trackEvent } from './tracker';
import { SCHEMAS } from './schemas';
import type { SelfDescribingJson } from '@snowplow/browser-tracker';

// ── Context builders ──────────────────────────────────────────────────────────

export function userCreditProfileCtx(
  customerId: string,
  creditTier: 'new' | 'bronze' | 'silver' | 'gold',
  isNewToCredit: boolean,
  country: string
): SelfDescribingJson {
  return {
    schema: SCHEMAS.userCreditProfile,
    data: { customer_id: customerId, credit_tier: creditTier, is_new_to_credit: isNewToCredit, country },
  };
}

export function deviceCtx(
  deviceId: string,
  brand: string,
  model: string,
  priceUsd: number,
  isFeatured: boolean
): SelfDescribingJson {
  return {
    schema: SCHEMAS.deviceContext,
    data: { device_id: deviceId, brand, model, price_usd: priceUsd, is_featured: isFeatured },
  };
}

export function loanCtx(
  loanId: string,
  deviceId: string,
  totalAmount: number,
  weeksTotal: number,
  weeksRemaining: number
): SelfDescribingJson {
  return {
    schema: SCHEMAS.loanContext,
    data: { loan_id: loanId, device_id: deviceId, total_amount: totalAmount, weeks_total: weeksTotal, weeks_remaining: weeksRemaining },
  };
}

// ── Events ────────────────────────────────────────────────────────────────────

export function trackDeviceViewed(
  deviceId: string, brand: string, priceUsd: number, weeklyInstallment: number,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.deviceViewed, { device_id: deviceId, brand, price_usd: priceUsd, weekly_installment: weeklyInstallment }, ctx);
}

export function trackFinancingCalculatorUsed(
  deviceId: string, weeksSelected: number, totalAmount: number,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.financingCalculatorUsed, { device_id: deviceId, weeks_selected: weeksSelected, total_amount: totalAmount }, ctx);
}

export function trackCreditApplicationStarted(
  deviceId: string, sourceScreen: string,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.creditApplicationStarted, { device_id: deviceId, source_screen: sourceScreen }, ctx);
}

export function trackCreditApplicationStepCompleted(
  stepNumber: number, stepName: string,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.creditApplicationStepCompleted, { step_number: stepNumber, step_name: stepName }, ctx);
}

export function trackCreditApplicationSubmitted(
  deviceId: string, requestedAmount: number, incomeBracket: string,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.creditApplicationSubmitted, { device_id: deviceId, requested_amount: requestedAmount, income_bracket: incomeBracket }, ctx);
}

export function trackCreditDecisionViewed(
  decision: 'approved' | 'needs_review', creditLimit: number,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.creditDecisionViewed, { decision, credit_limit: creditLimit }, ctx);
}

export function trackPaymentInitiated(
  loanId: string, amount: number, method: 'oxxo' | 'bank_transfer',
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.paymentInitiated, { loan_id: loanId, amount, method }, ctx);
}

export function trackPaymentCompleted(
  loanId: string, amount: number, remainingBalance: number,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.paymentCompleted, { loan_id: loanId, amount, remaining_balance: remainingBalance }, ctx);
}

export function trackDeviceLockSimulated(
  loanId: string, daysOverdue: number,
  ctx: SelfDescribingJson[]
): void {
  trackEvent(SCHEMAS.deviceLockSimulated, { loan_id: loanId, days_overdue: daysOverdue }, ctx);
}

export function trackCustomerIdentificationSpec(data: {
  email: string;
  phone: string;
}): void {
  trackEvent(SCHEMAS.customerIdentification, {
    email: data.email,
    phone: data.phone,
  });
}
