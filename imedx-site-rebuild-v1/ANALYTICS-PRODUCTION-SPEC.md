# iMedX ANZ rebuild — production analytics implementation spec

## Ownership
- Measurement design / QA: Krishna (SEO)
- dataLayer / GTM implementation: Yamuna (Development)
- Business conversion definitions: Nishant + Leadership
- Privacy / consent approval: Leadership / Legal

## Foundation
1. Confirm the single production GTM container. Remove duplicate hard-coded containers/tags before launch.
2. Confirm the production GA4 property and web stream.
3. Confirm Google Search Console domain/property access.
4. Agree consent/cookie behaviour before non-essential tags are enabled.
5. Keep prototype pages noindex until production approval.

## Required page context
Push once before dependent events:
- page_type
- product
- solution
- persona
- content_group
- environment

## Event registry
- demo_cta_click
- contact_cta_click
- persona_select
- hcs_v2_campaign_click
- casemix_validation_click
- resource_click
- resource_filter
- file_download
- form_start
- generate_lead
- form_error
- click_phone
- click_email
- outbound_click
- scroll_depth
- page_not_found
- tool_start
- tool_complete

## Conversion policy
Recommended GA4 key event:
- generate_lead

Optional only after business approval:
- tool_complete
- brochure_download / file_download for selected high-intent assets

Do not mark every micro-event as a conversion.

## Required parameters for lead events
- form_name
- form_type
- page_type
- product
- solution
- persona
- lead_type
- utm_source / medium / campaign / content / term where approved

Never send name, email, phone, free-text message or other PII to GA4 event parameters.

## QA before launch
- GTM Preview: every required event fires once.
- GA4 DebugView: event names and parameters are correct.
- Consent state: tags behave according to approved consent configuration.
- UTM test: campaign attribution persists to the approved lead handoff.
- Production smoke test after deployment.
