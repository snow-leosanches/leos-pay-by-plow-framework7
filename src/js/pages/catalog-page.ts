import { DEVICES, weeklyInstallment } from '../data/devices';

/** Shown on grid cards; same default length as apply flow (12 wks). */
const FINANCE_WEEKS = 12;

export function bindCatalogPage(page: { $el: { [key: number]: HTMLElement } }): void {
  const el = page.$el?.[0] as HTMLElement | undefined;
  if (!el || el.dataset.catalogBound === '1') return;
  el.dataset.catalogBound = '1';

  const grid = el.querySelector<HTMLElement>('#device-grid');
  if (!grid) return;

  grid.innerHTML = DEVICES.map((d) => {
    const weekly = weeklyInstallment(d.priceUsd, FINANCE_WEEKS);
    const title = `${d.brand} ${d.model}`;
    return `
<a href="/device/${d.id}/" class="device-card">
  <img src="${d.imageUrl}" alt="" loading="lazy" width="200" height="200" />
  <div class="device-name">${title}</div>
  <div class="device-weekly">From $${weekly}/week</div>
  <div class="device-price">Cash $${d.priceUsd} USD</div>
</a>`.trim();
  }).join('');
}
