import {
  newTracker,
  enableActivityTracking,
  trackPageView as spTrackPageView,
  trackSelfDescribingEvent,
  setUserId,
  clearUserData,
} from '@snowplow/browser-tracker';
import type { SelfDescribingJson } from '@snowplow/browser-tracker';

export const TRACKER_NS = 'pbp';

const collector =
  import.meta.env.VITE_SNOWPLOW_COLLECTOR || 'http://localhost:9090';
const appId =
  import.meta.env.VITE_SNOWPLOW_APP_ID || 'leos-pay-by-plow';

export function initTracker(): void {
  newTracker(TRACKER_NS, collector, {
    appId,
    platform: 'web',
    cookieSameSite: 'Lax',
    discoverRootDomain: true,
    stateStorageStrategy: 'cookieAndLocalStorage',
    respectDoNotTrack: false,
    eventMethod: 'post',
  });

  enableActivityTracking({ minimumVisitLength: 10, heartbeatDelay: 10 });
}

export function trackPageView(title?: string): void {
  spTrackPageView({ title }, [TRACKER_NS]);
}

export function trackEvent(
  schema: string,
  data: Record<string, unknown>,
  context?: SelfDescribingJson[]
): void {
  trackSelfDescribingEvent(
    {
      event: { schema, data },
      context,
    },
    [TRACKER_NS]
  );
}

export function setSnowplowUserId(userId: string | null): void {
  setUserId(userId, [TRACKER_NS]);
}

export function resetSnowplowSession(): void {
  clearUserData(
    { preserveSession: false, preserveUser: false },
    [TRACKER_NS]
  );
}
