# Findr — Finance Advisor Agent (Prototype)

An AI advisor prototype for Findr, a personal finance app. Users hold 3-5 cards with
fragmented spending and no consolidated view. This prototype ingests statements from
multiple issuers, computes real trend/percentage-based analytics, and answers
free-text questions with **grounded, quantified recommendations** — not generic tips.

Live demo: see `webapp/app.html` (open directly in a browser, no server needed) or the
published Artifact link shared with this submission.

## Why this exists

> "Cut back on dining" is worthless.
> "Dining is $420/month, 22% of your spend and up 30% since January — pulling it back
> to your December level saves ~$130/month" is the product.

Every number the advisor states is computed live from the parsed transaction data —
see `webapp/app.html`'s `buildAnswer()` function and `data/insights.json`.

## Test case: Jordan T. Reeves, Portland OR — Jun–Aug 2026

Three real (fictional/simulated) statements were parsed:

| Card | Issuer | APR | Behavior |
|---|---|---|---|
| •••• 8837 | Meridian Express (Mastercard) | n/a | Pays in full every cycle |
| •••• 6014 | Aurora Credit Union (Rewards Platinum) | 17.90% | Revolves a balance, 1 late fee |
| •••• 4021 | Summit Bank (Visa Signature) | 22.99% | Revolves a balance, pays interest + FX fees |

Key findings the agent surfaces (all numbers from `data/insights.json`, derived from
`data/transactions.json`):

- **Dining up 103%** June → August ($124.05 → $252.20/mo) — the single biggest lever.
- **14 subscriptions, $190.82/mo ($2,290/yr)** across 2 cards, including a Paramount+
  free trial that silently converted to a $11.99/mo paid plan.
- **$97.05 in avoidable fees** over 3 months: 1 late payment fee, 2 foreign transaction
  fees, 2 interest charges.
- **A likely duplicate charge**: Costco Wholesale billed $142.85 twice, 48 hours apart.
- **Two revolving balances at high APR** (17.9% and 22.99%) while a third card is
  always paid in full — a clear pay-down-order recommendation.

## Repo structure

```
findr-advisor/
├── README.md
├── data/
│   ├── transactions.json     # parsed line items from all 3 statements (source of truth)
│   └── insights.json         # pre-aggregated stats the advisor reasons over
├── webapp/
│   └── app.html              # single-file prototype: dashboard + AI advisor chat
├── src/
│   └── analysis_engine.py    # reference Python implementation of the same analytics
│                              #  (category trends, subscription detection, fee audit,
│                              #   duplicate-charge detection, payoff prioritization)
├── docs/
│   └── architecture.md       # how this maps to a production system
└── pitch/
    └── Findr_Pitch_Deck.pptx
```

## How the advisor works (prototype vs. production)

This prototype's chat is a **deterministic, template-grounded response engine**
(`buildAnswer()` in `app.html`) — every answer is built by pulling real numbers out
of `insights.json` and slotting them into a response template matched by intent
keywords. This was a deliberate choice for the interview format: it proves the hard
part (turning raw statement data into specific, correct, quantified claims) without
depending on an external LLM API key in this sandboxed environment, and every number
shown is auditable back to the source PDFs.

In production this template layer is replaced by an LLM call (see
`docs/architecture.md`) where the model is given **read-only tool access to the same
aggregation functions** (`analysis_engine.py`) — i.e. the model narrates and reasons
over verified numbers it queries at run time, rather than being trusted to compute or
recall them itself. That keeps the "every claim is backed by real numbers" bar intact
as the system scales past canned intents to open-ended questions.

## Running it

No build step. Open `webapp/app.html` in any browser. Or run:

```bash
python3 -m http.server 8000 --directory webapp
# then visit http://localhost:8000/app.html
```

To regenerate `data/insights.json` from `data/transactions.json`:

```bash
python3 src/analysis_engine.py
```

## Status

Prototype built end-to-end from 3 uploaded PDF statements in a single working
session: PDF → structured transactions → aggregated insights → grounded advisor →
working webapp → pitch deck. Not production-hardened (no auth, no real PDF-parsing
pipeline, no persistence) — see `docs/architecture.md` for the path from here to
production.
