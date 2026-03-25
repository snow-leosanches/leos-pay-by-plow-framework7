import store from './store';

const HIDDEN = 'pbp-nav-item-hidden';

/** Show Login when logged out, Profile when logged in (never both). */
export function syncAuthNav(): void {
  const loggedIn = Boolean(store.state.user.userId);
  document.querySelectorAll<HTMLElement>('.pbp-nav-login').forEach((el) => {
    const hide = loggedIn;
    el.classList.toggle(HIDDEN, hide);
    el.hidden = hide;
    el.setAttribute('aria-hidden', hide ? 'true' : 'false');
  });
  document.querySelectorAll<HTMLElement>('.pbp-nav-profile').forEach((el) => {
    const hide = !loggedIn;
    el.classList.toggle(HIDDEN, hide);
    el.hidden = hide;
    el.setAttribute('aria-hidden', hide ? 'true' : 'false');
  });
}
