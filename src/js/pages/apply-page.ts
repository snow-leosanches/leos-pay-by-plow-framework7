/**
 * Apply flow — event fields align with `data-structures/`:
 * - customer_identification.yaml + credit_application_started.yaml (step 1)
 * - financing_calculator_used.yaml (step 2; weeks_selected 12–48 per schema max 52)
 * - credit_application_step_completed.yaml (steps 1–3)
 * - credit_application_submitted.yaml (final confirm)
 */
import { financedTotalUsd, getDeviceById, weeklyInstallment, type Device } from '../data/devices';
import store from '../store';
import {
  deviceCtx,
  trackCreditApplicationStarted,
  trackCreditApplicationStepCompleted,
  trackCreditApplicationSubmitted,
  trackCustomerIdentificationSpec,
  trackFinancingCalculatorUsed,
  userCreditProfileCtx,
} from '../tracking/events';

const PAYMENT_WEEKS = [12, 24, 36, 48] as const;
const DEFAULT_WEEKS = 12;

/** `step_name` values for `credit_application_step_completed` (data-structures/credit_application_step_completed.yaml). */
const CREDIT_APP_STEP = {
  identification: 'customer_identification',
  financing: 'financing_calculator',
  confirmation: 'confirmation_review',
} as const;

type IncomeBracket = 'under_500' | '500_1000' | '1000_2000' | 'over_2000';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function trackCtx(device: Device) {
  return [
    deviceCtx(device.id, device.brand, device.model, device.priceUsd, device.isFeatured),
    userCreditProfileCtx(
      store.state.creditProfile.customerId,
      store.state.creditProfile.creditTier,
      store.state.creditProfile.isNewToCredit,
      store.state.creditProfile.country
    ),
  ];
}

function parseDeviceId(page: { route?: { query?: Record<string, string | undefined> } }): string {
  const q = page.route?.query?.deviceId ?? page.route?.query?.deviceid;
  if (typeof q === 'string' && q) return q;
  return new URLSearchParams(window.location.search).get('deviceId') ?? '';
}

function validEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function bindApplyPage(
  app: { views: { main: { router: { navigate: (url: string) => void } } } },
  page: { $el: { [key: number]: HTMLElement }; route?: { query?: Record<string, string | undefined> } }
): void {
  const el = page.$el?.[0] as HTMLElement | undefined;
  if (!el) return;

  const noDeviceEl = el.querySelector<HTMLElement>('#apply-no-device');
  const flowEl = el.querySelector<HTMLElement>('#apply-flow');
  const step1 = el.querySelector<HTMLElement>('#apply-step-1');
  const step2 = el.querySelector<HTMLElement>('#apply-step-2');
  const step3 = el.querySelector<HTMLElement>('#apply-step-3');
  const stepNumEl = el.querySelector<HTMLElement>('#apply-step-num');
  const progressFill = el.querySelector<HTMLElement>('#apply-progress-fill');
  const emailIn = el.querySelector<HTMLInputElement>('#apply-email');
  const phoneIn = el.querySelector<HTMLInputElement>('#apply-phone');
  const deviceImg = el.querySelector<HTMLImageElement>('#apply-device-img');
  const deviceNameEl = el.querySelector<HTMLElement>('#apply-device-name');
  const deviceRetailEl = el.querySelector<HTMLElement>('#apply-device-retail');
  const weekChipsEl = el.querySelector<HTMLElement>('#apply-week-chips');
  const calcSummaryEl = el.querySelector<HTMLElement>('#apply-calc-summary');
  const confirmCard = el.querySelector<HTMLElement>('#apply-confirm-card');
  const incomeSel = el.querySelector<HTMLSelectElement>('#apply-income');

  if (
    !noDeviceEl ||
    !flowEl ||
    !step1 ||
    !step2 ||
    !step3 ||
    !stepNumEl ||
    !progressFill ||
    !emailIn ||
    !phoneIn ||
    !deviceImg ||
    !deviceNameEl ||
    !deviceRetailEl ||
    !weekChipsEl ||
    !calcSummaryEl ||
    !confirmCard ||
    !incomeSel
  ) {
    return;
  }

  const elStepNum = stepNumEl;
  const elProgress = progressFill;
  const elStep1 = step1;
  const elStep2 = step2;
  const elStep3 = step3;
  const elCalc = calcSummaryEl;
  const elChips = weekChipsEl;
  const elImg = deviceImg;
  const elDevName = deviceNameEl;
  const elDevRetail = deviceRetailEl;
  const elConfirm = confirmCard;
  const elIncome = incomeSel;
  const elEmail = emailIn;
  const elPhone = phoneIn;

  const deviceId = parseDeviceId(page);
  const device = deviceId ? getDeviceById(deviceId) : undefined;

  if (!deviceId || !device) {
    noDeviceEl.style.display = 'block';
    flowEl.style.display = 'none';
    return;
  }

  noDeviceEl.style.display = 'none';
  flowEl.style.display = 'block';

  let selectedWeeks: number = DEFAULT_WEEKS;
  let identificationEmail = '';
  let identificationPhone = '';

  function setProgress(step: 1 | 2 | 3): void {
    elStepNum.textContent = String(step);
    elProgress.style.width = `${(step / 3) * 100}%`;
  }

  function showStep(step: 1 | 2 | 3): void {
    elStep1.style.display = step === 1 ? 'block' : 'none';
    elStep2.style.display = step === 2 ? 'block' : 'none';
    elStep3.style.display = step === 3 ? 'block' : 'none';
    setProgress(step);
  }

  function updateCalcSummary(dev: Device): void {
    const perWeek = weeklyInstallment(dev.priceUsd, selectedWeeks);
    const total = financedTotalUsd(dev.priceUsd);
    elCalc.innerHTML =
      `<strong>$${perWeek}/week</strong> × ${selectedWeeks} weeks · Financed total <strong>$${total.toFixed(2)}</strong> USD`;
  }

  function renderWeekChips(dev: Device): void {
    elChips.innerHTML = PAYMENT_WEEKS.map(
      (w) =>
        `<button type="button" class="button ${w === selectedWeeks ? 'pbp-apply-week-active' : ''}" data-weeks="${w}">${w} wks</button>`
    ).join('');

    elChips.querySelectorAll<HTMLButtonElement>('button[data-weeks]').forEach((btn) => {
      btn.onclick = () => {
        const w = Number(btn.dataset.weeks);
        if (!PAYMENT_WEEKS.includes(w as (typeof PAYMENT_WEEKS)[number])) return;
        selectedWeeks = w;
        elChips.querySelectorAll('button').forEach((b) => b.classList.remove('pbp-apply-week-active'));
        btn.classList.add('pbp-apply-week-active');
        updateCalcSummary(dev);
        trackFinancingCalculatorUsed(dev.id, selectedWeeks, financedTotalUsd(dev.priceUsd), trackCtx(dev));
      };
    });
  }

  function fillDeviceStep(dev: Device): void {
    elImg.src = dev.imageUrl;
    elImg.alt = `${dev.brand} ${dev.model}`;
    elDevName.textContent = `${dev.brand} ${dev.model}`;
    elDevRetail.textContent = `Retail $${dev.priceUsd.toFixed(2)} USD`;
    selectedWeeks = DEFAULT_WEEKS;
    renderWeekChips(dev);
    updateCalcSummary(dev);
  }

  function fillConfirm(dev: Device): void {
    const perWeek = weeklyInstallment(dev.priceUsd, selectedWeeks);
    const total = financedTotalUsd(dev.priceUsd);
    elConfirm.innerHTML = `
      <p style="margin: 0 0 8px; font-size: 14px; color: #e4e4ef;"><strong>${escapeHtml(dev.brand + ' ' + dev.model)}</strong></p>
      <p style="margin: 0; font-size: 13px; color: var(--pbp-text-muted);">Email: ${escapeHtml(identificationEmail)}</p>
      <p style="margin: 8px 0 0; font-size: 13px; color: var(--pbp-text-muted);">Phone: ${escapeHtml(identificationPhone)}</p>
      <p style="margin: 12px 0 0; font-size: 14px; color: var(--f7-theme-color);">
        $${perWeek}/week · ${selectedWeeks} weeks · Total $${total.toFixed(2)} USD
      </p>
    `;
    elIncome.selectedIndex = 0;
  }

  // Step 1: pre-fill from session when logged in
  const u = store.state.user;
  if (u.userId) {
    const email =
      u.email?.trim() || (u.userId.includes('@') ? u.userId.trim() : '');
    elEmail.value = email;
    elPhone.value = u.phone?.trim() ?? '';
  } else {
    elEmail.value = '';
    elPhone.value = '';
  }

  showStep(1);
  fillDeviceStep(device);

  el.querySelector<HTMLButtonElement>('#apply-step1-next')!.onclick = () => {
    const email = elEmail.value.trim();
    const phone = elPhone.value.trim();
    if (!validEmail(email)) {
      elEmail.focus();
      return;
    }
    if (phone.length < 8) {
      elPhone.focus();
      return;
    }

    identificationEmail = email;
    identificationPhone = phone;

    trackCreditApplicationStarted(device.id, 'customer_identification', trackCtx(device));
    trackCustomerIdentificationSpec({ email, phone });
    trackCreditApplicationStepCompleted(1, CREDIT_APP_STEP.identification, trackCtx(device));

    fillDeviceStep(device);
    showStep(2);
  };

  el.querySelector<HTMLButtonElement>('#apply-step2-next')!.onclick = () => {
    trackFinancingCalculatorUsed(device.id, selectedWeeks, financedTotalUsd(device.priceUsd), trackCtx(device));
    trackCreditApplicationStepCompleted(2, CREDIT_APP_STEP.financing, trackCtx(device));
    fillConfirm(device);
    showStep(3);
  };

  el.querySelector<HTMLButtonElement>('#apply-step2-back')!.onclick = () => {
    showStep(1);
  };

  el.querySelector<HTMLButtonElement>('#apply-step3-back')!.onclick = () => {
    showStep(2);
  };

  el.querySelector<HTMLButtonElement>('#apply-submit')!.onclick = () => {
    const income = elIncome.value as IncomeBracket | '';
    if (!income || !['under_500', '500_1000', '1000_2000', 'over_2000'].includes(income)) {
      elIncome.focus();
      return;
    }

    const requested = financedTotalUsd(device.priceUsd);
    trackCreditApplicationStepCompleted(3, CREDIT_APP_STEP.confirmation, trackCtx(device));
    trackCreditApplicationSubmitted(device.id, requested, income, trackCtx(device));

    store.dispatch('recordCreditApplication', {
      deviceId: device.id,
      deviceName: `${device.brand} ${device.model}`,
      email: identificationEmail,
      phone: identificationPhone,
      weeksSelected: selectedWeeks,
      requestedAmount: requested,
      incomeBracket: income,
    });

    app.views.main.router.navigate('/thank-you/');
  };
}
