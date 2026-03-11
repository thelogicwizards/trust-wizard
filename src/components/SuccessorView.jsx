import React, { useState } from 'react';
import { parseHashKey } from '../utils/hashKey';
import { ShieldCheck, Upload } from 'lucide-react';

export const SuccessorInput = ({ onHashLoaded }) => {
    const [hash, setHash] = useState('');
    const [error, setError] = useState('');

    const handleLoad = async () => {
        try {
            setError('');
            const data = await parseHashKey(hash.trim());
            onHashLoaded(data);
        } catch (err) {
            setError('Invalid or corrupted hash key. Please ensure you copied the entire string.');
        }
    };

    return (
        <div className="glass-panel anim-fade-in" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
            <h2 className="card-title" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                <ShieldCheck size={28} color="#d4af37" />
                Access Successor Dashboard
            </h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                Please paste the secure Successor Hash Key provided to you by the previous Trust Manager to view the trust assets and documents.
            </p>
            <textarea
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Paste your hash key here..."
                style={{
                    width: '100%',
                    height: '150px',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    color: 'var(--text-main)',
                    padding: '1rem',
                    fontFamily: 'monospace',
                    marginBottom: '1rem',
                    resize: 'vertical'
                }}
            />
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            <button
                onClick={handleLoad}
                disabled={!hash.trim()}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: !hash.trim() ? '#2d3748' : 'var(--accent-gold)',
                    color: !hash.trim() ? '#a0aec0' : '#000',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: !hash.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                <Upload size={18} /> Load Successor Package
            </button>
        </div>
    );
};

export const SuccessorDashboard = ({ data, onTakeOver, onCancel }) => {
    return (
        <div className="anim-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '3rem 0', borderBottom: '1px solid var(--accent-gold-glow)' }}>
                <h1 style={{ color: 'var(--accent-gold)', margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>Successor Trustee Emergency Dashboard</h1>
                <p style={{ color: 'var(--text-dim)' }}>Secure Standalone Record Generated via Hash Key</p>
            </div>

            <div style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderLeft: '4px solid #dc2626', padding: '1rem 1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f87171' }}>IMPORTANT LEGAL NOTICE</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    This document package is intended strictly for the appointed Successor Trustee. It contains sensitive financial structures, original trust agreements, and instructions regarding the execution of the Trust.
                </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={onCancel}
                    className="action-btn"
                >
                    Return to Login/Hash Input
                </button>
                <button
                    onClick={() => onTakeOver(data)}
                    className="action-btn solid-gold"
                    style={{ background: 'var(--accent-gold)', color: '#000', padding: '0.75rem 1.5rem', fontWeight: 600 }}
                >
                    <ShieldCheck size={18} /> Take Over as Trust Manager
                </button>
            </div>

            <h2 style={{ color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
                Phase 1: Infinite Banking Assets (Funding)
            </h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                The Trust is funded through the following whole-life insurance policies. As Successor Trustee, you have the authority to manage the death benefits and continuing cash values associated with these policies:
            </p>

            {!data.policies || data.policies.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No insurance policies recorded.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {data.policies.map((p, i) => {
                        let displayCV = p.cashValue || 0;
                        let displayDB = p.deathBenefit || 0;
                        if (p.transactions) {
                            const trueUps = p.transactions.filter(t => t.type === 'TRUE_UP').sort((a, b) => new Date(b.date) - new Date(a.date));
                            if (trueUps.length > 0) {
                                displayCV = trueUps[0].cashValue;
                                displayDB = trueUps[0].deathBenefit;
                            }
                        }

                        const sortedTransactions = [...(p.transactions || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

                        return (
                            <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ color: 'var(--accent-gold)', marginTop: 0, marginBottom: '1rem' }}>Policy {i + 1}: {p.carrier}</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ color: 'var(--text-main)' }}>
                                        <p><strong>Insured:</strong> {p.insured}</p>
                                        <p><strong>Issue Date:</strong> {p.issueDate || 'Unknown'}</p>
                                        <p><strong>Loan Interest Rate:</strong> {p.loanInterestRate}%</p>
                                    </div>
                                    <div style={{ color: 'var(--text-main)' }}>
                                        <p><strong>Latest Statement DB:</strong> ${displayDB.toLocaleString()}</p>
                                        <p><strong>Latest Statement CV:</strong> ${displayCV.toLocaleString()}</p>
                                        <p><strong>Base Annual Premium:</strong> ${(p.baseAnnualPremium || 0).toLocaleString()}</p>
                                        <p><strong>Planned Annual PUA:</strong> ${(p.plannedAnnualPUA || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                {sortedTransactions.length > 0 && (
                                    <details style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <summary style={{ padding: '1rem', cursor: 'pointer', color: 'var(--accent-gold)', fontWeight: 600, outline: 'none', userSelect: 'none' }}>
                                            Transaction Ledger
                                        </summary>
                                        <div style={{ padding: '0 1rem 1rem 1rem' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                <thead>
                                                    <tr>
                                                        <th style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', padding: '0.75rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>Date</th>
                                                        <th style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', padding: '0.75rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>Type/Note</th>
                                                        <th style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', padding: '0.75rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>Premium Paid</th>
                                                        <th style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', padding: '0.75rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>Statement CV</th>
                                                        <th style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-main)', padding: '0.75rem', textAlign: 'left', border: '1px solid rgba(255,255,255,0.1)' }}>Statement DB</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sortedTransactions.map((tx, idx) => (
                                                        <tr key={idx}>
                                                            <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'var(--text-main)' }}>{tx.date}</td>
                                                            <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'var(--text-main)' }}>{tx.note || (tx.type === 'PREMIUM' ? 'Premium' : 'Statement Update')}</td>
                                                            {tx.type === 'PREMIUM' ? (
                                                                <>
                                                                    <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: '#10b981' }}>+${tx.amount.toLocaleString()}</td>
                                                                    <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'var(--text-main)' }}>-</td>
                                                                    <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'var(--text-main)' }}>-</td>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'var(--text-main)' }}>-</td>
                                                                    <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'var(--text-main)' }}>${tx.cashValue.toLocaleString()}</td>
                                                                    <td style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem', color: 'var(--text-main)' }}>${tx.deathBenefit.toLocaleString()}</td>
                                                                </>
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </details>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <h2 style={{ color: 'var(--text-main)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginTop: '3rem', marginBottom: '1.5rem' }}>
                Phase 2: Executed Trust Exhibits & Forms
            </h2>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                The following are the recorded physical exhibits defining the legal structure, beneficiaries, and powers of the Trust:
            </p>

            {!data.documents || data.documents.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No required documents on file.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {data.documents.map((doc, i) => (
                        <div key={i} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ color: 'var(--accent-gold)', marginTop: 0, marginBottom: '0.5rem' }}>Exhibit {i + 1}: {doc.name}</h3>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Category: {doc.category} | Date: {doc.date}</div>

                            <div style={{ background: '#000', border: '1px dashed var(--text-dim)', padding: '1rem', textAlign: 'center', borderRadius: '8px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {doc.fileUrl && doc.fileUrl.startsWith('data:image/') ? (
                                    <img src={doc.fileUrl} alt={doc.name} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                                ) : (
                                    <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '2rem' }}>External or Physical Document Located in Vault</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
