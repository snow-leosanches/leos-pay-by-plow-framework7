import { getDeviceById, weeklyInstallment, type Device } from '../data/devices';
import store from '../store';
import { deviceCtx, trackDeviceViewed, userCreditProfileCtx } from '../tracking/events';

/** Shown on promo line; full calculator lives on /apply. */
const PROMO_WEEKS = 12;

const MOCK_ACCESSORIES: { name: string; price: number }[] = [
  { name: 'Dual USB-C wall charger', price: 16.99 },
  { name: '3-in-1 cable (USB-C / Lightning)', price: 11.99 },
  { name: '5000 mAh power bank', price: 16.99 },
  { name: 'True wireless earbuds', price: 19.99 },
  { name: 'USB-C wired earbuds', price: 9.99 },
  { name: 'Protective case — clear', price: 14.99 },
];

function specValue(device: Device, label: string): string {
  return device.specs.find((s) => s.label === label)?.value ?? '—';
}

function buildHighlights(device: Device): { label: string; value: string }[] {
  const display = specValue(device, 'Display');
  const storage = specValue(device, 'Storage');
  const ram = specValue(device, 'RAM');
  const cam = specValue(device, 'Camera');
  const battery = specValue(device, 'Battery');
  const proc = specValue(device, 'Processor');
  const fiveG = /5g/i.test(device.model) || /5g/i.test(device.id);
  return [
    {
      label: 'SPEED',
      value: fiveG ? '5G · Wi‑Fi 802.11ac dual-band' : '4G LTE · Wi‑Fi 802.11ac dual-band',
    },
    {
      label: 'USAGE',
      value: 'All-day battery for streaming, calls, and apps (demo estimate).',
    },
    { label: 'DISPLAY', value: display },
    { label: 'STORAGE', value: `${storage} · ${ram} RAM` },
    { label: 'CAMERA', value: cam },
    { label: 'POWER', value: `${battery} · ${proc}` },
  ];
}

function buildLongDescription(device: Device): string {
  const display = specValue(device, 'Display');
  const battery = specValue(device, 'Battery');
  return (
    `The ${device.brand} ${device.model} delivers an approachable everyday experience at a strong value. ` +
    `Enjoy content on its ${display} display, move smoothly between apps, and capture moments with a versatile camera setup. ` +
    `Power through your day with a ${battery} battery. ` +
    `Tap Apply for Phone now to choose your payment plan in the application flow.`
  );
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

export function bindDeviceDetailPage(page: {
  $el: { [key: number]: HTMLElement };
  route?: { params?: { id?: string } };
}): void {
  const el = page.$el?.[0] as HTMLElement | undefined;
  if (!el) return;

  const id = page.route?.params?.id;
  const missingEl = el.querySelector<HTMLElement>('#device-detail-missing');
  const rootEl = el.querySelector<HTMLElement>('#device-detail-root');

  if (!missingEl || !rootEl) return;

  if (!id) {
    missingEl.style.display = 'block';
    rootEl.style.display = 'none';
    return;
  }

  const device = getDeviceById(id);
  if (!device) {
    missingEl.style.display = 'block';
    rootEl.style.display = 'none';
    return;
  }

  missingEl.style.display = 'none';
  rootEl.style.display = 'block';

  const titleEl = el.querySelector<HTMLElement>('#device-detail-title');
  const crumbEl = el.querySelector<HTMLElement>('#device-detail-crumb');
  const imgEl = el.querySelector<HTMLImageElement>('#device-detail-img');
  const promoEl = el.querySelector<HTMLElement>('#device-detail-promo');
  const nameEl = el.querySelector<HTMLElement>('#device-detail-name');
  const retailEl = el.querySelector<HTMLElement>('#device-detail-retail');
  const highlightsEl = el.querySelector<HTMLElement>('#device-detail-highlights');
  const descEl = el.querySelector<HTMLElement>('#device-detail-desc');
  const descToggle = el.querySelector<HTMLButtonElement>('#device-detail-desc-toggle');
  const descWrap = el.querySelector<HTMLElement>('.pbp-device-desc-wrap');
  const specsEl = el.querySelector<HTMLElement>('#device-detail-specs');
  const accEl = el.querySelector<HTMLElement>('#device-detail-accessories');
  const applyEl = el.querySelector<HTMLAnchorElement>('#device-detail-apply');

  if (
    !titleEl ||
    !crumbEl ||
    !imgEl ||
    !promoEl ||
    !nameEl ||
    !retailEl ||
    !highlightsEl ||
    !descEl ||
    !descToggle ||
    !descWrap ||
    !specsEl ||
    !accEl ||
    !applyEl
  ) {
    return;
  }

  const dev = device;

  const fullTitle = `${dev.brand} ${dev.model}`;
  titleEl.textContent = fullTitle;
  crumbEl.textContent = dev.model;
  imgEl.referrerPolicy = 'no-referrer';
  imgEl.src = dev.imageUrl;
  imgEl.alt = fullTitle;

  const weeklyPromo = weeklyInstallment(dev.priceUsd, PROMO_WEEKS);
  promoEl.textContent = `FROM $${weeklyPromo}/WEEK WITH APPROVED FINANCING`;
  nameEl.textContent = fullTitle;
  retailEl.textContent = `Retail $${dev.priceUsd.toFixed(2)} USD · Plus tax where applicable`;

  highlightsEl.innerHTML = buildHighlights(dev)
    .map(
      (h) =>
        `<li><span class="pbp-hl-label">${h.label}</span><span class="pbp-hl-value">${h.value}</span></li>`
    )
    .join('');

  descEl.textContent = buildLongDescription(dev);
  descWrap.classList.remove('pbp-device-desc-expanded');
  descToggle.textContent = 'See more';
  descToggle.setAttribute('aria-expanded', 'false');

  if (!el.dataset.deviceDescToggleBound) {
    el.dataset.deviceDescToggleBound = '1';
    descToggle.addEventListener('click', () => {
      const wrap = el.querySelector<HTMLElement>('.pbp-device-desc-wrap');
      const toggle = el.querySelector<HTMLButtonElement>('#device-detail-desc-toggle');
      if (!wrap || !toggle) return;
      const expanded = wrap.classList.toggle('pbp-device-desc-expanded');
      toggle.textContent = expanded ? 'See less' : 'See more';
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  specsEl.innerHTML = `<ul>${dev.specs
    .map(
      (s) =>
        `<li class="item-content"><div class="item-inner"><div class="item-title">${s.label}</div><div class="item-after">${s.value}</div></div></li>`
    )
    .join('')}</ul>`;

  accEl.innerHTML = MOCK_ACCESSORIES.map(
    (a) =>
      `<div class="pbp-accessory-card"><div class="pbp-accessory-name">${a.name}</div><div class="pbp-accessory-price">$${a.price.toFixed(2)}</div></div>`
  ).join('');

  applyEl.href = `/apply/?deviceId=${encodeURIComponent(dev.id)}`;

  if (el.dataset.deviceViewedFor !== id) {
    el.dataset.deviceViewedFor = id;
    trackDeviceViewed(dev.id, dev.brand, dev.priceUsd, weeklyPromo, trackCtx(dev));
  }
}
