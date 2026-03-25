import Framework7 from 'framework7/lite-bundle';
import { initTracker, setSnowplowUserId, trackPageView } from './tracking/tracker';
import routes from './routes';
import store from './store';
import { syncAuthNav } from './nav-auth';
import { bindCatalogPage } from './pages/catalog-page';
import { bindDeviceDetailPage } from './pages/device-detail-page';
import { bindApplyPage } from './pages/apply-page';
import { bindLoginPage } from './pages/login-page';
import { bindProfilePage } from './pages/profile-page';

function getOrCreateMainViewEl(): HTMLElement {
  const root = document.getElementById('app');
  if (!root) {
    throw new Error("Framework7: missing #app root element");
  }
  const existing = root.querySelector<HTMLElement>('.view-main');
  if (existing) return existing;
  const view = document.createElement('div');
  view.className = 'view view-main';
  root.appendChild(view);
  return view;
}

// Init Snowplow
initTracker();

const mainViewEl = getOrCreateMainViewEl();

const app = new Framework7({
  el: '#app',
  name: "Leo's Pay By Plow",
  theme: 'ios',
  darkMode: false,
  colors: {
    primary: '#1565c0',
  },
  store,
  routes,

  view: {
    browserHistory: true,
    browserHistorySeparator: '',
  },

  on: {
    pageAfterIn(page: any) {
      syncAuthNav();
      trackPageView(page.name);
      if (page.name === 'catalog') {
        bindCatalogPage(page);
      }
      if (page.name === 'device-detail') {
        bindDeviceDetailPage(page);
      }
      if (page.name === 'apply') {
        bindApplyPage(app, page);
      }
      if (page.name === 'profile') {
        bindProfilePage(app, page);
      }
      if (page.name === 'login') {
        bindLoginPage(app, page);
      }
    },
  },
});

app.views.create(mainViewEl, { url: '/' });

syncAuthNav();
requestAnimationFrame(() => {
  syncAuthNav();
});

if (store.state.user.userId) {
  setSnowplowUserId(store.state.user.userId);
}
