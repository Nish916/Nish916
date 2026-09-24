# iMedX ANZ rebuild — lead form implementation spec

## Forms in scope
1. Book a Demo / Product enquiry
2. General sales enquiry
3. Gated resource request (only if gating is approved)
4. Client support — keep separate from sales and use the existing support route/workflow

## Recommended sales/demo fields
- First name
- Last name
- Work email
- Organisation
- Job role / function
- Country (Australia / New Zealand / Other)
- Area of interest
- Optional message
- Privacy acknowledgement / consent wording approved by Leadership/Legal

Do not ask for unnecessary health or patient information.

## Area of interest values
- HIM Companion Suite
- HCS v2.0 / casemix validation
- Outsourced Clinical Coding
- HIM Services / Auditing / CDI
- Revenue Cycle Management
- Clinical Documentation
- InstaNote
- eScription One
- Other

## Behaviour
- Client-side validation plus server-side validation.
- Accessible inline error messages.
- Preserve user input after validation error.
- Clear success state only after confirmed backend success.
- Do not display a fake success message when the backend fails.
- Spam protection (server-side and/or approved anti-bot method).
- No sensitive form values in analytics.

## Lead routing decision required
Leadership/Sales must confirm:
- recipient inbox or CRM destination;
- owner by product/solution;
- response SLA;
- duplicate handling;
- UTM/source handoff;
- support-vs-sales routing.

## Tracking
- form_start on first meaningful interaction;
- generate_lead only after successful server response;
- form_error for validation/server errors using controlled error categories.
