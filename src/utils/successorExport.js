import { saveAs } from 'file-saver';
import { loadTrustData } from './storage';

export const generateSuccessorPackage = async () => {
    try {
        const trustData = await loadTrustData();
        if (!trustData) {
            alert('No trust data found to export.');
            return false;
        }

        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        let policiesHtml = "<p>No insurance policies recorded.</p>";
        if (trustData.policies && trustData.policies.length > 0) {
            policiesHtml = trustData.policies.map((p, i) => {
                let ledgerHtml = '';
                if (p.transactions && p.transactions.length > 0) {
                    const rows = [...p.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).map(tx => {
                        if (tx.type === 'PREMIUM') {
                            return `<tr><td>${tx.date}</td><td>${tx.note || 'Premium'}</td><td class="positive">+$${tx.amount.toLocaleString()}</td><td>-</td><td>-</td></tr>`;
                        } else {
                            return `<tr><td>${tx.date}</td><td>${tx.note || 'Statement Update'}</td><td>-</td><td>$${tx.cashValue.toLocaleString()}</td><td>$${tx.deathBenefit.toLocaleString()}</td></tr>`;
                        }
                    }).join('');

                    ledgerHtml = `
                    <details style="margin-top: 1.5rem; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px;">
                        <summary style="padding: 1rem; cursor: pointer; color: var(--gold); font-weight: 600; outline: none; user-select: none;">
                            <span class="acc-arrow">&#9656;</span> Transaction Ledger
                        </summary>
                        <div style="padding: 0 1rem 1rem 1rem;">
                            <table class="ledger-table" style="margin-top: 0;">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type/Note</th>
                                        <th>Premium Paid</th>
                                        <th>Statement CV</th>
                                        <th>Statement DB</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${rows}
                                </tbody>
                            </table>
                        </div>
                    </details>
                    `;
                }

                // Determine latest real CV based on TRUE_UPs if available, fallback to static
                let displayCV = p.cashValue || 0;
                let displayDB = p.deathBenefit || 0;
                if (p.transactions) {
                    const trueUps = p.transactions.filter(t => t.type === 'TRUE_UP').sort((a, b) => new Date(b.date) - new Date(a.date));
                    if (trueUps.length > 0) {
                        displayCV = trueUps[0].cashValue;
                        displayDB = trueUps[0].deathBenefit;
                    }
                }

                return `
                <div class="card">
                    <h3>Policy ${i + 1}: ${p.carrier}</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <p><strong>Insured:</strong> ${p.insured}</p>
                            <p><strong>Issue Date:</strong> ${p.issueDate || 'Unknown'}</p>
                            <p><strong>Loan Interest Rate:</strong> ${p.loanInterestRate}%</p>
                        </div>
                        <div>
                            <p><strong>Latest Statement DB:</strong> $${displayDB.toLocaleString()}</p>
                            <p><strong>Latest Statement CV:</strong> $${displayCV.toLocaleString()}</p>
                            <p><strong>Base Annual Premium:</strong> $${(p.baseAnnualPremium || 0).toLocaleString()}</p>
                            <p><strong>Planned Annual PUA:</strong> $${(p.plannedAnnualPUA || 0).toLocaleString()}</p>
                        </div>
                    </div>
                    ${ledgerHtml}
                </div>
                `;
            }).join('');
        }

        let documentsHtml = "<p>No required documents on file.</p>";
        if (trustData.documents && trustData.documents.length > 0) {
            documentsHtml = trustData.documents.map((doc, i) => {
                let docContent = `<div class="doc-placeholder">External or Physical Document Located in Vault</div>`;

                // If we have base64 image data embedded, render it directly
                if (doc.fileUrl && doc.fileUrl.startsWith('data:image/')) {
                    docContent = `<img src="${doc.fileUrl}" alt="${doc.name}" />`;
                }

                return `
                <div class="card doc-card">
                    <h3>Exhibit ${i + 1}: ${doc.name}</h3>
                    <div class="meta">Category: ${doc.category} | Date: ${doc.date}</div>
                    <div class="doc-container">
                        ${docContent}
                    </div>
                </div>
                `;
            }).join('');
        }

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Successor Trustee Emergency Dashboard</title>
            <style>
                :root {
                    --bg: #0f172a;
                    --panel: #1e293b;
                    --text: #f8fafc;
                    --dim: #94a3b8;
                    --gold: #d4af37;
                    --gold-glow: rgba(212, 175, 55, 0.3);
                }
                body {
                    font-family: 'Inter', -apple-system, sans-serif;
                    background: var(--bg);
                    color: var(--text);
                    line-height: 1.6;
                    padding: 0;
                    margin: 0;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .header {
                    text-align: center;
                    padding: 3rem 0;
                    border-bottom: 1px solid var(--gold-glow);
                    margin-bottom: 2rem;
                }
                .header h1 {
                    color: var(--gold);
                    margin: 0 0 0.5rem 0;
                    font-size: 2.5rem;
                }
                .warning-box {
                    background: rgba(220, 38, 38, 0.1);
                    border: 1px solid rgba(220, 38, 38, 0.3);
                    border-left: 4px solid #dc2626;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                }
                .warning-box h4 { margin: 0 0 0.5rem 0; color: #f87171; }
                .card {
                    background: var(--panel);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                .card h3 { margin-top: 0; color: var(--gold); }
                h2 { color: var(--text); border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; margin-top: 3rem; }
                
                .doc-card { display: flex; flexDirection: column; }
                .meta { font-size: 0.85rem; color: var(--dim); margin-bottom: 1rem; }
                .doc-container {
                    background: #000;
                    border: 1px dashed var(--dim);
                    padding: 1rem;
                    text-align: center;
                    border-radius: 8px;
                }
                .doc-container img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }
                .doc-placeholder { color: var(--dim); font-style: italic; padding: 2rem; }
                
                .ledger-table { width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-size: 0.85rem; }
                .ledger-table th, .ledger-table td { border: 1px solid rgba(255,255,255,0.1); padding: 0.75rem; text-align: left; }
                .ledger-table th { background: rgba(0,0,0,0.2); color: var(--text); }
                .positive { color: #10b981; }
                
                details > summary { list-style: none; }
                summary::-webkit-details-marker { display: none; }
                details[open] .acc-arrow { transform: rotate(90deg); display: inline-block; transition: 0.2s; }
                
                .footer {text-align: center; padding: 3rem 0; color: var(--dim); font-size: 0.85rem;}
                
                @media print {
                    body { background: #fff; color: #000; }
                    .card { border: 1px solid #ccc; break-inside: avoid; }
                    .header { border-bottom: 2px solid #000; }
                    .header h1, .card h3 { color: #000; }
                    .warning-box { border: 1px solid #000; }
                    .doc-container { background: #fff; }
                    .ledger-table th, .ledger-table td { border: 1px solid #ccc; }
                    .ledger-table th { background: #f1f5f9; color: #000; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Successor Trustee Emergency Dashboard</h1>
                    <p style="color: var(--dim);">Secure Standalone Record Generated on ${dateStr}</p>
                </div>

                <div class="warning-box">
                    <h4>IMPORTANT LEGAL NOTICE</h4>
                    <p style="margin:0; font-size: 0.9rem;">This document package is intended strictly for the appointed Successor Trustee. It contains sensitive financial structures, original trust agreements, and instructions regarding the execution of the Trust. Ensure this file remains physically secured on an encrypted USB drive.</p>
                </div>

                <h2>Phase 1: Infinite Banking Assets (Funding)</h2>
                <p>The Trust is funded through the following whole-life insurance policies. As Successor Trustee, you have the authority to manage the death benefits and continuing cash values associated with these policies:</p>
                ${policiesHtml}

                <h2>Phase 2: Executed Trust Exhibits & Forms</h2>
                <p>The following are the recorded physical exhibits defining the legal structure, beneficiaries, and powers of the Trust:</p>
                ${documentsHtml}

                <div class="footer">
                    Prepared securely by the Logic Wizards Trust Agent.
                </div>
            </div>
        </body>
        </html>
        `;

        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
        saveAs(blob, `Successor_Package_${dateStr.replace(/, /g, '_').replace(/ /g, '_')}.html`);

        return true;
    } catch (error) {
        console.error("Successor Export Failed: ", error);
        alert("An error occurred while generating the successor package.");
        return false;
    }
};
