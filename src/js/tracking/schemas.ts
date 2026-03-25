const BASE = 'iglu:com.leospaybyplow';

export const SCHEMAS = {
  deviceViewed:                   `${BASE}/device_viewed/jsonschema/1-0-0`,
  financingCalculatorUsed:        `${BASE}/financing_calculator_used/jsonschema/1-0-0`,
  creditApplicationStarted:       `${BASE}/credit_application_started/jsonschema/1-0-0`,
  creditApplicationStepCompleted: `${BASE}/credit_application_step_completed/jsonschema/1-0-0`,
  creditApplicationSubmitted:     `${BASE}/credit_application_submitted/jsonschema/1-0-0`,
  creditDecisionViewed:           `${BASE}/credit_decision_viewed/jsonschema/1-0-0`,
  paymentInitiated:               `${BASE}/payment_initiated/jsonschema/1-0-0`,
  paymentCompleted:               `${BASE}/payment_completed/jsonschema/1-0-0`,
  deviceLockSimulated:            `${BASE}/device_lock_simulated/jsonschema/1-0-0`,
  customerIdentification:       `${BASE}/customer_identification/jsonschema/1-0-0`,

  // Entities
  userCreditProfile: `${BASE}/user_credit_profile/jsonschema/1-0-0`,
  loanContext:       `${BASE}/loan_context/jsonschema/1-0-0`,
  deviceContext:     `${BASE}/device_context/jsonschema/1-0-0`,
} as const;
