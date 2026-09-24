# iMedX ANZ website rebuild prototype

This folder is the working redesign prototype aligned to the current iMedX public website, the team rebuild roadmap, and the HCS v2.0 evidence-first campaign direction.

## Rebuilt pages
- index.html — Homepage
- hcs.html — HIM Companion Suite
- hcs-v2.html — HCS v2.0 evidence-first campaign
- rcm.html — Revenue Cycle Management
- him-services.html — HIM Services
- outsourced-clinical-coding.html — Outsourced Clinical Coding
- clinical-documentation.html — Clinical Documentation hub
- clinical-documentation-hospitals.html — Hospitals
- clinical-documentation-private-practice.html — Private Practice
- clinical-documentation-radiology.html — Radiology & Imaging
- clinical-documentation-medico-legal.html — Medico-Legal
- instanote.html — InstaNote
- escription-one.html — eScription One
- resource-hub.html — Resource Hub v2
- persona-cfo.html — CFO persona
- persona-him-manager.html — Health Information Manager persona
- persona-coder.html — Coder persona
- 404.html — 404 page

## Governance / handoff artifacts
- HCS-V2-CLAIM-REGISTER.md
- PROOF-ASSET-REGISTER.md
- SEO-REDIRECT-MAP.csv
- ANALYTICS-PRODUCTION-SPEC.md
- FORM-IMPLEMENTATION-SPEC.md
- styles.css
- site.js

## Measurement hooks already scaffolded
- page_context
- persona_select
- hcs_v2_campaign_click
- casemix_validation_click
- resource_click
- resource_filter
- file_download
- click_phone
- click_email
- demo_cta_click
- contact_cta_click
- outbound_click
- scroll_depth

Production-only events to wire to real forms/tools:
- form_start
- generate_lead
- form_error
- tool_start
- tool_complete

## Content and evidence rule
Use current approved iMedX public content as the factual source unless new content has explicit approval. Quantitative HCS v2.0 claims remain held until source, method, caveat and public-use approval are documented.

## Prototype protection
All prototype HTML pages remain noindex,nofollow. Remove only at approved production deployment.

## Production dependencies still requiring real environment access/decisions
1. Final navigation/persona/URL approval.
2. Production form endpoint / CRM or inbox routing.
3. Production GTM container, GA4 property, consent configuration and key-event approval.
4. Final proof/client permissions.
5. Server/CMS implementation of redirects, schema, sitemap and forms.
6. Cross-browser/device QA in the production/staging environment.
