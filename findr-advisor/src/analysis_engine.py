"""
Findr Finance Advisor — reference analysis engine.

Takes the parsed multi-card transaction ledger (data/transactions.json) and produces
the aggregated, auditable numbers the advisor is allowed to state (data/insights.json).

In production, this module (or its equivalent) is exposed to the LLM as a set of
read-only tools ("get_category_trend", "get_subscriptions", "get_fees",
"find_anomalies", "recommend_payoff_order") rather than being pre-computed once —
so the advisor can answer arbitrary questions, not just the ones anticipated here,
while every number it states still traces back to a deterministic calculation.
"""
import json
from collections import defaultdict
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def load_transactions():
    return json.loads((DATA_DIR / "transactions.json").read_text())


def spend_only(txns):
    """Purchases only — excludes payments/credits."""
    return [t for t in txns if t["amount"] > 0 and t["category"] != "Payment"]


def totals_by_month(txns):
    out = defaultdict(float)
    for t in spend_only(txns):
        out[t["date"][:7]] += t["amount"]
    return dict(sorted(out.items()))


def totals_by_category(txns):
    months = sorted({t["date"][:7] for t in spend_only(txns)})
    out = defaultdict(lambda: [0.0] * len(months))
    for t in spend_only(txns):
        m_idx = months.index(t["date"][:7])
        out[t["category"]][m_idx] += t["amount"]
    return months, {k: [round(v, 2) for v in vs] for k, vs in out.items()}


def category_trend_pct(series):
    """% change from first to last period in a category's monthly series."""
    if not series or series[0] == 0:
        return None
    return round((series[-1] - series[0]) / series[0] * 100, 1)


def detect_subscriptions(txns):
    """Recurring, near-identical monthly charges under the 'Subscriptions' category."""
    by_desc = defaultdict(list)
    for t in txns:
        if t["category"] == "Subscriptions":
            by_desc[t["desc"]].append(t)
    subs = []
    for desc, items in by_desc.items():
        items.sort(key=lambda t: t["date"])
        amounts = [i["amount"] for i in items]
        subs.append({
            "name": desc,
            "occurrences": len(items),
            "latest_amount": amounts[-1],
            "price_changed": len(set(amounts)) > 1,
            "card": items[-1]["card"],
        })
    return subs


def audit_fees(txns):
    return [t for t in txns if t["category"] == "Fees"]


def find_duplicate_charges(txns, window_days=3):
    """Same merchant + same amount within N days = flag as possible duplicate."""
    from datetime import date
    spend = spend_only(txns)
    flags = []
    for i, a in enumerate(spend):
        for b in spend[i + 1:]:
            if a["desc"] == b["desc"] and abs(a["amount"] - b["amount"]) < 0.01 and a["card"] == b["card"]:
                d1 = date.fromisoformat(a["date"])
                d2 = date.fromisoformat(b["date"])
                if 0 < abs((d2 - d1).days) <= window_days:
                    flags.append({"desc": a["desc"], "amount": a["amount"],
                                  "dates": [a["date"], b["date"]], "card": a["card"]})
    return flags


def recommend_payoff_order(cards):
    """Highest-APR revolving balance first (avalanche method)."""
    revolvers = [c for c in cards if not c.get("pays_in_full", True) and c.get("apr")]
    return sorted(revolvers, key=lambda c: c["apr"], reverse=True)


if __name__ == "__main__":
    data = load_transactions()
    txns = data["transactions"]
    months, by_cat = totals_by_category(txns)

    print("Monthly totals:", totals_by_month(txns))
    for cat, series in by_cat.items():
        print(f"{cat:15s} {series}  trend: {category_trend_pct(series)}%")

    print("\nSubscriptions:")
    for s in detect_subscriptions(txns):
        print(" ", s)

    print("\nFees:")
    for f in audit_fees(txns):
        print(" ", f["date"], f["card"], f["desc"], f["amount"])

    print("\nPossible duplicate charges:")
    for d in find_duplicate_charges(txns):
        print(" ", d)
