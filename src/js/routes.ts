import type { Router } from 'framework7/types';

/** Served from `public/pages/` so Vite returns real HTML (not the SPA index fallback). */
const routes: Router.RouteParameters[] = [
  { path: '/',             url: '/pages/home.html'          },
  { path: '/phones/',      url: '/pages/phones.html'        },
  { path: '/phones',       url: '/pages/phones.html'        },
  { path: '/catalog/',     url: '/pages/catalog.html'       },
  { path: '/catalog',      url: '/pages/catalog.html'       },
  { path: '/device/:id/',  url: '/pages/device-detail.html' },
  { path: '/device/:id',   url: '/pages/device-detail.html' },
  { path: '/apply/',       url: '/pages/apply.html'         },
  { path: '/apply',        url: '/pages/apply.html'         },
  { path: '/thank-you/',   url: '/pages/thank-you.html'     },
  { path: '/thank-you',    url: '/pages/thank-you.html'     },
  { path: '/cash/',        url: '/pages/cash.html'          },
  { path: '/cash',         url: '/pages/cash.html'          },
  { path: '/payment/',     url: '/pages/payment.html'       },
  { path: '/profile/',     url: '/pages/profile.html'       },
  { path: '/profile',      url: '/pages/profile.html'       },
  { path: '/login/',       url: '/pages/login.html'         },
  { path: '/login',        url: '/pages/login.html'         },
];

export default routes;
