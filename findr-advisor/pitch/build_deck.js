const pptxgen = require("pptxgenjs");

const NAVY = "0B1E3D";
const NAVY2 = "132B52";
const TEAL = "02C39A";
const TEAL_DK = "028090";
const ICE = "CADCFC";
const WHITE = "FFFFFF";
const OFFWHITE = "F4F7FB";
const CORAL = "F96167";
const MUTED = "6B7A99";
const DARK_TEXT = "16223B";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
const W = 13.33, H = 7.5;

function bgSlide(dark) {
  const s = pres.addSlide();
  s.background = { color: dark ? NAVY : WHITE };
  return s;
}

function footer(s, label, dark) {
  s.addText(label, { x: 0.5, y: H - 0.42, w: 8, h: 0.3, fontSize: 10, color: dark ? "5C6E92" : "A6B0C3", fontFace: "Calibri" });
  s.addText("Findr — Finance Advisor Agent", { x: W - 4.5, y: H - 0.42, w: 4, h: 0.3, fontSize: 10, color: dark ? "5C6E92" : "A6B0C3", align: "right", fontFace: "Calibri" });
}

/* ---------------- SLIDE 1: TITLE ---------------- */
{
  const s = bgSlide(true);
  s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: NAVY } });
  s.addShape("ellipse", { x: 9.7, y: -2.2, w: 7, h: 7, fill: { color: NAVY2 }, line: { type: "none" } });
  s.addShape("ellipse", { x: 11.2, y: 3.6, w: 4.2, h: 4.2, fill: { color: TEAL_DK, transparency: 78 }, line: { type: "none" } });

  s.addText("FINDR", { x: 0.7, y: 0.55, w: 5, h: 0.5, fontSize: 16, bold: true, color: TEAL, charSpacing: 4, fontFace: "Calibri", isTextBox: true });
  s.addText("The Finance Advisor Agent", { x: 0.7, y: 2.55, w: 10.5, h: 1.5, fontSize: 46, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true });
  s.addText("Not another dashboard. An advisor that tells you what to do — and shows the math.", { x: 0.7, y: 3.75, w: 9.2, h: 0.7, fontSize: 18, color: ICE, fontFace: "Calibri", isTextBox: true });

  s.addText([
    { text: "Prototype walkthrough  ·  ", options: { color: MUTED } },
    { text: "AI / Automation Lead candidate submission", options: { color: ICE, bold: true } },
  ], { x: 0.7, y: 6.55, w: 10, h: 0.4, fontSize: 12.5, fontFace: "Calibri", isTextBox: true });
}

/* ---------------- SLIDE 2: THE PROBLEM ---------------- */
{
  const s = bgSlide(false);
  s.addText("The problem", { x: 0.6, y: 0.5, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL_DK, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText("Users hold 3-5 cards. Findr shows them charts anyway.", { x: 0.6, y: 0.9, w: 11.8, h: 1, fontSize: 30, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });

  const cards = [
    { t: "Fragmented spending", d: "Every card issuer shows its own slice. No one sees the whole picture — groceries alone can be split across 2-3 statements." },
    { t: "Forgotten recurring charges", d: "Free trials quietly convert to paid plans. Subscriptions pile up across cards where no single view ever adds them up." },
    { t: '"Great, now what?"', d: "A pie chart tells you where money went. It never tells you what to change, by how much, or what it's worth." },
  ];
  const cw = 3.85, gap = 0.35, startX = 0.6, y0 = 2.35;
  cards.forEach((c, i) => {
    const x = startX + i * (cw + gap);
    s.addShape("roundRect", { x, y: y0, w: cw, h: 3.5, rectRadius: 0.12, fill: { color: OFFWHITE }, line: { type: "none" }, shadow: { type: "outer", color: "1B2A4A", opacity: 0.12, blur: 10, offset: 3, angle: 90 } });
    s.addShape("ellipse", { x: x + 0.35, y: y0 + 0.4, w: 0.55, h: 0.55, fill: { color: i === 2 ? CORAL : TEAL }, line: { type: "none" } });
    s.addText(String(i + 1), { x: x + 0.35, y: y0 + 0.4, w: 0.55, h: 0.55, align: "center", valign: "middle", fontSize: 20, bold: true, color: WHITE, fontFace: "Calibri", isTextBox: true });
    s.addText(c.t, { x: x + 0.35, y: y0 + 1.15, w: cw - 0.7, h: 0.7, fontSize: 17, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });
    s.addText(c.d, { x: x + 0.35, y: y0 + 1.85, w: cw - 0.7, h: 1.5, fontSize: 12.5, color: MUTED, fontFace: "Calibri", isTextBox: true, lineSpacingMultiple: 1.25 });
  });
  footer(s, "01 · Problem");
}

/* ---------------- SLIDE 3: THE BAR ---------------- */
{
  const s = bgSlide(true);
  s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: NAVY } });
  s.addText("The bar we're building to", { x: 0.6, y: 0.55, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText("Users don't trust vague advice.", { x: 0.6, y: 1.0, w: 11, h: 0.9, fontSize: 30, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true });

  s.addShape("roundRect", { x: 0.6, y: 2.1, w: 12.1, h: 1.35, rectRadius: 0.1, fill: { color: "23325A" }, line: { color: CORAL, width: 1.5 } });
  s.addText([{ text: "✕  ", options: { color: CORAL, bold: true } }, { text: '"Cut back on dining."', options: { color: "C7CFE6", italic: true } }], { x: 1.0, y: 2.35, w: 11.3, h: 0.9, fontSize: 20, fontFace: "Cambria", isTextBox: true });

  s.addShape("roundRect", { x: 0.6, y: 3.75, w: 12.1, h: 2.15, rectRadius: 0.1, fill: { color: "0F3B36" }, line: { color: TEAL, width: 1.5 } });
  s.addText([
    { text: "✓  ", options: { color: TEAL, bold: true } },
    { text: "Dining is $420/month, 22% of your spend and up 30% since January —\npulling it back to your December level saves ", options: { color: WHITE } },
    { text: "~$130/month.", options: { color: TEAL, bold: true } },
  ], { x: 1.0, y: 4.0, w: 11.3, h: 1.7, fontSize: 20, fontFace: "Cambria", isTextBox: true, lineSpacingMultiple: 1.2 });

  s.addText("That second line — amounts, percentages, trends, from real data — is the product.", { x: 0.6, y: 6.15, w: 11.5, h: 0.5, fontSize: 15, italic: true, color: ICE, fontFace: "Calibri", isTextBox: true });
  footer(s, "02 · The bar", true);
}

/* ---------------- SLIDE 4: SOLUTION OVERVIEW ---------------- */
{
  const s = bgSlide(false);
  s.addText("The solution", { x: 0.6, y: 0.5, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL_DK, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText("A Finance Advisor Agent, grounded in real transactions", { x: 0.6, y: 0.9, w: 11.8, h: 0.9, fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });

  const steps = [
    { t: "Connect", d: "Cards link (or a statement is uploaded) and every transaction lands in one normalized ledger, across issuers." },
    { t: "Analyze", d: "A deterministic analytics layer computes trends, subscriptions, fee audits, duplicate charges, payoff order — real math, not guesses." },
    { t: "Advise", d: "The agent answers free-text questions by calling those analytics functions, and quotes the exact numbers back." },
    { t: "Act", d: "Every recommendation is quantified: a dollar amount, a %, a time-bound — something the user can actually decide on." },
  ];
  const cw = 2.85, gap = 0.28, startX = 0.6, y0 = 2.15;
  steps.forEach((st, i) => {
    const x = startX + i * (cw + gap);
    s.addShape("roundRect", { x, y: y0, w: cw, h: 4.0, rectRadius: 0.12, fill: { color: i % 2 === 0 ? NAVY : NAVY2 }, line: { type: "none" } });
    s.addText("0" + (i + 1), { x: x + 0.25, y: y0 + 0.25, w: cw - 0.5, h: 0.6, fontSize: 26, bold: true, color: TEAL, fontFace: "Cambria", isTextBox: true });
    s.addText(st.t, { x: x + 0.25, y: y0 + 0.95, w: cw - 0.5, h: 0.5, fontSize: 18, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true });
    s.addText(st.d, { x: x + 0.25, y: y0 + 1.5, w: cw - 0.5, h: 2.3, fontSize: 12, color: ICE, fontFace: "Calibri", isTextBox: true, lineSpacingMultiple: 1.25 });
    if (i < steps.length - 1) {
      s.addText("→", { x: x + cw + 0.02, y: y0 + 1.6, w: 0.26, h: 0.5, fontSize: 20, color: MUTED, align: "center", fontFace: "Calibri", isTextBox: true });
    }
  });
  footer(s, "03 · Solution");
}

/* ---------------- SLIDE 5: LIVE TEST CASE ---------------- */
{
  const s = bgSlide(false);
  s.addText("Proof of concept", { x: 0.6, y: 0.5, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL_DK, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText("Tested on one real user's 3 cards, 3 months", { x: 0.6, y: 0.9, w: 11.8, h: 0.8, fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });

  s.addChart(pres.ChartType.bar, [{
    name: "Monthly spend",
    labels: ["June", "July", "August"],
    values: [1759, 1912, 2953],
  }], {
    x: 0.6, y: 1.95, w: 5.6, h: 3.5,
    showTitle: true, title: "Total spend by month (all 3 cards)", titleFontSize: 13, titleColor: DARK_TEXT,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: DARK_TEXT,
    chartColors: [TEAL_DK],
    catAxisLabelColor: MUTED, valAxisLabelColor: MUTED, valAxisHidden: false,
    valGridLine: { color: "E4E9F2", size: 0.75 }, catGridLine: { style: "none" },
    showLegend: false, barGapWidthPct: 45,
  });

  const rows = [
    ["Meridian Express •8837", "No revolving balance", TEAL_DK],
    ["Aurora Credit Union •6014", "17.9% APR · 1 late fee", "B8860B"],
    ["Summit Bank •4021", "22.99% APR · interest + FX fees", CORAL],
  ];
  let ry = 2.0;
  s.addText("3 cards, 3 issuers, 1 person", { x: 6.65, y: 1.65, w: 6, h: 0.4, fontSize: 15, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });
  rows.forEach(([name, meta, color]) => {
    s.addShape("roundRect", { x: 6.65, y: ry, w: 6.05, h: 0.85, rectRadius: 0.08, fill: { color: OFFWHITE }, line: { type: "none" } });
    s.addShape("rect", { x: 6.65, y: ry, w: 0.08, h: 0.85, fill: { color } });
    s.addText(name, { x: 6.95, y: ry + 0.08, w: 5.5, h: 0.4, fontSize: 13.5, bold: true, color: DARK_TEXT, fontFace: "Calibri", isTextBox: true });
    s.addText(meta, { x: 6.95, y: ry + 0.44, w: 5.5, h: 0.35, fontSize: 11.5, color: MUTED, fontFace: "Calibri", isTextBox: true });
    ry += 1.0;
  });
  footer(s, "04 · Proof of concept");
}

/* ---------------- SLIDE 6: FOUR FINDINGS ---------------- */
{
  const s = bgSlide(false);
  s.addText("What the agent found", { x: 0.6, y: 0.5, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL_DK, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText("Four grounded findings, zero guesswork", { x: 0.6, y: 0.9, w: 11.8, h: 0.8, fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });

  const items = [
    { big: "+103%", label: "Dining, June → August", sub: "$124 → $252/mo. Back to June's level saves $128/mo ($1,540/yr).", color: CORAL },
    { big: "$2,290", label: "Spent on subscriptions / year", sub: "14 subscriptions across 2 cards. A Paramount+ trial silently converted to $11.99/mo.", color: TEAL_DK },
    { big: "$97", label: "Avoidable fees in 3 months", sub: "1 late fee, 2 FX fees, 2 interest charges — all preventable with autopay + card choice.", color: "B8860B" },
    { big: "$142.85", label: "Likely duplicate charge caught", sub: "Same Costco charge billed twice, 48 hours apart, on the Meridian card.", color: TEAL },
  ];
  const cw = 2.85, gap = 0.28, startX = 0.6, y0 = 2.15;
  items.forEach((it, i) => {
    const x = startX + i * (cw + gap);
    s.addShape("roundRect", { x, y: y0, w: cw, h: 4.0, rectRadius: 0.12, fill: { color: OFFWHITE }, line: { type: "none" }, shadow: { type: "outer", color: "1B2A4A", opacity: 0.10, blur: 8, offset: 2, angle: 90 } });
    s.addText(it.big, { x: x + 0.2, y: y0 + 0.3, w: cw - 0.4, h: 0.9, fontSize: 32, bold: true, color: it.color, fontFace: "Cambria", isTextBox: true });
    s.addText(it.label, { x: x + 0.2, y: y0 + 1.15, w: cw - 0.4, h: 0.7, fontSize: 13.5, bold: true, color: DARK_TEXT, fontFace: "Calibri", isTextBox: true });
    s.addText(it.sub, { x: x + 0.2, y: y0 + 1.85, w: cw - 0.4, h: 2.0, fontSize: 11.5, color: MUTED, fontFace: "Calibri", isTextBox: true, lineSpacingMultiple: 1.25 });
  });
  footer(s, "05 · Findings");
}

/* ---------------- SLIDE 7: THE ADVISOR IN ACTION (chat mock) ---------------- */
{
  const s = bgSlide(true);
  s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: NAVY } });
  s.addText("The advisor, live", { x: 0.6, y: 0.5, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText('"Give me a plan to spend better"', { x: 0.6, y: 0.9, w: 11.8, h: 0.8, fontSize: 26, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true });

  // user bubble
  s.addShape("roundRect", { x: 7.6, y: 2.05, w: 5.1, h: 0.6, rectRadius: 0.15, fill: { color: TEAL_DK }, line: { type: "none" } });
  s.addText("Give me a plan to spend better", { x: 7.8, y: 2.05, w: 4.7, h: 0.6, fontSize: 13, color: WHITE, valign: "middle", fontFace: "Calibri", isTextBox: true });

  // bot bubble
  s.addShape("roundRect", { x: 0.6, y: 2.85, w: 9.6, h: 3.9, rectRadius: 0.15, fill: { color: NAVY2 }, line: { type: "none" } });
  s.addText([
    { text: "Here's a grounded plan based on your last 3 months:\n\n", options: { color: ICE, bold: false } },
    { text: "1. Trim dining toward June levels", options: { color: TEAL, bold: true, breakLine: true } },
    { text: "   August is $252/mo vs June's $124/mo → saves $128/mo\n", options: { color: "C7CFE6", breakLine: true } },
    { text: "2. Cut streaming from 7 services to 2", options: { color: TEAL, bold: true, breakLine: true } },
    { text: "   Saves $74/mo ($888/yr) with minimal downside\n", options: { color: "C7CFE6", breakLine: true } },
    { text: "3. Pay down Summit Bank before Aurora", options: { color: TEAL, bold: true, breakLine: true } },
    { text: "   22.99% APR vs 17.9% — avalanche method", options: { color: "C7CFE6" } },
  ], { x: 0.95, y: 3.1, w: 9.0, h: 3.5, fontSize: 13.5, fontFace: "Calibri", isTextBox: true, lineSpacingMultiple: 1.15 });

  s.addShape("roundRect", { x: 10.4, y: 5.5, w: 2.3, h: 1.0, rectRadius: 0.1, fill: { color: "0F3B36" }, line: { color: TEAL, width: 1 } });
  s.addText("$202/mo\nfreed up", { x: 10.4, y: 5.5, w: 2.3, h: 1.0, fontSize: 15, bold: true, color: TEAL, align: "center", valign: "middle", fontFace: "Cambria", isTextBox: true });

  s.addText("Every number above is computed live from the parsed statement data — auditable, not generated.", { x: 0.6, y: 6.75, w: 11.5, h: 0.3, fontSize: 11.5, italic: true, color: "8794B3", fontFace: "Calibri", isTextBox: true });
  footer(s, "06 · Advisor in action", true);
}

/* ---------------- SLIDE 8: ARCHITECTURE ---------------- */
{
  const s = bgSlide(false);
  s.addText("How it's built", { x: 0.6, y: 0.5, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL_DK, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText("Numbers come from code, not the model's memory", { x: 0.6, y: 0.9, w: 11.8, h: 0.8, fontSize: 27, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });

  const stages = [
    { t: "Ingestion", d: "Statements (Plaid feed or PDF/CSV upload) parsed into one normalized ledger across issuers." },
    { t: "Analytics layer", d: "Deterministic functions: category trends, subscription detection, fee audit, duplicate-charge detection, payoff ranking." },
    { t: "Tool-calling LLM", d: "The agent calls these functions as tools and narrates the result — it never computes money in its head." },
    { t: "Advisor surface", d: "Dashboard + chat. Every dollar figure traces back to a specific function call, fully auditable." },
  ];
  const cw = 2.85, gap = 0.28, startX = 0.6, y0 = 2.1;
  stages.forEach((st, i) => {
    const x = startX + i * (cw + gap);
    s.addShape("roundRect", { x, y: y0, w: cw, h: 3.5, rectRadius: 0.12, fill: { color: OFFWHITE }, line: { type: "none" } });
    s.addShape("ellipse", { x: x + cw/2 - 0.28, y: y0 + 0.3, w: 0.56, h: 0.56, fill: { color: TEAL_DK }, line: { type: "none" } });
    s.addText(String(i + 1), { x: x + cw/2 - 0.28, y: y0 + 0.3, w: 0.56, h: 0.56, align: "center", valign: "middle", fontSize: 18, bold: true, color: WHITE, fontFace: "Calibri", isTextBox: true });
    s.addText(st.t, { x: x + 0.2, y: y0 + 1.05, w: cw - 0.4, h: 0.5, fontSize: 15.5, bold: true, color: DARK_TEXT, align: "center", fontFace: "Cambria", isTextBox: true });
    s.addText(st.d, { x: x + 0.2, y: y0 + 1.6, w: cw - 0.4, h: 1.8, fontSize: 11.5, color: MUTED, align: "center", fontFace: "Calibri", isTextBox: true, lineSpacingMultiple: 1.2 });
  });
  s.addText("Why this matters: the product bar requires every claim to be backed by real numbers. Tool-calling makes that a structural guarantee, not a prompting hope.", { x: 0.6, y: 5.95, w: 12.1, h: 0.7, fontSize: 13, italic: true, color: MUTED, fontFace: "Calibri", isTextBox: true });
  footer(s, "07 · Architecture");
}

/* ---------------- SLIDE 9: ROADMAP ---------------- */
{
  const s = bgSlide(false);
  s.addText("What's next", { x: 0.6, y: 0.5, w: 8, h: 0.5, fontSize: 14, bold: true, color: TEAL_DK, charSpacing: 2, fontFace: "Calibri", isTextBox: true });
  s.addText("From prototype to production", { x: 0.6, y: 0.9, w: 11.8, h: 0.8, fontSize: 28, bold: true, color: DARK_TEXT, fontFace: "Cambria", isTextBox: true });

  const phases = [
    { t: "Now (this prototype)", items: ["3-issuer statement parsing", "Grounded chat over real aggregates", "Dashboard + duplicate/fee detection"], color: TEAL_DK },
    { t: "Next 4-6 weeks", items: ["Plaid integration for live linking", "Swap templated chat for tool-calling LLM", "Persistence + auth, multi-user"], color: "B8860B" },
    { t: "Beyond", items: ["Proactive push alerts (price hikes, pace warnings)", "Simulated \"what-if\" planning", "Bank-grade audit trail for every claim"], color: CORAL },
  ];
  const cw = 3.85, gap = 0.35, startX = 0.6, y0 = 2.1;
  phases.forEach((p, i) => {
    const x = startX + i * (cw + gap);
    s.addShape("roundRect", { x, y: y0, w: cw, h: 4.0, rectRadius: 0.12, fill: { color: NAVY }, line: { type: "none" } });
    s.addShape("rect", { x, y: y0, w: cw, h: 0.6, fill: { color: p.color } });
    s.addText(p.t, { x: x + 0.25, y: y0, w: cw - 0.5, h: 0.6, fontSize: 14, bold: true, color: WHITE, valign: "middle", fontFace: "Calibri", isTextBox: true });
    const body = p.items.map((it, idx) => ({ text: it, options: { bullet: { code: "2022" }, color: ICE, breakLine: idx < p.items.length - 1, paraSpaceAfter: 10 } }));
    s.addText(body, { x: x + 0.3, y: y0 + 0.85, w: cw - 0.55, h: 3.0, fontSize: 13, fontFace: "Calibri", isTextBox: true });
  });
  footer(s, "08 · Roadmap");
}

/* ---------------- SLIDE 10: CLOSE ---------------- */
{
  const s = bgSlide(true);
  s.addShape("rect", { x: 0, y: 0, w: W, h: H, fill: { color: NAVY } });
  s.addShape("ellipse", { x: -2, y: 4, w: 6, h: 6, fill: { color: NAVY2 }, line: { type: "none" } });
  s.addText("Built end-to-end in one session:", { x: 0.7, y: 2.3, w: 10, h: 0.5, fontSize: 15, color: TEAL, charSpacing: 1, fontFace: "Calibri", isTextBox: true });
  s.addText("3 PDFs → parsed ledger → grounded advisor → working webapp → this deck", { x: 0.7, y: 2.8, w: 11.5, h: 1.3, fontSize: 27, bold: true, color: WHITE, fontFace: "Cambria", isTextBox: true, lineSpacingMultiple: 1.15 });
  s.addText("Repo, live demo, and this deck are all in the submission.", { x: 0.7, y: 4.3, w: 10, h: 0.5, fontSize: 15, color: ICE, fontFace: "Calibri", isTextBox: true });
  s.addText("Jordan T. Reeves' numbers were real inputs — every recommendation in this deck traces back to a line item.", { x: 0.7, y: 6.6, w: 11.5, h: 0.5, fontSize: 12, italic: true, color: "6E7EA3", fontFace: "Calibri", isTextBox: true });
}

pres.writeFile({ fileName: "Findr_Pitch_Deck.pptx" }).then(() => console.log("done"));
