# Kibble Implementation Backlog

This backlog is optimized for your product direction: mobile-first in-store food reference, barcode lookup, feeding guidance by weight goals, with meal/treat tracking as a secondary workflow.

## Success Criteria

- Pet parent can scan a product in-store and get usable nutrition + feeding guidance in under 10 seconds.
- Guidance adapts to species, life stage, neuter status, activity level, and weight goal.
- Missing foods can be submitted by users and reviewed by admins before becoming public.
- App remains useful offline with cached products and pet data.

## Phase 1: Scanner + Cloud Catalog Foundations

### Epic 1: Environment and backend wiring

1. Configure Supabase credentials via `EXPO_PUBLIC_*` env vars.
2. Ensure app runs in local-only mode when credentials are missing.
3. Add local+remote food catalog sync strategy.

Acceptance:
- App launches with or without Supabase credentials.
- Approved foods are fetched when cloud is available.

### Epic 2: Food catalog schema for scan-first lookups

1. Add barcode, moderation status, source, and verification fields to foods.
2. Add `food_submissions` table for user-submitted products.
3. Add profiles and admin role support.
4. Apply RLS policies for user/admin access boundaries.

Acceptance:
- Non-admin users can only read approved active foods.
- Users can submit foods; admins can review/approve/reject.

### Epic 2.1: External catalog ingestion + barcode identity

1. Select primary pet-food source (Open Pet Food Facts) and define licensing + attribution requirements.
2. Add import pipeline (one-time bootstrap + scheduled sync) to upsert foods from external datasets/APIs.
3. Add source metadata fields (`source`, `source_id`, `last_synced_at`, `license_ref`) for traceability.
4. Add normalized barcode handling (digit-only normalization, check-digit validation, unique lookup key).
5. Add conflict handling for duplicate barcode collisions and route unresolved conflicts to moderation.
6. Add fallback lookup path for unknown barcodes before showing "not found".

Acceptance:
- Catalog can be seeded in bulk from an external source without manual entry.
- Barcode lookup resolves against normalized unique keys with deterministic conflict behavior.
- Source provenance and license/attribution metadata are available for imported records.

### Epic 3: Scan flow scaffold (mobile)

1. Add dedicated `Scan` tab.
2. Add barcode lookup flow (manual input scaffold now, camera next).
3. Resolve barcode against local cache first, then cloud.
4. Route found items to food detail screen.

Acceptance:
- Valid barcode resolves food detail when available.
- Unknown barcode produces clear fallback state.

## Phase 2: Feeding Guidance Engine v2

### Epic 4: Veterinary-aware calculation upgrades

1. Add target-weight aware calculations for weight loss/gain pacing.
2. Add treat budget cap defaults and override settings.
3. Support mixed feeding plans (dry + wet combinations).
4. Add serving unit conversions (`g`, `cup`, `can`).

Acceptance:
- Recommendation explains daily kcal, grams/cups/cans, and treat allowance.
- Calculations are unit-tested with boundary cases.

### Epic 5: Food detail UX for shopping decisions

1. Surface calorie density and macro breakdown consistently.
2. Show warning badges for incomplete data and unverified entries.
3. Add compare mode for two scanned foods.

Acceptance:
- User can compare two foods and choose one quickly in-store.

## Phase 3: Submission + Moderation Workflows

### Epic 6: User submission experience

1. Add submission form from “not found” scan result.
2. Add optional label photo + nutrition panel photo capture.
3. Add duplicate-detection hints during submission.

Acceptance:
- Submission payload lands in `food_submissions` with `pending` status.

### Epic 7: Admin moderation console

1. Add admin queue filtered by pending submissions.
2. Add approve/reject with notes.
3. On approve, either create new catalog food or merge with existing entry.

Acceptance:
- Approved items become visible to non-admin users immediately.

## Phase 4: Tracking, Reliability, and Launch Readiness

### Epic 8: Meal and treat tracking polish (secondary)

1. Quick add from recently scanned foods.
2. Daily/weekly trend views with adherence to plan.
3. Lightweight reminders for meal times (optional).

### Epic 9: Quality and compliance

1. Add test coverage for calculations, lookup flow, and policy assumptions.
2. Add telemetry and crash monitoring.
3. Add legal copy: veterinary disclaimer, privacy policy, terms.

Acceptance:
- Build is testable, observable, and app-store ready.

## Implementation Notes

- Keep scanner flow primary in information architecture (`Scan` as first-class tab).
- Keep logging intentionally lightweight and non-blocking.
- Do not expose pending/unverified community data by default to all users.
- Prefer official datasets/APIs over scraping; only scrape when terms explicitly allow it.
