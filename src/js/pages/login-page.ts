import { faker } from '@faker-js/faker';

import { knownCustomers } from '../known-customers';
import { syncAuthNav } from '../nav-auth';
import store, { type UserSession } from '../store';
import { resetSnowplowSession, setSnowplowUserId } from '../tracking/tracker';
import { trackCustomerIdentificationSpec } from '../tracking/events';

function getReturnUrl(): string {
  const q = new URLSearchParams(window.location.search).get('returnUrl');
  if (!q || !q.startsWith('/')) return '/';
  return q;
}

function navigateAfterLogin(router: { navigate: (url: string) => void }): void {
  router.navigate(getReturnUrl());
}

function dispatchSession(session: UserSession): void {
  store.dispatch('setUserSession', session);
  syncAuthNav();
}

export function bindLoginPage(
  app: { views: { main: { router: { navigate: (url: string) => void } } } },
  page: { $el: { [key: number]: HTMLElement } }
): void {
  const el = page.$el?.[0] as HTMLElement | undefined;
  if (!el || el.dataset.loginBound === '1') return;
  el.dataset.loginBound = '1';

  const router = app.views.main.router;

  el.querySelector('#login-auto')?.addEventListener('click', () => {
    const email = faker.internet.email();
    const phone = faker.phone.number();
    const session: UserSession = {
      userId: email,
      name: faker.person.fullName(),
      email,
      phone,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    };
    dispatchSession(session);
    setSnowplowUserId(email);
    trackCustomerIdentificationSpec({
      email,
      phone,
    });
    navigateAfterLogin(router);
  });

  el.querySelector('#login-reset-snowplow')?.addEventListener('click', () => {
    resetSnowplowSession();
    setSnowplowUserId(null);
  });

  const manualInput = el.querySelector<HTMLInputElement>('#login-manual-email');
  manualInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      el.querySelector<HTMLButtonElement>('#login-manual')?.click();
    }
  });

  const knownGrid = el.querySelector<HTMLElement>('#login-known-grid');
  if (knownGrid) {
    knownGrid.replaceChildren();
    knownCustomers.forEach((customer) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'button button-fill';
      btn.id = `login-known-${customer.id}`;
      const line = document.createElement('div');
      line.textContent = `${customer.name} — ${customer.phone}`;
      const emailSpan = document.createElement('span');
      emailSpan.className = 'pbp-known-email';
      emailSpan.textContent = customer.email;
      btn.appendChild(line);
      btn.appendChild(emailSpan);
      btn.addEventListener('click', () => {
        const session: UserSession = {
          userId: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          state: customer.state,
          zipCode: customer.zipCode,
          country: customer.country,
        };
        dispatchSession(session);
        setSnowplowUserId(customer.id);
        trackCustomerIdentificationSpec({
          email: customer.email,
          phone: customer.phone,
        });
        navigateAfterLogin(router);
      });
      knownGrid.appendChild(btn);
    });
  }

  el.querySelector('#login-manual')?.addEventListener('click', () => {
    const input = el.querySelector<HTMLInputElement>('#login-manual-email');
    const email = input?.value.trim() ?? '';
    if (!email) return;
    const session: UserSession = {
      userId: email,
      name: '',
      email,
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    };
    dispatchSession(session);
    setSnowplowUserId(email);
    trackCustomerIdentificationSpec({ email, phone: '' });
    navigateAfterLogin(router);
  });

}
