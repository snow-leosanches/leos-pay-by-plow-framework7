/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Snowplow collector base URL (e.g. Micro or pipeline endpoint). */
  readonly VITE_SNOWPLOW_COLLECTOR?: string;
  /** `appId` passed to the Snowplow browser tracker. */
  readonly VITE_SNOWPLOW_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
