import type { SelfDescribingJson } from '@snowplow/browser-tracker';
import {
  trackCreditApplicationStartedSpec,
  trackCreditApplicationStepCompletedSpec,
  trackCreditApplicationSubmittedSpec,
  trackCreditDecisionViewedSpec,
  trackCustomerIdentificationSpec as snowtypeTrackCustomerIdentificationSpec,
  trackDeviceLockSimulatedSpec,
  trackDeviceViewedSpec,
  trackFinancingCalculatorUsedSpec,
  trackPaymentCompletedSpec,
  trackPaymentInitiatedSpec,
} from '../../../snowtype/snowplow';
import type { IncomeBracket as SubmittedIncomeWire } from '../../../snowtype/snowplow';

/** UI / app storage values (select `value` and profile store). */
export type AppIncomeBracket = 'under_500' | '500_1000' | '1000_2000' | 'over_2000';

function appIncomeToSubmittedWire(bracket: AppIncomeBracket): SubmittedIncomeWire {
  switch (bracket) {
    case 'under_500':
      return 'under_500';
    case '500_1000':
      return '5001000';
    case '1000_2000':
      return '10002000';
    case 'over_2000':
      return 'over_2000';
  }
}
import store from '../store';
import { SCHEMAS } from './schemas';
import { TRACKER_NS } from './tracker';

const trackers = [TRACKER_NS];

// ── Context builders (unchanged; use SCHEMAS for custom entities) ────────────

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

// ── Events (Snowtype `*Spec` = self-describing payload + event specification context) ──

export function trackDeviceViewed(
  deviceId: string,
  brand: string,
  priceUsd: number,
  weeklyInstallment: number,
  ctx: SelfDescribingJson[]
): void {
  trackDeviceViewedSpec(
    {
      device_id: deviceId,
      brand,
      price_usd: priceUsd,
      weekly_installment: weeklyInstallment,
      context: ctx,
    },
    trackers
  );
}

export function trackFinancingCalculatorUsed(
  deviceId: string,
  weeksSelected: number,
  totalAmount: number,
  ctx: SelfDescribingJson[]
): void {
  trackFinancingCalculatorUsedSpec(
    {
      device_id: deviceId,
      weeks_selected: weeksSelected,
      total_amount: totalAmount,
      context: ctx,
    },
    trackers
  );
}

export function trackCreditApplicationStarted(
  deviceId: string,
  sourceScreen: string,
  ctx: SelfDescribingJson[]
): void {
  trackCreditApplicationStartedSpec(
    {
      device_id: deviceId,
      source_screen: sourceScreen,
      context: ctx,
    },
    trackers
  );
}

export function trackCreditApplicationStepCompleted(
  stepNumber: number,
  stepName: string,
  ctx: SelfDescribingJson[]
): void {
  trackCreditApplicationStepCompletedSpec(
    {
      step_number: stepNumber,
      step_name: stepName,
      context: ctx,
    },
    trackers
  );
}

export function trackCreditApplicationSubmitted(
  deviceId: string,
  requestedAmount: number,
  incomeBracket: AppIncomeBracket,
  ctx: SelfDescribingJson[]
): void {
  trackCreditApplicationSubmittedSpec(
    {
      device_id: deviceId,
      requested_amount: requestedAmount,
      income_bracket: appIncomeToSubmittedWire(incomeBracket),
      context: ctx,
    },
    trackers
  );
}

export function trackCreditDecisionViewed(
  decision: 'approved' | 'needs_review',
  creditLimit: number,
  ctx: SelfDescribingJson[]
): void {
  trackCreditDecisionViewedSpec(
    {
      decision,
      credit_limit: creditLimit,
      context: ctx,
    },
    trackers
  );
}

export function trackPaymentInitiated(
  loanId: string,
  amount: number,
  method: 'oxxo' | 'bank_transfer',
  ctx: SelfDescribingJson[]
): void {
  trackPaymentInitiatedSpec(
    {
      loan_id: loanId,
      amount,
      method,
      context: ctx,
    },
    trackers
  );
}

export function trackPaymentCompleted(
  loanId: string,
  amount: number,
  remainingBalance: number,
  ctx: SelfDescribingJson[]
): void {
  trackPaymentCompletedSpec(
    {
      loan_id: loanId,
      amount,
      remaining_balance: remainingBalance,
      context: ctx,
    },
    trackers
  );
}

export function trackDeviceLockSimulated(
  loanId: string,
  daysOverdue: number,
  ctx: SelfDescribingJson[]
): void {
  trackDeviceLockSimulatedSpec(
    {
      loan_id: loanId,
      days_overdue: daysOverdue,
      context: ctx,
    },
    trackers
  );
}

export function trackCustomerIdentificationSpec(data: {
  email: string;
  phone: string;
}): void {
  const p = store.state.creditProfile;
  snowtypeTrackCustomerIdentificationSpec(
    {
      email: data.email,
      phone: data.phone,
      context: [
        userCreditProfileCtx(p.customerId, p.creditTier, p.isNewToCredit, p.country),
      ],
    },
    trackers
  );
}
