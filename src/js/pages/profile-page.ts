import { getDeviceById, weeklyInstallment } from '../data/devices';
import { syncAuthNav } from '../nav-auth';
import store, { type CreditApplicationRecord } from '../store';
import { setSnowplowUserId } from '../tracking/tracker';

const INCOME_LABELS: Record<string, string> = {
  under_500: 'Under $500 / month',
  '500_1000': '$500 – $999 / month',
  '1000_2000': '$1,000 – $1,999 / month',
  over_2000: '$2,000+ / month',
};

function sameEmail(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatSubmitted(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

function applicationsForUser(): CreditApplicationRecord[] {
  const apps = store.state.creditApplications;
  const email = store.state.user.email?.trim() ?? '';
  const uid = store.state.user.userId?.trim() ?? '';
  const keys = [email, uid].filter(Boolean);
  if (keys.length === 0) return [];
  return apps.filter((a: CreditApplicationRecord) =>
    keys.some((k) => sameEmail(a.email, k))
  );
}

export function bindProfilePage(
  app: { views: { main: { router: { navigate: (url: string) => void } } } },
  page: { $el: { [key: number]: HTMLElement } }
): void {
  const el = page.$el?.[0] as HTMLElement | undefined;
  if (!el) return;

  const loggedOutEl = el.querySelector<HTMLElement>('#profile-logged-out');
  const loggedInEl = el.querySelector<HTMLElement>('#profile-logged-in');
  const accountCard = el.querySelector<HTMLElement>('#profile-account-card');
  const latestEl = el.querySelector<HTMLElement>('#profile-latest-app');
  const historyEl = el.querySelector<HTMLElement>('#profile-history-list');

  if (!loggedOutEl || !loggedInEl || !accountCard || !latestEl || !historyEl) return;

  const loggedIn = Boolean(store.state.user.userId);

  if (!loggedIn) {
    loggedOutEl.style.display = 'block';
    loggedInEl.style.display = 'none';
    return;
  }

  if (!el.dataset.profileLogoutBound) {
    el.dataset.profileLogoutBound = '1';
    el.querySelector('#profile-logout')?.addEventListener('click', () => {
      store.dispatch('clearUserSession', undefined);
      setSnowplowUserId(null);
      syncAuthNav();
      app.views.main.router.navigate('/');
    });
  }

  loggedOutEl.style.display = 'none';
  loggedInEl.style.display = 'block';

  const u = store.state.user;
  const mine = applicationsForUser();
  const phoneFromSession = u.phone?.trim() ?? '';
  const phoneFromLatestApp = mine[0]?.phone?.trim() ?? '';
  const accountPhoneDisplay = phoneFromSession || phoneFromLatestApp || '—';

  accountCard.innerHTML = `
    <div class="pbp-profile-account-row"><span class="pbp-profile-label">Name</span><span class="pbp-profile-value">${escapeHtml(u.name || '—')}</span></div>
    <div class="pbp-profile-account-row"><span class="pbp-profile-label">Email</span><span class="pbp-profile-value">${escapeHtml(u.email || '—')}</span></div>
    <div class="pbp-profile-account-row"><span class="pbp-profile-label">Phone</span><span class="pbp-profile-value">${escapeHtml(accountPhoneDisplay)}</span></div>
    <div class="pbp-profile-account-row"><span class="pbp-profile-label">User ID</span><span class="pbp-profile-value pbp-profile-mono">${escapeHtml(u.userId ?? '—')}</span></div>
    ${u.city ? `<div class="pbp-profile-account-row"><span class="pbp-profile-label">Location</span><span class="pbp-profile-value">${escapeHtml([u.city, u.state, u.country].filter(Boolean).join(', '))}</span></div>` : ''}
  `;

  if (mine.length === 0) {
    latestEl.innerHTML =
      '<p class="text-muted" style="margin:0;">No phone credit applications yet. Browse the catalog and tap <strong>Apply for Phone now</strong>.</p>';
    historyEl.innerHTML =
      '<p class="text-muted" style="margin:0;">Your submitted applications will appear here.</p>';
    return;
  }

  const latest = mine[0];
  const perWeek = weeklyInstallment(
    latest.requestedAmount / 1.18,
    latest.weeksSelected
  );
  const device = getDeviceById(latest.deviceId);
  const deviceImg =
    device != null
      ? `<div class="pbp-profile-device-img-wrap"><img class="pbp-profile-device-img" src="${escapeHtml(device.imageUrl)}" alt="${escapeHtml(`${device.brand} ${device.model}`)}" width="160" height="160" loading="lazy" referrerpolicy="no-referrer" /></div>`
      : '';

  latestEl.innerHTML = `
    ${deviceImg}
    <div class="pbp-profile-detail-title">${escapeHtml(latest.deviceName)}</div>
    <p class="pbp-profile-status">Status: <strong>Submitted</strong> · ${escapeHtml(formatSubmitted(latest.submittedAt))}</p>
    <div class="pbp-profile-detail-grid">
      <div><span class="pbp-profile-label">Email on application</span><span class="pbp-profile-value">${escapeHtml(latest.email)}</span></div>
      <div><span class="pbp-profile-label">Phone</span><span class="pbp-profile-value">${escapeHtml(latest.phone)}</span></div>
      <div><span class="pbp-profile-label">Payment length</span><span class="pbp-profile-value">${latest.weeksSelected} weeks</span></div>
      <div><span class="pbp-profile-label">Est. weekly payment</span><span class="pbp-profile-value">$${perWeek}/week</span></div>
      <div><span class="pbp-profile-label">Financed total</span><span class="pbp-profile-value">$${latest.requestedAmount.toFixed(2)} USD</span></div>
      <div><span class="pbp-profile-label">Income (declared)</span><span class="pbp-profile-value">${escapeHtml(INCOME_LABELS[latest.incomeBracket] ?? latest.incomeBracket)}</span></div>
    </div>
    <a href="/device/${encodeURIComponent(latest.deviceId)}/" class="link" style="font-size: 13px; margin-top: 12px; display: inline-block;">View device</a>
  `;

  historyEl.innerHTML = mine
    .map((a) => {
      const d = getDeviceById(a.deviceId);
      const thumb =
        d != null
          ? `<img class="pbp-profile-history-thumb" src="${escapeHtml(d.imageUrl)}" alt="${escapeHtml(`${d.brand} ${d.model}`)}" width="56" height="56" loading="lazy" referrerpolicy="no-referrer" />`
          : '';
      return `
<div class="pbp-profile-history-item card">
  <div class="pbp-profile-history-row">
    ${thumb}
    <div class="pbp-profile-history-body">
      <div class="pbp-profile-history-top">
        <span class="pbp-profile-history-device">${escapeHtml(a.deviceName)}</span>
        <span class="pbp-profile-history-date">${escapeHtml(formatSubmitted(a.submittedAt))}</span>
      </div>
      <div class="pbp-profile-history-meta">
        $${a.requestedAmount.toFixed(2)} financed · ${a.weeksSelected} wks · ${escapeHtml(INCOME_LABELS[a.incomeBracket] ?? a.incomeBracket)}
      </div>
    </div>
  </div>
</div>`;
    })
    .join('');
}
