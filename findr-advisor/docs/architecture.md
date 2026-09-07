# Architecture — from prototype to production

## Prototype (this repo)

```
PDF statements (3 issuers)
        │  manual/PDF-parse
        ▼
data/transactions.json   ← single normalized ledger, all cards
        │  src/analysis_engine.py
        ▼
data/insights.json       ← pre-aggregated: trends, subscriptions, fees, anomalies
        │  webapp/app.html (buildAnswer())
        ▼
Dashboard + chat UI, keyword-matched to grounded answer templates
```

Everything is client-side and static on purpose — no backend needed to prove the
core idea: raw statements → verified numbers → specific advice.

## Production shape

```
┌────────────┐   ┌──────────────┐   ┌────────────────────┐   ┌──────────────┐
│  Statement  │   │   Ingestion   │   │   Normalized ledger │   │  Analytics    │
│  connectors │──▶│   pipeline    │──▶│   (Postgres, per-   │──▶│  layer        │
│ (Plaid/     │   │  (OCR/parse,  │   │   user, per-card,   │   │ (the same     │
│  issuer PDF/│   │   categorize, │   │   per-txn)          │   │  functions as │
│  CSV/OFX)   │   │   dedupe)     │   │                     │   │  analysis_    │
└────────────┘   └──────────────┘   └────────────────────┘   │  engine.py,   │
                                                                │  as callable  │
                                                                │  tools)       │
                                                                └───────┬──────┘
                                                                        │
                                                          ┌─────────────▼──────────────┐
                                                          │   LLM orchestration layer   │
                                                          │  (tool-calling agent):       │
                                                          │  - get_category_trend(cat,   │
                                                          │    window)                   │
                                                          │  - get_subscriptions(user)    │
                                                          │  - audit_fees(user, window)   │
                                                          │  - find_anomalies(user)       │
                                                          │  - recommend_payoff_order()   │
                                                          │  - simulate_plan(changes[])   │
                                                          └─────────────┬──────────────┘
                                                                        │
                                                          ┌─────────────▼──────────────┐
                                                          │   Advisor chat + dashboard   │
                                                          │   (mobile + web app)         │
                                                          └───────────────────────────┘
```

### Why tool-calling, not "summarize the transactions and answer"

Handing an LLM raw transactions and trusting it to compute percentages and sums in
its head is exactly how you get the vague, occasionally-wrong advice the product
brief explicitly rejects. Instead:

1. The LLM never does arithmetic on money. It calls a typed, tested function
   (`get_category_trend("Dining", months=3)`) and gets back a number it did not
   compute — audit trail included.
2. Every claim the advisor makes can be traced to one of these function calls,
   which makes it possible to unit-test the numeric core (`analysis_engine.py`)
   completely separately from prompt quality.
3. New question types are a prompting/tool-selection problem, not a new template —
   this is the main gap between the prototype's `buildAnswer()` keyword-matcher and
   the production version.

### Ingestion pipeline

- **Preferred path**: Plaid (or a similar aggregator) for linked-account transaction
  feeds — real-time, no PDF parsing needed, this is how "connect your cards" works
  for most fintechs.
- **Fallback path** (what this prototype demonstrates end-to-end): PDF/CSV statement
  upload → text extraction → LLM-assisted or rules-based line-item parsing →
  categorization → the same normalized ledger schema as the Plaid path, so the rest
  of the pipeline doesn't care which source a transaction came from.
- **Categorization**: issuer-provided categories (as in these 3 statements) are a
  good prior; a merchant-category-code (MCC) + embedding-similarity fallback handles
  issuers that don't provide one.
- **Deduplication**: cross-card and within-card duplicate detection (see
  `find_duplicate_charges` — same merchant, same amount, tight time window) runs at
  ingestion, not just at answer time, so the dashboard numbers are already clean.

### Data model (sketch)

```
users(id, name, ...)
cards(id, user_id, issuer, product, last4, apr, credit_limit)
transactions(id, card_id, date, description, category, amount, merchant_normalized)
recurring_charges(id, user_id, merchant_normalized, cadence, last_amount, first_seen, active)
insights(id, user_id, type, computed_at, payload_json)  -- cached tool outputs
```

### Trust & guardrails

- Every advisor response includes the underlying numbers, not just a conclusion —
  matches the product bar ("actual amounts, percentages, and trends").
  the pitch deck.
- Tool outputs are logged per-conversation so a support/trust team can replay exactly
  what data justified a given recommendation.
- No advisor claim is allowed to ship without a corresponding tool call in the trace
  — enforced by having the system prompt forbid free-form numeric claims and by
  post-hoc validating that every dollar figure in a response matches a tool output.

### What's already proven in this prototype

- Multi-issuer statement normalization into one ledger.
- Trend math (month-over-month %, category share).
- Subscription detection, including a "trial converted to paid" catch.
- Fee/interest audit.
- Duplicate-charge detection.
- APR-based payoff prioritization.
- A chat surface that answers with those numbers inline, not just a dashboard.

### What's next

- Swap the keyword-matched `buildAnswer()` for an LLM with the tool set above.
- Real statement ingestion (Plaid + PDF/OCR fallback).
- Persistence, auth, multi-user.
- Push notifications for "you just crossed X" triggers (e.g., dining pace on track
  to blow past last month, a subscription price increase detected).
