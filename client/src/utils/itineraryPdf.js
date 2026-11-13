// Generates a clean, branded, printable document for an AI-generated itinerary
// and opens the browser's print dialog (users can "Save as PDF").
// Dependency-free: builds a standalone HTML document in a new window so the
// exported page contains only the itinerary — not the app's nav/footer chrome.

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const renderSlot = (label, slots = []) => {
  if (!slots.length) return '';
  const items = slots
    .map(
      (s) => `
      <div class="slot-item">
        <div class="slot-time">${escapeHtml(s.time || '')}</div>
        <div class="slot-title">${escapeHtml(s.title || '')}</div>
        <div class="slot-desc">${escapeHtml(s.description || '')}</div>
        ${s.insiderTip ? `<div class="slot-tip">💡 ${escapeHtml(s.insiderTip)}</div>` : ''}
      </div>`
    )
    .join('');
  return `
    <div class="slot">
      <div class="slot-label">${escapeHtml(label)}</div>
      ${items}
    </div>`;
};

const renderDay = (day) => `
  <section class="day">
    <div class="day-head">
      <h3>${escapeHtml(day.theme || `Day ${day.day}`)}</h3>
      <span class="day-cost">Daily Estimate: ${inr(day.dailyEstimatedCost)}</span>
    </div>
    <div class="slots">
      ${renderSlot('☀️ Morning', day.morning)}
      ${renderSlot('🍽️ Afternoon', day.afternoon)}
      ${renderSlot('🌇 Evening', day.evening)}
    </div>
    ${
      day.mealsSuggestion
        ? `<div class="meals">
             <strong>Curated Culinary Stops:</strong>
             Breakfast — ${escapeHtml(day.mealsSuggestion.breakfast || '')} ·
             Lunch — ${escapeHtml(day.mealsSuggestion.lunch || '')} ·
             Dinner — ${escapeHtml(day.mealsSuggestion.dinner || '')}
           </div>`
        : ''
    }
  </section>`;

const buildHtml = (itin) => {
  const cb = itin.costBreakdown || {};
  const daysHtml = (itin.days || []).map(renderDay).join('');
  const packing = (itin.packingChecklist || [])
    .map((p) => `<li>${escapeHtml(p)}</li>`)
    .join('');
  const tips = (itin.localTips || [])
    .map((t) => `<li>${escapeHtml(t)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(itin.title || 'Bharat Yatra Itinerary')}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; color: #29445A; margin: 0; padding: 32px; }
  .brand { display:flex; align-items:center; gap:10px; border-bottom:3px solid #F28C45; padding-bottom:14px; margin-bottom:18px; }
  .brand .mark { width:34px; height:34px; border-radius:9px; background:linear-gradient(135deg,#F28C45,#FFB36B); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; }
  .brand h1 { font-size:20px; margin:0; letter-spacing:-0.5px; color:#123B5D; }
  .brand span { color:#F28C45; font-weight:700; }
  h2.title { font-size:22px; margin:4px 0 2px; color:#123B5D; }
  .meta { color:#718096; font-size:12px; margin-bottom:18px; }
  .cost { background:#123B5D; color:#fff; border-radius:14px; padding:16px 18px; margin-bottom:20px; }
  .cost .total { font-size:26px; font-weight:800; color:#FFB36B; }
  .cost .grid { display:flex; flex-wrap:wrap; gap:10px; margin-top:12px; }
  .cost .cell { background:rgba(255,255,255,.1); border:1px solid rgba(255,179,107,.3); border-radius:10px; padding:8px 12px; font-size:12px; }
  .cost .cell b { display:block; color:#FFB36B; font-size:14px; margin-top:2px; }
  section.day { border:1px solid #E5EAF0; border-radius:14px; padding:14px 16px; margin-bottom:14px; page-break-inside: avoid; }
  .day-head { display:flex; justify-content:space-between; align-items:baseline; gap:12px; border-bottom:1px solid #E5EAF0; padding-bottom:8px; margin-bottom:10px; }
  .day-head h3 { font-size:15px; margin:0; color:#123B5D; }
  .day-cost { font-size:12px; font-weight:700; color:#F28C45; white-space:nowrap; }
  .slots { display:flex; flex-wrap:wrap; gap:12px; }
  .slot { flex:1; min-width:200px; }
  .slot-label { font-size:11px; font-weight:800; text-transform:uppercase; color:#123B5D; margin-bottom:6px; letter-spacing:.5px; }
  .slot-time { font-size:11px; color:#718096; font-family:monospace; }
  .slot-title { font-size:13px; font-weight:700; margin:2px 0; color:#123B5D; }
  .slot-desc { font-size:12px; color:#29445A; line-height:1.45; }
  .slot-tip { font-size:11px; background:#EAF4FA; border:1px solid #123B5D; border-radius:8px; padding:5px 8px; margin-top:5px; color:#123B5D; }
  .meals { font-size:12px; background:#EAF4FA; border:1px solid #E5EAF0; border-radius:10px; padding:8px 12px; margin-top:10px; color:#29445A; }
  .cols { display:flex; gap:16px; margin-top:8px; }
  .cols > div { flex:1; }
  .cols h4 { font-size:13px; margin:0 0 6px; color:#123B5D; }
  .cols ul { margin:0; padding-left:18px; font-size:12px; color:#29445A; line-height:1.6; }
  .foot { margin-top:24px; border-top:1px solid #E5EAF0; padding-top:10px; font-size:10px; color:#718096; text-align:center; }
  @media print { body { padding:14px; } @page { margin:14mm; } }
</style>
</head>
<body>
  <div class="brand">
    <div class="mark">BY</div>
    <h1>BHARAT <span>YATRA</span></h1>
  </div>

  <h2 class="title">${escapeHtml(itin.title || 'Personalized India Itinerary')}</h2>
  <div class="meta">
    ${escapeHtml(itin.destination || '')} • ${itin.durationDays || (itin.days || []).length} Days •
    ${escapeHtml(itin.travelerType || '')} • ${escapeHtml(itin.travelStyle || '')} Style
  </div>

  <div class="cost">
    <div>Total Estimated Expenses</div>
    <div class="total">${inr(itin.totalEstimatedCost)}</div>
    <div class="grid">
      <div class="cell">Stay & Hotels <b>${inr(cb.stay)}</b></div>
      <div class="cell">Travel <b>${inr(cb.travel)}</b></div>
      <div class="cell">Meals & Dining <b>${inr(cb.food)}</b></div>
      <div class="cell">Tickets & Entry <b>${inr(cb.ticketsAndActivities)}</b></div>
      <div class="cell">Shopping & Buffer <b>${inr(cb.shoppingAndBuffer)}</b></div>
    </div>
  </div>

  ${daysHtml}

  <div class="cols">
    <div>
      <h4>🎒 Smart Packing Checklist</h4>
      <ul>${packing}</ul>
    </div>
    <div>
      <h4>🛡️ Local Etiquette & Safety Tips</h4>
      <ul>${tips}</ul>
    </div>
  </div>

  <div class="foot">
    Generated by Bharat Yatra — AI Trip Planner · ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
  </div>
</body>
</html>`;
};

export const downloadItineraryPDF = (itinerary) => {
  if (!itinerary) return;
  const html = buildHtml(itinerary);
  const printWindow = window.open('', '_blank', 'width=900,height=650');

  if (!printWindow) {
    // Popup blocked — fall back to printing the current page.
    window.print();
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();

  // Give the new document a tick to render before invoking print.
  setTimeout(() => {
    printWindow.print();
  }, 350);
};
