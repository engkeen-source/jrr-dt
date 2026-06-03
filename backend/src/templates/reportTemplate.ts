import { ReportData } from "../services/aiService";
import { AssessmentInput } from "../prompts/reportPrompt";

interface Grant {
  name: string;
  scope: string;
  quantum: string;
  eligibility: string;
  url: string;
}

export interface ReportSegment {
  footerLabel: string | null;
  bodyHtml: string;
}

function esc(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2p(text: string): string {
  return text
    .split(/\n\n+/)
    .map((p) => `<p>${esc(p.trim())}</p>`)
    .join("");
}

function disruptionColor(score: number): string {
  if (score >= 80) return "#ef4444";
  if (score >= 56) return "#f97316";
  if (score >= 31) return "#eab308";
  return "#22c55e";
}

function disruptionBadgeColor(classification: string): string {
  switch (classification) {
    case "Critical": return "background:#ef4444;color:#fff";
    case "High Risk": return "background:#f97316;color:#fff";
    case "Moderate": return "background:#eab308;color:#000";
    default: return "background:#22c55e;color:#000";
  }
}

function priorityBadge(priority: string): string {
  const styles: Record<string, string> = {
    High: "background:#ef4444;color:#fff",
    Medium: "background:#f97316;color:#fff",
    Low: "background:#22c55e;color:#000",
  };
  return styles[priority] || styles["Medium"];
}

function likelihoodImpactBadge(value: string): string {
  const styles: Record<string, string> = {
    High: "background:#ef4444;color:#fff",
    Medium: "background:#f97316;color:#fff",
    Low: "background:#22c55e;color:#000",
  };
  return styles[value] || styles["Medium"];
}

const SHARED_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #1a1a2e;
    background: #ffffff;
    font-size: 10pt;
    line-height: 1.6;
  }

  /* ─── PAGE BREAKS ─────────────────────────────── */
  .page-break { page-break-after: always; break-after: always; }
  .no-break { page-break-inside: avoid; break-inside: avoid; }

  /* ─── COVER PAGE ──────────────────────────────── */
  .cover {
    width: 100%;
    min-height: 297mm;
    margin-top: -20px;
    background: linear-gradient(160deg, #050917 0%, #0d1b4b 45%, #0a2468 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
    position: relative;
    overflow: hidden;
  }
  .cover-bg-pattern {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(circle at 20% 30%, rgba(37,99,235,0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(124,58,237,0.1) 0%, transparent 50%);
    z-index: 0;
  }
  .cover-grid {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: linear-gradient(rgba(37,99,235,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(37,99,235,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 0;
  }
  .cover-top {
    padding: 48px 56px 0;
    position: relative; z-index: 1;
  }
  .cover-tag {
    display: inline-block;
    background: rgba(37,99,235,0.3);
    border: 1px solid rgba(37,99,235,0.5);
    color: #93c5fd;
    font-size: 8pt;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 20px;
    margin-bottom: 48px;
  }
  .cover-company {
    font-size: 38pt;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 16px;
  }
  .cover-report-title {
    font-size: 13pt;
    color: #93c5fd;
    font-weight: 400;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 48px;
  }
  .cover-divider {
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    border-radius: 2px;
    margin-bottom: 40px;
  }
  .cover-metrics {
    display: flex;
    gap: 32px;
    margin-bottom: 0;
  }
  .cover-metric {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 20px 24px;
    text-align: center;
    min-width: 120px;
  }
  .cover-metric-value {
    font-size: 22pt;
    font-weight: 800;
    color: #ffffff;
    display: block;
  }
  .cover-metric-label {
    font-size: 8pt;
    color: #93c5fd;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
    display: block;
  }
  .cover-middle {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 56px;
    position: relative; z-index: 1;
  }
  .cover-sections-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 100%;
    margin-top: 48px;
  }
  .cover-section-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 12px 16px;
  }
  .cover-section-num {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    font-size: 8pt;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .cover-section-text {
    color: #cbd5e1;
    font-size: 9pt;
    font-weight: 500;
  }
  .cover-bottom {
    padding: 40px 56px;
    position: relative; z-index: 1;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .cover-bottom-left { }
  .cover-org {
    color: #93c5fd;
    font-size: 9pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .cover-website {
    color: #475569;
    font-size: 8pt;
  }
  .cover-bottom-right {
    text-align: right;
  }
  .cover-date-label {
    color: #475569;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .cover-date {
    color: #94a3b8;
    font-size: 9pt;
    font-weight: 600;
    margin-top: 2px;
  }
  .cover-confidential {
    color: #334155;
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 8px;
  }

  /* ─── SECTION PAGES ───────────────────────────── */
  .section-page {
    padding: 40px 56px;
  }

  /* Section header bar */
  .section-header {
    background: linear-gradient(135deg, #050917 0%, #0d1b4b 100%);
    margin: -40px -56px 40px;
    padding: 36px 56px;
    position: relative;
    overflow: hidden;
  }
  .section-header::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: radial-gradient(circle at 90% 50%, rgba(37,99,235,0.15) 0%, transparent 60%);
  }
  .section-number {
    font-size: 7pt;
    font-weight: 700;
    color: #2563eb;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 8px;
    position: relative; z-index: 1;
  }
  .section-title {
    font-size: 20pt;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.5px;
    position: relative; z-index: 1;
    line-height: 1.2;
  }
  .section-subtitle {
    font-size: 9pt;
    color: #93c5fd;
    margin-top: 6px;
    font-weight: 400;
    position: relative; z-index: 1;
  }
  .section-header-accent {
    position: absolute;
    right: 56px; top: 50%;
    transform: translateY(-50%);
    font-size: 72pt;
    font-weight: 900;
    color: rgba(37,99,235,0.08);
    z-index: 0;
    line-height: 1;
  }

  /* ─── TOC PAGE ────────────────────────────────── */
  .toc-page {
    padding: 40px 56px;
  }
  .toc-header {
    background: linear-gradient(135deg, #050917 0%, #0d1b4b 100%);
    margin: -40px -56px 40px;
    padding: 36px 56px;
  }
  .toc-item {
    display: flex;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid #f1f5f9;
  }
  .toc-item:last-child { border-bottom: none; }
  .toc-num {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    font-size: 9pt;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-right: 16px;
  }
  .toc-name {
    font-size: 11pt;
    font-weight: 600;
    color: #1e293b;
    flex: 1;
  }
  .toc-desc {
    font-size: 8.5pt;
    color: #64748b;
    font-weight: 400;
    display: block;
    margin-top: 2px;
  }

  /* ─── EXECUTIVE SUMMARY ───────────────────────── */
  .exec-summary-box {
    background: linear-gradient(135deg, #eff6ff, #f0fdf4);
    border-left: 4px solid #2563eb;
    border-radius: 0 12px 12px 0;
    padding: 28px 32px;
    margin-bottom: 32px;
  }

  /* Key stat cards */
  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: linear-gradient(135deg, #050917, #0d1b4b);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
  }
  .stat-value {
    font-size: 22pt;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }
  .stat-value.orange { color: #fb923c; }
  .stat-value.red { color: #f87171; }
  .stat-value.green { color: #4ade80; }
  .stat-value.blue { color: #60a5fa; }
  .stat-label {
    font-size: 7.5pt;
    color: #93c5fd;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 6px;
  }

  /* ─── CONTENT TYPOGRAPHY ──────────────────────── */
  .content-text p {
    color: #374151;
    font-size: 10pt;
    line-height: 1.75;
    margin-bottom: 14px;
  }
  .content-text p:last-child { margin-bottom: 0; }

  h3.sub-heading {
    font-size: 12pt;
    font-weight: 700;
    color: #0f172a;
    margin: 28px 0 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e2e8f0;
    break-after: avoid;
    page-break-after: avoid;
  }
  h3.sub-heading:first-child { margin-top: 0; }

  .callout-box {
    background: #fffbeb;
    border: 1px solid #fbbf24;
    border-left: 4px solid #f59e0b;
    border-radius: 0 8px 8px 0;
    padding: 16px 20px;
    margin: 20px 0;
    color: #78350f;
    font-size: 9.5pt;
    font-weight: 500;
    font-style: italic;
  }

  .info-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-left: 4px solid #2563eb;
    border-radius: 0 8px 8px 0;
    padding: 16px 20px;
    margin: 20px 0;
  }
  .info-box p {
    color: #1e40af;
    font-size: 9.5pt;
    line-height: 1.6;
    margin: 0;
  }

  /* ─── CARDS & GRIDS ───────────────────────────── */
  .card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 14px;
    page-break-inside: avoid;
  }
  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 10px;
  }
  .card-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    font-size: 14pt;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .card-title {
    font-size: 10.5pt;
    font-weight: 700;
    color: #0f172a;
    flex: 1;
  }
  .badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 7.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .card-body {
    color: #4b5563;
    font-size: 9.5pt;
    line-height: 1.65;
  }

  .two-col-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* ─── RISK MATRIX ─────────────────────────────── */
  .risk-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  .risk-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .risk-title {
    font-size: 10pt;
    font-weight: 700;
    color: #0f172a;
  }
  .risk-badges {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }
  .risk-timeframe {
    font-size: 8pt;
    color: #64748b;
    margin-top: 6px;
  }

  /* ─── ROLE DISRUPTION TABLE ───────────────────── */
  .roles-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .roles-table th {
    background: linear-gradient(135deg, #050917, #0d1b4b);
    color: #93c5fd;
    font-size: 8pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 12px 14px;
    text-align: left;
  }
  .roles-table th:last-child { text-align: center; }
  .roles-table td {
    padding: 11px 14px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
  }
  .roles-table tr:last-child td { border-bottom: none; }
  .roles-table tr:nth-child(even) td { background: #f8fafc; }
  .role-name {
    font-size: 9.5pt;
    font-weight: 600;
    color: #0f172a;
  }
  .role-function {
    font-size: 8pt;
    color: #64748b;
    margin-top: 2px;
  }
  .disruption-bar-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 160px;
  }
  .disruption-bar-bg {
    flex: 1;
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }
  .disruption-bar-fill {
    height: 100%;
    border-radius: 4px;
  }
  .disruption-pct {
    font-size: 9pt;
    font-weight: 700;
    color: #0f172a;
    min-width: 32px;
    text-align: right;
  }
  .ai-impact-text {
    font-size: 8pt;
    color: #64748b;
  }

  /* ─── EMERGING ROLES ──────────────────────────── */
  .emerging-card {
    background: linear-gradient(135deg, #f0fdf4, #eff6ff);
    border: 1px solid #bbf7d0;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 14px;
    page-break-inside: avoid;
  }
  .emerging-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  .emerging-title {
    font-size: 11pt;
    font-weight: 700;
    color: #065f46;
  }
  .emerging-timeline {
    font-size: 8pt;
    font-weight: 600;
    color: #059669;
    background: #d1fae5;
    padding: 3px 10px;
    border-radius: 12px;
    flex-shrink: 0;
  }
  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 10px;
  }
  .skill-tag {
    background: #dbeafe;
    color: #1e40af;
    font-size: 8pt;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 12px;
  }

  /* ─── GRANTS TABLE ────────────────────────────── */
  .grants-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .grants-table th {
    background: linear-gradient(135deg, #050917, #0d1b4b);
    color: #93c5fd;
    font-size: 8pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 12px 14px;
    text-align: left;
  }
  .grants-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
    font-size: 9pt;
  }
  .grants-table tr:last-child td { border-bottom: none; }
  .grants-table tr:nth-child(even) td { background: #f8fafc; }
  .grant-name {
    font-weight: 700;
    color: #0f172a;
    font-size: 9.5pt;
    margin-bottom: 3px;
  }
  .grant-eligibility {
    font-size: 8pt;
    color: #64748b;
  }
  .grant-quantum {
    font-weight: 700;
    color: #059669;
    font-size: 9.5pt;
  }

  /* ─── ROI SECTION ─────────────────────────────── */
  .roi-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 24px 0;
  }
  .roi-box {
    border-radius: 12px;
    padding: 20px 24px;
    text-align: center;
  }
  .roi-box.dark {
    background: linear-gradient(135deg, #050917, #0d1b4b);
  }
  .roi-box.green {
    background: linear-gradient(135deg, #065f46, #047857);
  }
  .roi-box-label {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #93c5fd;
    margin-bottom: 8px;
  }
  .roi-box.green .roi-box-label { color: #a7f3d0; }
  .roi-box-value {
    font-size: 18pt;
    font-weight: 800;
    color: #ffffff;
    line-height: 1;
  }
  .roi-box-sub {
    font-size: 8pt;
    color: #64748b;
    margin-top: 4px;
  }
  .roi-box.dark .roi-box-sub { color: #475569; }
  .roi-box.green .roi-box-sub { color: #6ee7b7; }

  .benefits-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  .benefits-table th {
    background: #f8fafc;
    color: #475569;
    font-size: 8pt;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px 14px;
    text-align: left;
    border-bottom: 2px solid #e2e8f0;
  }
  .benefits-table td {
    padding: 11px 14px;
    border-bottom: 1px solid #f1f5f9;
    font-size: 9pt;
    vertical-align: top;
  }
  .benefits-table tr:last-child td { border-bottom: none; }

  /* ─── NEXT STEPS ──────────────────────────────── */
  .phase-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 14px;
    break-after: avoid;
    page-break-after: avoid;
  }
  .phase-badge {
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .phase-badge.immediate { background: #fee2e2; color: #991b1b; }
  .phase-badge.short { background: #fef3c7; color: #92400e; }
  .phase-badge.long { background: #dbeafe; color: #1e40af; }
  .phase-title {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
  }

  .action-item {
    display: flex;
    gap: 14px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 14px 18px;
    margin-bottom: 10px;
    page-break-inside: avoid;
  }
  .action-number {
    width: 28px; height: 28px;
    border-radius: 50%;
    font-size: 9pt;
    font-weight: 700;
    color: white;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .action-number.red { background: #ef4444; }
  .action-number.orange { background: #f97316; }
  .action-number.blue { background: #2563eb; }
  .action-body { flex: 1; }
  .action-title {
    font-size: 10pt;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 4px;
  }
  .action-desc {
    font-size: 9pt;
    color: #4b5563;
    line-height: 1.6;
    margin-bottom: 6px;
  }
  .action-meta {
    display: flex;
    gap: 14px;
  }
  .action-meta-item {
    font-size: 8pt;
    color: #64748b;
  }
  .action-meta-item strong { color: #374151; }

  .closing-box {
    background: linear-gradient(135deg, #050917 0%, #0d1b4b 100%);
    border-radius: 16px;
    padding: 36px 40px;
    margin-top: 32px;
  }
  .closing-box p {
    color: #cbd5e1;
    font-size: 10pt;
    line-height: 1.8;
    margin-bottom: 14px;
  }
  .closing-box p:last-child { margin-bottom: 0; }
  .closing-cta {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: #93c5fd;
    font-size: 9pt;
    font-weight: 500;
    text-align: center;
  }

  /* ─── JOB REDESIGN ────────────────────────────── */
  .redesign-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  .redesign-card-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
  .redesign-role-box {
    padding: 12px 16px;
  }
  .redesign-role-label {
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #94a3b8;
    margin-bottom: 4px;
  }
  .redesign-role-name {
    font-size: 10pt;
    font-weight: 700;
    color: #0f172a;
  }
  .redesign-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    color: #2563eb;
    font-size: 16pt;
    font-weight: 300;
  }
  .redesign-role-box.new .redesign-role-label { color: #059669; }
  .redesign-role-box.new .redesign-role-name { color: #065f46; }
  .redesign-body {
    padding: 14px 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .redesign-detail-label {
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #94a3b8;
    margin-bottom: 4px;
  }
  .redesign-detail-value {
    font-size: 9pt;
    color: #374151;
    line-height: 1.5;
  }

  /* ─── TREND PILLS ─────────────────────────────── */
  .trend-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  .trend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .trend-title {
    font-size: 10pt;
    font-weight: 700;
    color: #0f172a;
  }
  .trend-timeframe {
    font-size: 8pt;
    background: #dbeafe;
    color: #1e40af;
    padding: 3px 10px;
    border-radius: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }
  .trend-desc {
    font-size: 9.5pt;
    color: #4b5563;
    line-height: 1.6;
  }
`;

export function wrapDocument(bodyHtml: string, title = "AI Readiness Assessment"): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<style>${SHARED_STYLE}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

export function buildReportSegments(
  input: AssessmentInput,
  report: ReportData,
  grants: Grant[]
): ReportSegment[] {
  const totalStaff = input.staffStrength;
  const avgDisruption =
    report.roleDisruption.length > 0
      ? Math.round(
          report.roleDisruption.reduce((a, r) => a + r.disruptionScore, 0) /
            report.roleDisruption.length
        )
      : 0;
  const criticalRoles = report.roleDisruption.filter((r) => r.disruptionScore >= 80).length;
  const highRoles = report.roleDisruption.filter(
    (r) => r.disruptionScore >= 56 && r.disruptionScore < 80
  ).length;
  const generatedDate = new Date().toLocaleDateString("en-SG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── COVER ──────────────────────────────────────────────────────────────
  const coverHtml = `
<div class="cover">
  <div class="cover-bg-pattern"></div>
  <div class="cover-grid"></div>

  <div class="cover-top">
    <div class="cover-tag">Confidential · AI Readiness Assessment</div>
    <div class="cover-company">${esc(input.companyName)}</div>
    <div class="cover-report-title">Workforce &amp; Business Transformation Report</div>
    <div class="cover-divider"></div>
    <div class="cover-metrics">
      <div class="cover-metric">
        <span class="cover-metric-value">${totalStaff}</span>
        <span class="cover-metric-label">Total Staff</span>
      </div>
      <div class="cover-metric">
        <span class="cover-metric-value">${input.pmetCount}</span>
        <span class="cover-metric-label">Local PMET</span>
      </div>
      <div class="cover-metric">
        <span class="cover-metric-value">${input.staffStrength > 0 ? Math.round((input.pmetCount / input.staffStrength) * 100) : 0}%</span>
        <span class="cover-metric-label">PMET Ratio</span>
      </div>
      <div class="cover-metric">
        <span class="cover-metric-value">${avgDisruption}%</span>
        <span class="cover-metric-label">Avg Disruption</span>
      </div>
    </div>
  </div>

  <div style="padding: 0 56px; position: relative; z-index: 1;">
    <div class="cover-sections-grid">
      ${[
        "Business Climate &amp; AI Outlook",
        "Disruption Landscape & Risk Analysis",
        "Risk Management & Job Redesign",
        "Top 15 Roles — AI Disruption Index",
        "Emerging Roles & Opportunities",
        "Singapore Grants Available",
        "Business & Workforce ROI Projection",
        "Next Steps & Action Plan",
      ]
        .map(
          (s, i) =>
            `<div class="cover-section-item">
          <div class="cover-section-num">${i + 1}</div>
          <div class="cover-section-text">${esc(s)}</div>
        </div>`
        )
        .join("")}
    </div>
  </div>

  <div class="cover-bottom">
    <div class="cover-bottom-left">
      <div class="cover-org">Workforce Alliance Foundation</div>
      <div class="cover-website">waf.org.sg</div>
    </div>
    <div class="cover-bottom-right">
      <div class="cover-date-label">Report generated</div>
      <div class="cover-date">${generatedDate}</div>
      <div class="cover-confidential">Prepared for ${esc(input.contactName)}</div>
    </div>
  </div>
</div>`;

  // ── EXECUTIVE SUMMARY ──────────────────────────────────────────────────
  const execSummaryHtml = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Executive Summary</div>
    <div class="section-title">Your AI Readiness at a Glance</div>
    <div class="section-subtitle">A strategic overview prepared for ${esc(input.contactName)} · ${esc(input.companyName)}</div>
    <div class="section-header-accent">ES</div>
  </div>

  <div class="stats-row">
    <div class="stat-card">
      <div class="stat-value blue">${totalStaff}</div>
      <div class="stat-label">Total Workforce</div>
    </div>
    <div class="stat-card">
      <div class="stat-value ${avgDisruption >= 60 ? "red" : avgDisruption >= 40 ? "orange" : "green"}">${avgDisruption}%</div>
      <div class="stat-label">Avg AI Disruption</div>
    </div>
    <div class="stat-card">
      <div class="stat-value red">${criticalRoles}</div>
      <div class="stat-label">Critical Roles</div>
    </div>
    <div class="stat-card">
      <div class="stat-value orange">${highRoles}</div>
      <div class="stat-label">High-Risk Roles</div>
    </div>
  </div>

  <div class="exec-summary-box">
    <div class="content-text">${nl2p(report.executiveSummary)}</div>
  </div>
</div>`;

  // ── SECTION 01 ─────────────────────────────────────────────────────────
  const section01Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 01</div>
    <div class="section-title">Business Climate</div>
    <div class="section-subtitle">Macro trends &amp; competitive dynamics reshaping ${esc(input.industry)} in Singapore</div>
    <div class="section-header-accent">01</div>
  </div>

  <h3 class="sub-heading">Overview</h3>
  <div class="content-text">${nl2p(report.businessClimate.overview)}</div>

  <h3 class="sub-heading">Key AI Trends to Watch</h3>
  ${report.businessClimate.keyTrends
    .map(
      (t) => `
  <div class="trend-card">
    <div class="trend-header">
      <div class="trend-title">${esc(t.trend)}</div>
      <div class="trend-timeframe">${esc(t.timeframe)}</div>
    </div>
    <div class="trend-desc">${esc(t.description)}</div>
  </div>`
    )
    .join("")}

  <h3 class="sub-heading">Competitive Landscape</h3>
  <div class="content-text">${nl2p(report.businessClimate.competitiveLandscape)}</div>

  <div class="callout-box">${esc(report.businessClimate.urgencyStatement)}</div>
</div>`;

  // ── SECTION 02 ─────────────────────────────────────────────────────────
  const section02Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 02</div>
    <div class="section-title">Disruption Landscape</div>
    <div class="section-subtitle">How AI will reshape ${esc(input.companyName)} — risks &amp; opportunities</div>
    <div class="section-header-accent">02</div>
  </div>

  <div class="content-text">${nl2p(report.disruptionLandscape.overview)}</div>

  <h3 class="sub-heading">Risk Matrix</h3>
  ${report.disruptionLandscape.risks
    .map(
      (r) => `
  <div class="risk-card">
    <div class="risk-card-header">
      <div class="risk-title">${esc(r.risk)}</div>
      <div class="risk-badges">
        <span class="badge" style="${likelihoodImpactBadge(r.likelihood)}">Likelihood: ${esc(r.likelihood)}</span>
        <span class="badge" style="${likelihoodImpactBadge(r.impact)}">Impact: ${esc(r.impact)}</span>
      </div>
    </div>
    <div class="card-body">${esc(r.description)}</div>
    <div class="risk-timeframe">Timeframe: ${esc(r.timeframe)}</div>
  </div>`
    )
    .join("")}

  <h3 class="sub-heading">Opportunities to Capitalise On</h3>
  <div class="two-col-grid">
    ${report.disruptionLandscape.opportunities
      .map(
        (o, i) => `
    <div class="card">
      <div class="card-header">
        <div class="card-icon">${i + 1}</div>
        <div class="card-title">${esc(o.opportunity)}</div>
      </div>
      <div class="card-body">${esc(o.description)}</div>
    </div>`
      )
      .join("")}
  </div>
</div>`;

  // ── SECTION 03 ─────────────────────────────────────────────────────────
  const section03Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 03</div>
    <div class="section-title">Risk Management Roadmap</div>
    <div class="section-subtitle">Strategies to navigate AI disruption — including workforce &amp; job redesign</div>
    <div class="section-header-accent">03</div>
  </div>

  <div class="content-text">${nl2p(report.riskManagement.overview)}</div>

  <h3 class="sub-heading">Key Strategies</h3>
  ${report.riskManagement.strategies
    .map(
      (s) => `
  <div class="card">
    <div class="card-header">
      <div class="card-title">${esc(s.strategy)}</div>
      <span class="badge" style="${priorityBadge(s.priority)}">${esc(s.priority)} Priority</span>
    </div>
    <div class="card-body">${esc(s.description)}</div>
  </div>`
    )
    .join("")}

  <h3 class="sub-heading">Job Redesign Approach</h3>
  <div class="info-box">
    <p>${esc(report.riskManagement.jobRedesignApproach.philosophy)}</p>
  </div>

  ${report.riskManagement.jobRedesignApproach.examples
    .map(
      (ex) => `
  <div class="redesign-card">
    <div class="redesign-card-header">
      <div class="redesign-role-box">
        <div class="redesign-role-label">Current Role</div>
        <div class="redesign-role-name">${esc(ex.currentRole)}</div>
      </div>
      <div class="redesign-arrow">→</div>
      <div class="redesign-role-box new">
        <div class="redesign-role-label">Redesigned Role</div>
        <div class="redesign-role-name">${esc(ex.redesignedRole)}</div>
      </div>
    </div>
    <div class="redesign-body">
      <div>
        <div class="redesign-detail-label">Key Changes</div>
        <div class="redesign-detail-value">${esc(ex.keyChanges)}</div>
      </div>
      <div>
        <div class="redesign-detail-label">Skills Gained</div>
        <div class="redesign-detail-value">${esc(ex.skillsGained)}</div>
      </div>
    </div>
  </div>`
    )
    .join("")}

  <h3 class="sub-heading">Change Management</h3>
  <div class="content-text">${nl2p(report.riskManagement.changeManagement)}</div>
</div>`;

  // ── SECTION 04 ─────────────────────────────────────────────────────────
  const section04Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 04</div>
    <div class="section-title">Top 15 Roles — AI Disruption Index</div>
    <div class="section-subtitle">Degree of AI disruption per role in ${esc(input.industry)} (0 = minimal, 100 = fully automated)</div>
    <div class="section-header-accent">04</div>
  </div>

  <div class="stats-row" style="margin-bottom:24px;">
    <div class="stat-card">
      <div class="stat-value red">${report.roleDisruption.filter((r) => r.classification === "Critical").length}</div>
      <div class="stat-label">Critical (&ge;80%)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value orange">${report.roleDisruption.filter((r) => r.classification === "High Risk").length}</div>
      <div class="stat-label">High Risk (56–79%)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color:#fbbf24;">${report.roleDisruption.filter((r) => r.classification === "Moderate").length}</div>
      <div class="stat-label">Moderate (31–55%)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value green">${report.roleDisruption.filter((r) => r.classification === "Low Risk").length}</div>
      <div class="stat-label">Low Risk (0–30%)</div>
    </div>
  </div>

  <table class="roles-table">
    <thead>
      <tr>
        <th style="width:26%">Role</th>
        <th style="width:28%">AI Disruption</th>
        <th style="width:13%;text-align:center;">Classification</th>
        <th style="width:33%">AI Impact &amp; Rationale</th>
      </tr>
    </thead>
    <tbody>
      ${report.roleDisruption
        .sort((a, b) => b.disruptionScore - a.disruptionScore)
        .map(
          (r) => `
      <tr>
        <td>
          <div class="role-name">${esc(r.role)}</div>
          <div class="role-function">${esc(r.currentFunction)}</div>
        </td>
        <td>
          <div class="disruption-bar-wrap">
            <div class="disruption-bar-bg">
              <div class="disruption-bar-fill" style="width:${r.disruptionScore}%;background:${disruptionColor(r.disruptionScore)};"></div>
            </div>
            <div class="disruption-pct">${r.disruptionScore}%</div>
          </div>
        </td>
        <td style="text-align:center;">
          <span class="badge" style="${disruptionBadgeColor(r.classification)}">${esc(r.classification)}</span>
        </td>
        <td>
          <div class="ai-impact-text">${esc(r.aiImpact)}</div>
        </td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>
</div>`;

  // ── SECTION 05 ─────────────────────────────────────────────────────────
  const section05Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 05</div>
    <div class="section-title">Emerging Roles &amp; Opportunities</div>
    <div class="section-subtitle">New roles being created by AI adoption in ${esc(input.industry)}</div>
    <div class="section-header-accent">05</div>
  </div>

  ${report.emergingRoles
    .map(
      (r) => `
  <div class="emerging-card">
    <div class="emerging-card-header">
      <div class="emerging-title">${esc(r.role)}</div>
      <div class="emerging-timeline">${esc(r.timeline)}</div>
    </div>
    <div class="card-body" style="margin-bottom:8px;">${esc(r.description)}</div>
    <div class="card-body" style="font-size:8.5pt;color:#374151;margin-bottom:4px;"><strong>Why now:</strong> ${esc(r.whyNow)}</div>
    <div class="card-body" style="font-size:8.5pt;color:#374151;margin-bottom:8px;"><strong>Sourcing:</strong> ${esc(r.sourcingStrategy)}</div>
    <div class="skills-list">
      ${r.keySkills.map((s) => `<span class="skill-tag">${esc(s)}</span>`).join("")}
    </div>
  </div>`
    )
    .join("")}
</div>`;

  // ── SECTION 06 ─────────────────────────────────────────────────────────
  const section06Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 06</div>
    <div class="section-title">Grants Available to Support Your Journey</div>
    <div class="section-subtitle">Singapore government funding &amp; support schemes for AI &amp; workforce transformation</div>
    <div class="section-header-accent">06</div>
  </div>

  <div class="info-box" style="margin-bottom:24px;">
    <p>The following grants are available to Singapore-registered SMEs undertaking digital transformation and workforce development. Eligibility criteria apply — we recommend engaging Enterprise Singapore or WSG directly for an assessment.</p>
  </div>

  <table class="grants-table">
    <thead>
      <tr>
        <th style="width:28%">Grant &amp; Eligibility</th>
        <th style="width:30%">Scope</th>
        <th style="width:22%">Quantum / Support</th>
        <th style="width:20%">Administering Body</th>
      </tr>
    </thead>
    <tbody>
      ${grants
        .map(
          (g) => `
      <tr>
        <td>
          <div class="grant-name">${esc(g.name)}</div>
          <div class="grant-eligibility">${esc(g.eligibility)}</div>
        </td>
        <td style="color:#374151;font-size:9pt;">${esc(g.scope)}</td>
        <td><div class="grant-quantum">${esc(g.quantum)}</div></td>
        <td style="color:#64748b;font-size:8.5pt;">${esc(g.url.replace("https://", "").split("/")[0])}</td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <div class="callout-box" style="margin-top:24px;">
    Potential combined grant support for ${esc(input.companyName)}: Speak with a WAF advisor to structure a grant stacking strategy tailored to your transformation roadmap.
  </div>
</div>`;

  // ── SECTION 07 ─────────────────────────────────────────────────────────
  const section07Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 07</div>
    <div class="section-title">Business &amp; Workforce ROI Projection</div>
    <div class="section-subtitle">3-year financial impact of AI adoption for ${esc(input.companyName)}</div>
    <div class="section-header-accent">07</div>
  </div>

  <div class="roi-summary-grid">
    <div class="roi-box dark">
      <div class="roi-box-label">Estimated Investment</div>
      <div class="roi-box-value">${esc(report.roiProjection.threeYearROI.estimatedInvestment)}</div>
      <div class="roi-box-sub">Tech + Training + Consultancy (3 yr)</div>
    </div>
    <div class="roi-box green">
      <div class="roi-box-label">Projected 3-Year Savings</div>
      <div class="roi-box-value">${esc(report.roiProjection.threeYearROI.estimatedSavings)}</div>
      <div class="roi-box-sub">Cumulative savings estimate</div>
    </div>
    <div class="roi-box dark">
      <div class="roi-box-label">Estimated ROI</div>
      <div class="roi-box-value">${esc(report.roiProjection.threeYearROI.estimatedROI)}</div>
      <div class="roi-box-sub">Return on investment</div>
    </div>
    <div class="roi-box dark">
      <div class="roi-box-label">Breakeven Point</div>
      <div class="roi-box-value">${esc(report.roiProjection.threeYearROI.breakevenPoint)}</div>
      <div class="roi-box-sub">Expected payback period</div>
    </div>
  </div>

  <h3 class="sub-heading">Current State Analysis</h3>
  <div class="content-text">${nl2p(report.roiProjection.currentStateAnalysis)}</div>

  <h3 class="sub-heading">Projected Benefits Breakdown</h3>
  <table class="benefits-table">
    <thead>
      <tr>
        <th style="width:22%">Benefit Area</th>
        <th style="width:35%">Description</th>
        <th style="width:22%">Estimated Value</th>
        <th style="width:21%">Time to Realise</th>
      </tr>
    </thead>
    <tbody>
      ${report.roiProjection.projectedBenefits
        .map(
          (b) => `
      <tr>
        <td style="font-weight:600;color:#0f172a;">${esc(b.benefit)}</td>
        <td style="color:#4b5563;">${esc(b.description)}</td>
        <td style="font-weight:700;color:#059669;">${esc(b.estimatedValue)}</td>
        <td style="color:#64748b;">${esc(b.timeToRealize)}</td>
      </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <h3 class="sub-heading">Workforce Productivity Impact</h3>
  <div class="content-text">${nl2p(report.roiProjection.workforceImpact)}</div>

  <div class="info-box">
    <p><strong>Key Assumptions:</strong> ${esc(report.roiProjection.assumptions)}</p>
  </div>
</div>`;

  // ── SECTION 08 ─────────────────────────────────────────────────────────
  const section08Html = `
<div class="section-page">
  <div class="section-header">
    <div class="section-number">Section 08</div>
    <div class="section-title">Next Steps &amp; Action Plan</div>
    <div class="section-subtitle">Your personalised transformation roadmap — from today to 24 months</div>
    <div class="section-header-accent">08</div>
  </div>

  <div class="phase-header">
    <span class="phase-badge immediate">Phase 1</span>
    <span class="phase-title">Immediate Actions — Within 90 Days</span>
  </div>
  ${report.nextSteps.immediate
    .map(
      (a, i) => `
  <div class="action-item">
    <div class="action-number red">${i + 1}</div>
    <div class="action-body">
      <div class="action-title">${esc(a.action)}</div>
      <div class="action-desc">${esc(a.description)}</div>
      <div class="action-meta">
        <div class="action-meta-item"><strong>Owner:</strong> ${esc(a.owner)}</div>
        <div class="action-meta-item"><strong>Timeline:</strong> ${esc(a.timeline)}</div>
      </div>
    </div>
  </div>`
    )
    .join("")}

  <div class="phase-header">
    <span class="phase-badge short">Phase 2</span>
    <span class="phase-title">Short-Term Actions — 3 to 12 Months</span>
  </div>
  ${report.nextSteps.shortTerm
    .map(
      (a, i) => `
  <div class="action-item">
    <div class="action-number orange">${i + 1}</div>
    <div class="action-body">
      <div class="action-title">${esc(a.action)}</div>
      <div class="action-desc">${esc(a.description)}</div>
      <div class="action-meta">
        <div class="action-meta-item"><strong>Owner:</strong> ${esc(a.owner)}</div>
        <div class="action-meta-item"><strong>Timeline:</strong> ${esc(a.timeline)}</div>
      </div>
    </div>
  </div>`
    )
    .join("")}

  <div class="phase-header">
    <span class="phase-badge long">Phase 3</span>
    <span class="phase-title">Long-Term Strategy — 12 to 24 Months</span>
  </div>
  ${report.nextSteps.longTerm
    .map(
      (a, i) => `
  <div class="action-item">
    <div class="action-number blue">${i + 1}</div>
    <div class="action-body">
      <div class="action-title">${esc(a.action)}</div>
      <div class="action-desc">${esc(a.description)}</div>
      <div class="action-meta">
        <div class="action-meta-item"><strong>Owner:</strong> ${esc(a.owner)}</div>
        <div class="action-meta-item"><strong>Timeline:</strong> ${esc(a.timeline)}</div>
      </div>
    </div>
  </div>`
    )
    .join("")}

  <div class="closing-box">
    ${nl2p(report.nextSteps.closingMessage).replace(/<p>/g, '<p style="color:#cbd5e1;font-size:10pt;line-height:1.8;margin-bottom:14px;">').replace(/<\/p>/g, "</p>")}
    <div class="closing-cta">
      Ready to begin your transformation? Contact us at <strong>waf.org.sg</strong> for a complimentary advisory session.
    </div>
  </div>

  <div style="margin-top: 32px; background: linear-gradient(135deg, #80367B 0%, #FF6D2E 100%); border-radius: 12px; padding: 32px; color: white;">
    <div style="font-size: 11pt; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; opacity: 0.9; margin-bottom: 12px;">
      Next Step — AI Tech Solutions
    </div>
    <div style="font-size: 10pt; line-height: 1.8; opacity: 0.95;">
      ${nl2p(report.nextSteps.aiTechSolutions)
        .replace(/<p>/g, '<p style="margin-bottom: 12px; color: white;">')
        .replace(/<\/p>/g, '</p>')}
    </div>
    <div style="margin-top: 20px; font-size: 9pt; opacity: 0.8; border-top: 1px solid rgba(255,255,255,0.3); padding-top: 14px;">
      Powered by Workforce Alliance Foundation · waf.org.sg
    </div>
  </div>
</div>`;

  return [
    { footerLabel: null, bodyHtml: coverHtml },
    { footerLabel: "Executive Summary", bodyHtml: execSummaryHtml },
    { footerLabel: "Section 01 — Business Climate", bodyHtml: section01Html },
    { footerLabel: "Section 02 — Disruption Landscape", bodyHtml: section02Html },
    { footerLabel: "Section 03 — Risk Management", bodyHtml: section03Html },
    { footerLabel: "Section 04 — Role Disruption Index", bodyHtml: section04Html },
    { footerLabel: "Section 05 — Emerging Roles", bodyHtml: section05Html },
    { footerLabel: "Section 06 — Grants Available", bodyHtml: section06Html },
    { footerLabel: "Section 07 — ROI Projection", bodyHtml: section07Html },
    { footerLabel: "Section 08 — Next Steps", bodyHtml: section08Html },
  ];
}
