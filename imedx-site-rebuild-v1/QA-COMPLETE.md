# Prototype QA closure

## Completed
- All primary and secondary HTML routes included in source.
- Persona/product/sector pages are real pages, not generic redirects.
- Shared primary navigation applied site-wide.
- Skip-to-content and mobile navigation behavior provided by site.js.
- Responsive media queries included across main and secondary templates.
- Prototype pages remain noindex,nofollow.
- JSON-LD page/entity metadata added across site pages.
- Privacy and Terms links point to current official iMedX pages.
- dataLayer context, CTA, persona, resource-filter, download, outbound, section-view, scroll-depth and readiness-tool events implemented.
- Resource Hub v2 taxonomy implemented.
- HCS Readiness Assessment implemented without PII collection.
- HCS sticky contextual navigation implemented.

## External production activation
These are governance/production-access dependencies, not unfinished build work:
- connect organisation-approved GTM/GA4 IDs at official production activation;
- remove noindex only after leadership approval;
- execute official-domain 301 changes only after URL migration approval;
- new client quotes/logos require normal client approval before publication.


## Live verification — 25 Sep 2026
- Production preview deployment: READY
- 18/18 primary + secondary routes returned HTTP 200
- All 18 pages verified with:
  - non-empty title
  - non-empty meta description
  - exactly one H1
  - JSON-LD schema
  - staging noindex
- Shared CSS and JS returned HTTP 200
- sitemap.xml and robots.txt returned HTTP 200
- Resource Hub v2 live
- HCS Readiness Assessment live
- CFO / HIM Manager / Clinical Coder pages live
- Hospitals / Private Practice / Radiology / Medico-Legal pages live
- HCS sticky contextual navigation live
- Current Edge deployment has no new runtime-error cluster; the only logged deprecation warning belongs to the superseded Node proxy deployment.

## Build status
No known prototype build item remains intentionally partial or pending. Remaining actions are external governance/official-production activation decisions, not unfinished implementation.
