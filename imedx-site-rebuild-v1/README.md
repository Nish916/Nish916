# iMedX ANZ website rebuild prototype

This folder is a working redesign prototype aligned to the current website content and the team rebuild roadmap.

## Current pages
- index.html — Homepage
- hcs.html — HIM Companion Suite
- rcm.html — Revenue Cycle Management
- clinical-documentation.html — Clinical Documentation hub
- him-services.html — HIM Services
- resource-hub.html — Resource Hub v2 concept
- persona-cfo.html — CFO persona route
- persona-him-manager.html — Health Information Manager persona route
- persona-coder.html — Coder persona route
- 404.html — prototype 404
- styles.css — shared styles
- site.js — prototype analytics/dataLayer + interaction layer

## Measurement hooks
site.js pushes privacy-safe prototype events into window.dataLayer, including:
- page_context
- persona_select
- resource_click
- file_download
- click_phone
- click_email
- demo_cta_click
- contact_cta_click
- outbound_click
- scroll_depth
- resource_filter

This is instrumentation scaffolding only. It does not install a production GTM or GA4 container and should be mapped to the approved production measurement plan before deployment.

## Content rule
Use current approved iMedX website content as the factual source unless new content has explicit approval. Do not introduce unsupported product, performance, security or clinical claims.

## Next production steps
1. Leadership sign-off on navigation/persona scope.
2. Final source-content audit and proof/case-study approvals.
3. Krishna: SEO baseline, metadata/schema, redirects, GA4/GTM mapping.
4. Yamuna: production component implementation, forms, dataLayer and responsive/accessibility QA.
5. Full cross-browser/content/analytics/SEO QA before soft launch.
