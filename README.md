# 🐄💳 Leo's Pay By Plow

> A Snowplow tracking demo app — PayJoy-style smartphone financing PWA built with Framework7 v9.

Part of the [snow-leosanches](https://github.com/snow-leosanches) demo portfolio.

## Stack

- **Framework7 v9** — Mobile-first PWA framework (MD dark theme)
- **TypeScript + Vite** — Build tooling
- **Snowplow Browser Tracker v4** — Behavioral analytics
- **Snowplow Micro** — Local event validation

## Quick Start

```bash
pnpm install
pnpm dev
```

Run Snowplow Micro for event inspection:
```bash
docker run -p 9090:9090 snowplow/snowplow-micro:latest
```

Then visit `http://localhost:9090/micro/all` to inspect events.

## Tracking Plan

| Event | Trigger |
|---|---|
| `device_viewed` | Device detail page load |
| `financing_calculator_used` | Slider interaction |
| `credit_application_started` | Application step 1 |
| `credit_application_step_completed` | Each step |
| `credit_application_submitted` | Final submit |
| `credit_decision_viewed` | Approval screen |
| `payment_initiated` | Payment CTA tap |
| `payment_completed` | Confirmation |
| `device_lock_simulated` | Missed payment toggle |

## Context Entities

| Entity | Attached To |
|---|---|
| `user_credit_profile` | All events |
| `loan_context` | Payment & plan events |
| `device_context` | Catalog & application events |

