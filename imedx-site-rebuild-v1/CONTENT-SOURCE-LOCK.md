# iMedX ANZ rebuild — content source lock

## Rule
The redesign changes information architecture, layout, component design, navigation and presentation. It must not silently rewrite approved iMedX product/service claims.

## Primary public source of truth
- Homepage: https://imedx.com.au/
- HIM Companion Suite: https://imedx.com.au/products/companion-suite/
- Clinical Documentation: https://imedx.com.au/solutions/clinical-documentation-solutions/
- HIM Services: https://imedx.com.au/solutions/him-services/
- Revenue Cycle Management: https://imedx.com.au/solutions/revenue-cycle-management/
- Outsourced Clinical Coding: https://imedx.com.au/solutions/outsourced-clinical-coding/
- eScription One: https://imedx.com.au/products/escription-one/
- Resource Hub: https://imedx.com.au/resource-hub/

## HCS v2 exception
New stakeholder-approved HCS v2 messaging may be added as a clearly separated campaign layer:
- Beyond Accuracy Claims
- Measured. Tuned. Governed. Proven.
- Baseline accuracy by coding segment
- Benchmark against the hospital's own coded data/casemix
- HIM-owned governance and release gates
- Coder retained as a control
- Funding and Revenue Assurance across hospital settings
- Failures, exceptions and limitations remain visible

HCS v2 does not replace or rewrite the current HCS product-page claims unless a stakeholder explicitly approves that change.

## Quantitative claim guard
Do not publish new HCS v2 figures such as illustrative baseline ranges, release thresholds, validation sample sizes, or production results until evidence and public-use approval are documented in HCS-V2-CLAIM-REGISTER.md.

## Design rule
Beautify by changing layout, spacing, hierarchy, interactions, navigation, typography, card treatment, imagery presentation and responsive behaviour — not by inventing new marketing claims.

## QA rule
Before each shareable prototype:
1. verify one H1 per page;
2. verify internal links;
3. verify image alt text;
4. verify prototype remains noindex,nofollow;
5. verify HCS role dropdown still works;
6. verify HCS v2 unapproved quantitative claims are not exposed.
