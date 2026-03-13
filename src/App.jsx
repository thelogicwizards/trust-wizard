import React, { useState, useEffect } from 'react';
import {
    Building2,
    ShieldCheck,
    TrendingUp,
    BookOpen,
    FileText,
    History,
    ArrowUpRight,
    Info,
    ChevronRight,
    Landmark,
    Wallet,
    Download,
    ExternalLink,
    Shield,
    Edit3,
    Check,
    X,
    Plus,
    Menu,
    Trash2,
    Printer,
    Settings,
    List,
    Sun,
    Moon
} from 'lucide-react';



import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

import trustData from './data/trust_data.json';
import educationalModules from './data/educational_modules.json';
import stateTemplates from './data/state_templates.json';
import BorrowingCalculator from './components/BorrowingCalculator';
import DividendChart from './components/DividendChart';
import CrummeyNoticeGenerator from './components/CrummeyNoticeGenerator';
import ComplianceTracker from './components/ComplianceTracker';
import DocumentWizard from './components/DocumentWizard';
import { loadTrustData, saveTrustData } from './utils/storage';
import { exportVaultToZip, importVaultFromZip, importVaultFromNative } from './utils/backup';
import { generateHashKey } from './utils/hashKey';
import { SuccessorInput, SuccessorDashboard } from './components/SuccessorView';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel" style={{ padding: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <p className="premium-text" style={{ color: '#d4af37', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: '0.85rem' }}>Cash Value: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${payload[0]?.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></p>
                <p style={{ fontSize: '0.85rem' }}>Death Benefit: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${payload[1]?.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></p>
                {payload[2] && (
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
                        Cum. Premium: <span style={{ color: '#ef4444', fontWeight: 600 }}>${payload[2].value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </p>
                )}
            </div>
        );
    }
    return null;
};

// --- Helper Components for Editing ---

const EditableStat = ({ label, value, onSave, prefix = "$", suffix = ".00", isGold = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value);

    const handleSave = () => {
        onSave(parseFloat(inputValue));
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="stat-card glass-panel anim-fade-in">
                <div className="stat-label">{label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{prefix}</span>
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="premium-input"
                        autoFocus
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--accent-gold-glow)',
                            borderRadius: '8px',
                            color: 'var(--text-main)',
                            padding: '0.25rem 0.5rem',
                            fontSize: '1.25rem',
                            width: '100%'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={handleSave} className="icon-btn success"><Check size={16} /></button>
                    <button onClick={() => setIsEditing(false)} className="icon-btn"><X size={16} /></button>
                </div>
            </div>
        );
    }

    return (
        <div className="stat-card glass-panel" style={{ position: 'relative', group: 'true' }}>
            <div className="stat-label">{label}</div>
            <div className={`stat-value ${isGold ? 'gold' : ''}`}>{prefix}{value.toLocaleString()}{suffix}</div>
            <button
                onClick={() => setIsEditing(true)}
                className="edit-trigger"
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    opacity: 0.4,
                    transition: 'opacity 0.2s'
                }}
            >
                <Edit3 size={14} />
            </button>
        </div>
    );
};
const PolicyModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        carrier: '',
        insured: '',
        issueDate: new Date().toISOString().split('T')[0], // Default today
        cashValue: '',
        deathBenefit: '',
        loanInterestRate: '',
        baseAnnualPremium: '',
        plannedAnnualPUA: '',
        policyNumber: '',
        claimsPhone: '',
        customerCarePhone: ''
    });

    React.useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                carrier: initialData.carrier || '',
                insured: initialData.insured || '',
                issueDate: initialData.issueDate || new Date().toISOString().split('T')[0],
                cashValue: initialData.cashValue || '',
                deathBenefit: initialData.deathBenefit || '',
                loanInterestRate: initialData.loanInterestRate || '',
                baseAnnualPremium: initialData.baseAnnualPremium || '',
                plannedAnnualPUA: initialData.plannedAnnualPUA || '',
                policyNumber: initialData.policyNumber || '',
                claimsPhone: initialData.claimsPhone || '',
                customerCarePhone: initialData.customerCarePhone || ''
            });
        } else if (isOpen) {
            setFormData({ carrier: '', insured: '', issueDate: new Date().toISOString().split('T')[0], cashValue: '', deathBenefit: '', loanInterestRate: '', baseAnnualPremium: '', plannedAnnualPUA: '', policyNumber: '', claimsPhone: '', customerCarePhone: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...(initialData ? { id: initialData.id } : {}),
            carrier: formData.carrier || 'Unknown Carrier',
            insured: formData.insured || 'Unknown Insured',
            issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
            cashValue: Number(formData.cashValue) || 0,
            deathBenefit: Number(formData.deathBenefit) || 0,
            loanInterestRate: Number(formData.loanInterestRate) || 0,
            baseAnnualPremium: Number(formData.baseAnnualPremium) || 0,
            plannedAnnualPUA: Number(formData.plannedAnnualPUA) || 0,
            policyNumber: formData.policyNumber || '',
            claimsPhone: formData.claimsPhone || '',
            customerCarePhone: formData.customerCarePhone || ''
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-panel modal-content anim-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>{initialData ? 'Edit Policy Data' : 'Link New Policy'}</h3>
                    <button onClick={onClose} className="icon-btn" type="button"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Carrier Name</label>
                                <input type="text" value={formData.carrier} onChange={e => setFormData({ ...formData, carrier: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Insured Person</label>
                                <input type="text" value={formData.insured} onChange={e => setFormData({ ...formData, insured: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Issue Date</label>
                                <input type="date" value={formData.issueDate} onChange={e => setFormData({ ...formData, issueDate: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Policy Number</label>
                                <input type="text" value={formData.policyNumber} onChange={e => setFormData({ ...formData, policyNumber: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Claims Phone Number</label>
                                <input type="text" value={formData.claimsPhone} onChange={e => setFormData({ ...formData, claimsPhone: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Customer Care Phone Number</label>
                                <input type="text" value={formData.customerCarePhone} onChange={e => setFormData({ ...formData, customerCarePhone: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                            </div>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Cash Value ($)</label>
                                <input type="number" value={formData.cashValue} onChange={e => setFormData({ ...formData, cashValue: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Death Benefit ($)</label>
                                <input type="number" value={formData.deathBenefit} onChange={e => setFormData({ ...formData, deathBenefit: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Loan Interest Rate (%)</label>
                                <input type="number" step="0.1" value={formData.loanInterestRate} onChange={e => setFormData({ ...formData, loanInterestRate: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Base Annual Premium ($)</label>
                                <input type="number" value={formData.baseAnnualPremium} onChange={e => setFormData({ ...formData, baseAnnualPremium: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Planned Annual PUA ($)</label>
                                <input type="number" value={formData.plannedAnnualPUA} onChange={e => setFormData({ ...formData, plannedAnnualPUA: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                        </div>
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: 'var(--accent-gold)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Save Policy</button>
                </form>
            </div>
        </div>
    );
};

const PolicyLedgerModal = ({ isOpen, onClose, policy, onAddTransaction }) => {
    const [txType, setTxType] = useState('PREMIUM'); // 'PREMIUM' or 'TRUE_UP'
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        cashValue: '',
        deathBenefit: '',
        note: ''
    });

    if (!isOpen || !policy) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const tx = {
            id: `tx_${Date.now()}`,
            type: txType,
            date: formData.date,
            note: formData.note || (txType === 'PREMIUM' ? 'Premium Payment' : 'Statement True-Up')
        };

        if (txType === 'PREMIUM') {
            tx.amount = Number(formData.amount) || 0;
        } else {
            tx.cashValue = Number(formData.cashValue) || 0;
            tx.deathBenefit = Number(formData.deathBenefit) || 0;
        }

        onAddTransaction(policy.id, tx);
        setFormData({ date: new Date().toISOString().split('T')[0], amount: '', cashValue: '', deathBenefit: '', note: '' });
    };

    const sortedTransactions = [...(policy.transactions || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-panel modal-content anim-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--text-main)' }}>Trust Ledger: {policy.carrier}</h3>
                    <button onClick={onClose} className="icon-btn" type="button"><X size={18} /></button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Base Annual Premium</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>${(policy.baseAnnualPremium || 0).toLocaleString()}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>Planned Annual PUA</div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>${(policy.plannedAnnualPUA || 0).toLocaleString()}</div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: 'var(--accent-gold)', marginBottom: '1rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '0.5rem' }}>Log Transaction</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        <button onClick={() => setTxType('PREMIUM')} style={{ flex: 1, padding: '0.5rem', background: txType === 'PREMIUM' ? 'var(--accent-gold)' : 'transparent', color: txType === 'PREMIUM' ? '#000' : 'var(--text-dim)', border: '1px solid var(--accent-gold)', borderRadius: '8px', cursor: 'pointer' }}>Premium Payment</button>
                        <button onClick={() => setTxType('TRUE_UP')} style={{ flex: 1, padding: '0.5rem', background: txType === 'TRUE_UP' ? 'var(--accent-gold)' : 'transparent', color: txType === 'TRUE_UP' ? '#000' : 'var(--text-dim)', border: '1px solid var(--accent-gold)', borderRadius: '8px', cursor: 'pointer' }}>Statement True-Up</button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Date</label>
                                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                            </div>
                            {txType === 'PREMIUM' ? (
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Amount ($)</label>
                                    <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                                </div>
                            ) : (
                                <>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Statement CV ($)</label>
                                        <input type="number" value={formData.cashValue} onChange={e => setFormData({ ...formData, cashValue: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Statement DB ($)</label>
                                        <input type="number" value={formData.deathBenefit} onChange={e => setFormData({ ...formData, deathBenefit: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} required />
                                    </div>
                                </>
                            )}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Note/Description</label>
                            <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} placeholder={txType === 'PREMIUM' ? "e.g., Annual Base + PUA" : "e.g., 2024 Annual Statement"} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                        </div>
                        <button type="submit" style={{ width: '100%', padding: '0.75rem', background: 'transparent', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Log Record</button>
                    </form>
                </div>

                <div>
                    <h4 style={{ color: 'var(--text-dim)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Transaction History</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {sortedTransactions.map(tx => (
                            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.2rem' }}>{tx.note || tx.type.replace('_', ' ')}</div>
                                    <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>{tx.date}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    {tx.type === 'PREMIUM' ? (
                                        <div style={{ color: '#ef4444', fontWeight: 600 }}>+${tx.amount.toLocaleString()}</div>
                                    ) : (
                                        <>
                                            <div style={{ color: 'var(--accent-gold)' }}>CV: ${tx.cashValue.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>DB: ${tx.deathBenefit.toLocaleString()}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {sortedTransactions.length === 0 && <div style={{ color: 'var(--text-dim)', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>No transactions logged.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuccessorExportModal = ({ isOpen, onClose, hashKey }) => {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(hashKey);
        // Note: alert might be annoying if clicked multiple times, but it is simple feedback
    };

    const handleEmail = () => {
        const subject = encodeURIComponent("Your Trust Successor Hash Key");
        const body = encodeURIComponent(`You have been appointed as a Successor Trustee.\n\nPlease visit the Trust Manager portal, click "Connect as Successor" on the dashboard, and paste the following secure hash key to access your authorization package and trust details:\n\n${hashKey}\n\nKeep this key safe.`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-panel modal-content anim-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', textAlign: 'center' }}>
                <h3 className="card-title" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={28} color="#d4af37" />
                    Successor Hash Key Generated
                </h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                    This key contains an encrypted snapshot of the current trust state. Provide it to your appointed successor.
                </p>
                <textarea
                    readOnly
                    value={hashKey}
                    style={{
                        width: '100%',
                        height: '100px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        color: 'var(--text-main)',
                        padding: '1rem',
                        fontFamily: 'monospace',
                        marginBottom: '1.5rem',
                        resize: 'none'
                    }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleCopy} style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-gold)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                        Copy to Clipboard
                    </button>
                    <button onClick={handleEmail} style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                        Email Successor
                    </button>
                </div>
                <button onClick={onClose} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>Close</button>
            </div>
        </div>
    );
};

const OverviewContent = ({ data, stats, policies, onAddPolicy, onEditPolicy, onDeletePolicy, onOpenLedger, onTakeOver }) => {
    const [isSuccessorView, setIsSuccessorView] = useState(false);
    const [successorData, setSuccessorData] = useState(null);

    if (isSuccessorView) {
        if (!successorData) {
            return (
                <div className="main-content anim-fade-in" style={{ gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
                        <button onClick={() => setIsSuccessorView(false)} className="action-btn">
                            &larr; Back to Dashboard
                        </button>
                    </div>
                    <SuccessorInput onHashLoaded={setSuccessorData} />
                </div>
            );
        } else {
            return (
                <div className="main-content anim-fade-in" style={{ gridColumn: 'span 2' }}>
                    <SuccessorDashboard
                        data={successorData}
                        onTakeOver={(d) => {
                            onTakeOver(d);
                            setIsSuccessorView(false);
                            setSuccessorData(null);
                        }}
                        onCancel={() => {
                            setSuccessorData(null);
                            setIsSuccessorView(false);
                        }}
                    />
                </div>
            );
        }
    }

    return (
        <div className="main-content anim-fade-in">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button onClick={() => setIsSuccessorView(true)} className="action-btn info">
                    <ShieldCheck size={14} /> Connect as Successor
                </button>
            </div>

            <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                <h2 className="card-title">
                    <TrendingUp size={24} color="#d4af37" />
                    Policy Value Projection
                </h2>
                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#4a5568"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#4a5568"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="cash"
                                stroke="#d4af37"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCash)"
                            />
                            <Area
                                type="monotone"
                                dataKey="death"
                                stroke="rgba(226, 232, 240, 0.2)"
                                strokeWidth={1}
                                fill="transparent"
                            />
                            <Area
                                type="monotone"
                                dataKey="premium"
                                stroke="#ef4444"
                                strokeDasharray="4 4"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPremium)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card" data-tooltip="The aggregate equity accumulated across all your trust's life insurance policies. This grows tax-deferred and forms the basis for your borrowing capacity.">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Total Cash Value</div>
                    <div className="stat-value gold" style={{ fontSize: '2rem' }}>${stats.totalCashValue.toLocaleString()}</div>
                </div>
                <div className="stat-card" data-tooltip="The total combined payout the trust receives upon your passing. This provides the ultimate legacy and protection for your beneficiaries.">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', fontWeight: 600 }}>Total Death Benefit</div>
                    <div className="stat-value" style={{ fontSize: '2rem' }}>${stats.deathBenefit.toLocaleString()}</div>
                </div>
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 className="card-title" style={{ margin: 0 }}>
                        <ShieldCheck size={20} color="#d4af37" />
                        Tracked Policies
                    </h3>
                    <button
                        onClick={onAddPolicy}
                        className="icon-btn"
                        style={{ background: 'var(--accent-gold)', color: '#000', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center', border: 'none', cursor: 'pointer' }}
                    >
                        <Plus size={16} /> Link Policy
                    </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {policies && policies.map((p, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem' }}>{p.carrier} <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 400 }}>({p.id})</span></div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>Insured: {p.insured} • Loan Rate: {p.loanInterestRate}%</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <span><strong>Policy #:</strong> {p.policyNumber || 'N/A'}</span>
                                    <span><strong>Claims:</strong> {p.claimsPhone || 'N/A'}</span>
                                    <span><strong>Care:</strong> {p.customerCarePhone || 'N/A'}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>CV: ${(p.transactions?.find(t => t.type === 'TRUE_UP')?.cashValue || p.cashValue || 0).toLocaleString()}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>DB: ${(p.transactions?.find(t => t.type === 'TRUE_UP')?.deathBenefit || p.deathBenefit || 0).toLocaleString()}</div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <button
                                        onClick={() => onOpenLedger(p)}
                                        className="icon-btn"
                                        style={{ color: 'var(--accent-gold)', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.5rem' }}
                                        title="View Ledger / Update Values"
                                    >
                                        <List size={18} />
                                    </button>
                                    <button
                                        onClick={() => onEditPolicy(p)}
                                        className="icon-btn"
                                        style={{ color: '#38bdf8', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.5rem' }}
                                        title="Edit Policy Details"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDeletePolicy(p.id)}
                                        className="icon-btn"
                                        style={{ color: '#ef4444', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.5rem' }}
                                        title="Delete Policy"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!policies || policies.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No policies linked to this trust yet.</div>
                    )}
                </div>
            </div>

            <DividendChart />
        </div>
    );
};


// --- Document Management Components ---

const DeepDiveModal = ({ isOpen, onClose, module }) => {
    if (!isOpen || !module || !module.deepDive) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="glass-panel modal-content anim-fade-in"
                style={{ maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="badge badge-gold">{module.tag}</div>
                    <button onClick={onClose} className="icon-btn"><X size={18} /></button>
                </div>

                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>{module.deepDive.title}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {module.deepDive.sections.map((section, idx) => (
                        <div key={idx}>
                            <h4 style={{ color: 'var(--accent-gold)', marginBottom: '0.75rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ChevronRight size={18} /> {section.heading}
                            </h4>
                            <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem' }}>{section.text}</p>
                        </div>
                    ))}
                </div>

                {module.deepDive.resources && module.deepDive.resources.length > 0 && (
                    <div style={{ marginTop: '2.5rem', background: 'rgba(212, 175, 55, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ExternalLink size={18} color="var(--accent-gold)" /> Vetted Resources
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {module.deepDive.resources.map((res, i) => (
                                <a
                                    key={i}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'var(--accent-gold)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <span style={{ textDecoration: 'underline' }}>{res.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}


                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        style={{ padding: '0.75rem 2rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 700, cursor: 'pointer' }}
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};


const STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
    'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
    'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const PrintSettingsModal = ({ isOpen, onClose, onGenerate }) => {
    const [selectedState, setSelectedState] = useState('North Carolina');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content anim-fade-in" style={{ maxWidth: '400px' }}>
                <h3 className="card-title">
                    <Printer size={20} color="#d4af37" />
                    Print Portfolio Settings
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Recording Jurisdiction (State)</label>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(12, 14, 18, 1)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                color: 'var(--text-main)'
                            }}
                        >
                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.75rem', lineHeight: '1.4' }}>
                            Selection will update the judicial header and court system references specifically for the selected state's recording requirements.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            onClick={() => onGenerate(selectedState)}
                            style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Generate Portfolio
                        </button>
                        <button
                            onClick={onClose}
                            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DocumentModal = ({ isOpen, onClose, onSave, initialData = null }) => {

    const [name, setName] = useState(initialData?.name || '');
    const [category, setCategory] = useState(initialData?.category || 'Legal');
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Invalid file format. Please upload strictly a JPG or PNG image.');
                e.target.value = ''; // Reset input
                return;
            }

            setSelectedFile(file);
            if (!name) setName(file.name.split('.')[0]);
        }
    };

    const handleSave = () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Url = reader.result;
                onSave({
                    name,
                    category,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
                    fileUrl: base64Url,
                    fileName: selectedFile.name,
                    fileType: selectedFile.type
                });
            };
            reader.readAsDataURL(selectedFile);
        } else if (initialData) {
            onSave({
                ...initialData,
                name,
                category
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="glass-panel modal-content anim-fade-in">
                <h3 className="card-title">
                    {initialData ? <Edit3 size={20} color="#d4af37" /> : <Plus size={20} color="#d4af37" />}
                    {initialData ? 'Edit Document' : 'Add New Document'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Selection</label>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(212, 175, 55, 0.05)',
                                border: '1px dashed var(--accent-gold-glow)',
                                borderRadius: '12px',
                                color: selectedFile ? '#fff' : 'var(--text-dim)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Plus size={18} />
                            {selectedFile ? `Selected: ${selectedFile.name}` : 'Upload or Scan Image (.jpg, .png)'}
                        </button>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                            capture="environment"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Document Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="premium-input"
                            placeholder="e.g. Trust Amendment"
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                color: 'var(--text-main)'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(12, 14, 18, 1)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                padding: '0.75rem 1rem',
                                color: 'var(--text-main)'
                            }}
                        >
                            <option value="Legal">Legal</option>
                            <option value="Policy">Policy</option>
                            <option value="Funding">Funding</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
                        <button
                            onClick={handleSave}
                            disabled={!selectedFile && !initialData}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                background: (!selectedFile && !initialData) ? '#2d3748' : 'var(--accent-gold)',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#000',
                                fontWeight: 700,
                                cursor: (!selectedFile && !initialData) ? 'not-allowed' : 'pointer',
                                opacity: (!selectedFile && !initialData) ? 0.5 : 1
                            }}
                        >
                            Save Document
                        </button>
                        <button
                            onClick={onClose}
                            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const DocumentsContent = ({ documents, onUpdateDocuments, onGenerateSuccessorKey }) => {
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

    // New Modal States
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isLoadStateModalOpen, setIsLoadStateModalOpen] = useState(false);
    const [isUnsupportedStateModalOpen, setIsUnsupportedStateModalOpen] = useState(false);
    const [unsupportedStateName, setUnsupportedStateName] = useState('');
    const [stateInput, setStateInput] = useState('');
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [wizardDoc, setWizardDoc] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [printData, setPrintData] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);

    const backupInputRef = React.useRef(null);

    const handleExportBackup = async () => {
        await exportVaultToZip();
    };

    const handleImportBackup = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const data = await importVaultFromZip(file);
            if (data && data.documents) {
                onUpdateDocuments(data.documents);
                alert("Vault successfully restored from backup.");
            }
        }
        e.target.value = ''; // Reset input so same file can be imported again if needed
    };

    const triggerRestore = async () => {
        if (window.__TAURI_INTERNALS__) {
            const data = await importVaultFromNative();
            if (data && data.documents) {
                onUpdateDocuments(data.documents);
                alert("Vault successfully restored from Native backup.");
            }
        } else {
            backupInputRef.current.click();
        }
    };


    const handleAdd = () => {
        setEditingDoc(null);
        setIsModalOpen(true);
    };

    const handleEdit = (doc, index) => {
        setEditingDoc({ ...doc, index });
        setIsModalOpen(true);
    };

    const handleDelete = (index) => {
        const newDocs = documents.filter((_, i) => i !== index);
        onUpdateDocuments(newDocs);
    };

    const handleSave = (docData) => {
        if (editingDoc && editingDoc.index !== undefined) {
            const newDocs = [...documents];
            newDocs[editingDoc.index] = docData;
            onUpdateDocuments(newDocs);
        } else {
            onUpdateDocuments([docData, ...documents]);
        }
        setIsModalOpen(false);
    };

    const handleRestoreDefaults = () => {
        setIsRestoreModalOpen(true);
    };

    const confirmRestoreDefaults = () => {
        const universalTemplates = stateTemplates.find(s => s.id === 'Universal')?.documents || [];

        const missingTemplates = universalTemplates.filter(template =>
            !documents.some(doc => doc.name === template.name)
        );

        if (missingTemplates.length > 0) {
            onUpdateDocuments([...documents, ...missingTemplates]);
            alert(`Restored ${missingTemplates.length} default template(s).`);
        } else {
            alert("All default templates are already present in your vault.");
        }
        setIsRestoreModalOpen(false);
    };

    const handleLoadStateTemplates = () => {
        setStateInput('');
        setIsLoadStateModalOpen(true);
    };

    const submitLoadStateTemplates = (e) => {
        e.preventDefault();
        const stateStr = stateInput;
        setIsLoadStateModalOpen(false);
        setStateInput('');

        if (!stateStr) return;

        const stateData = stateTemplates.find(s => s.id.toLowerCase() === stateStr.toLowerCase().trim());

        if (!stateData) {
            setUnsupportedStateName(stateStr);
            setIsUnsupportedStateModalOpen(true);
            return;
        }

        const stateDocs = stateData.documents;

        const missingStateDocs = stateDocs.filter(template =>
            !documents.some(doc => doc.name === template.name)
        );

        if (missingStateDocs.length > 0) {
            onUpdateDocuments([...documents, ...missingStateDocs]);
            alert(`Successfully loaded ${missingStateDocs.length} required template(s) for ${stateData.id}.`);
        } else {
            alert(`The required templates for ${stateData.id} are already in your vault.`);
        }
    };

    const handleView = (doc) => {
        if (doc.fileUrl) {
            setViewingDoc(doc);
        } else {
            alert('This is a mock document. Please upload a real file to use the view feature.');
        }
    };

    const renderDocumentViewer = () => {
        if (!viewingDoc) return null;
        const isImage = viewingDoc.fileType?.startsWith('image/') || viewingDoc.fileName?.match(/\.(jpg|jpeg|png)$/i);
        
        return (
            <div className="print-portfolio-container document-viewer-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 99999, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1rem', background: '#1c1c1c', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100000 }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem' }}>{viewingDoc.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href={viewingDoc.fileUrl} download={viewingDoc.fileName} style={{ padding: '8px 16px', background: '#d4af37', color: '#000', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Download</a>
                        <button onClick={() => setViewingDoc(null)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
                    </div>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                    {isImage ? (
                        <img src={viewingDoc.fileUrl} alt={viewingDoc.name} style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', background: '#fff' }} />
                    ) : (
                        <iframe src={viewingDoc.fileUrl} title={viewingDoc.name} style={{ width: '100%', height: '85vh', background: '#fff', border: 'none' }} />
                    )}
                </div>
            </div>
        );
    };

    const handlePrintPortfolio = (selectedState) => {
        setIsPrintModalOpen(false);
        setPrintData({ selectedState });
    };

    const renderPrintPortfolio = () => {
        if (!printData) return null;
        const { selectedState } = printData;

        const tocHtml = documents.map((doc, index) => `
            <div class="print-toc-item" style="display: flex; justify-content: space-between; border-bottom: 1px dotted #888; padding: 0.5rem 0;">
                <span>${index + 1}. ${doc.name} (${doc.category})</span>
                <span>${doc.date}</span>
            </div>
        `).join('');

        const docsHtml = documents.map((doc, index) => {
            let contentHtml = '';
            if (doc.fileUrl) {
                const isImage = doc.fileType?.startsWith('image/') || doc.fileName?.match(/\.(jpg|jpeg|png)$/i);
                const isPdf = doc.fileType === 'application/pdf' || doc.fileName?.match(/\.pdf$/i);

                if (isImage) {
                    contentHtml = `<img src="${doc.fileUrl}" style="max-width:100%; max-height: 90vh; display:block; margin: 0 auto;"/>`;
                } else if (isPdf) {
                    contentHtml = `
                        <div style="padding: 4rem; border: 1px dashed #888; text-align: center; background: #fafafa; color: #000;">
                            <h3 style="margin-bottom: 1rem;">PDF Document Record</h3>
                            <p style="margin-bottom: 2rem;">Due to browser print constraints, PDFs cannot be natively embedded for complete portfolio printing. Please, print individually and add in sequence appropriately</p>
                            <a href="${doc.fileUrl}" target="_blank" style="padding: 10px 20px; background: #d4af37; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">
                                Open ${doc.fileName}
                            </a>
                        </div>
                    `;
                } else {
                    contentHtml = `<div style="padding: 4rem; border: 1px dashed #888; text-align: center; font-style: italic;">[ File content for ${doc.fileName} to be physically appended ]</div>`;
                }
            } else {
                contentHtml = `<div style="padding: 4rem; border: 1px dashed #888; text-align: center; font-style: italic;">[ Official document physically on file in the Trust Vault ]</div>`;
            }

            return `
                <div class="legal-page" style="page-break-before: always; padding-top: 2rem;">
                    <h2 style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 2rem;">
                        Exhibit ${index + 1}: ${doc.name}
                    </h2>
                    ${contentHtml}
                </div>
            `;
        }).join('');

        const innerHtml = `
            <div class="print-header" style="text-align: center; border-bottom: 2px solid #000; margin-bottom: 2rem; padding-bottom: 1rem;">
                <h1 style="margin:0; padding:0; font-family:'Times New Roman', serif;">OFFICIAL TRUST DOCUMENT PORTFOLIO</h1>
                <p style="margin-top:0.5rem; font-family:'Times New Roman', serif;">Prepared for Judicial Recording: ${selectedState} Superior Court Systems</p>
            </div>
            <div class="judicial-note" style="font-style: italic; margin-bottom: 2rem; font-size: 0.9rem; color: #333; font-family:'Times New Roman', serif;">
                <strong>LEGAL NOTICE:</strong> This portfolio constitutes a certified index and physical compilation of documents pertaining to the Trust. 
                This record is intended for physical filing and verification within the judicial recording offices of the State of ${selectedState}.
            </div>
            <div class="toc-title" style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; text-decoration: underline; font-family:'Times New Roman', serif;">TABLE OF CONTENTS</div>
            <div style="font-family:'Times New Roman', serif;">${tocHtml}</div>
            <div style="font-family:'Times New Roman', serif;">${docsHtml}</div>
            <div class="footer" style="margin-top: 4rem; font-size: 0.8rem; text-align: center; border-top: 1px solid #ccc; padding-top: 1rem; font-family:'Times New Roman', serif;">
                Generated by Trust Agent Premium Portfolio System • ${new Date().toLocaleDateString()}
                <br/>Digital Verification ID: TA-${Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
        `;

        return (
            <div className="print-portfolio-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, overflow: 'auto', padding: '2cm', color: '#000', fontFamily: "'Times New Roman', serif", lineHeight: 1.6 }}>
                <div className="no-print" style={{ marginBottom: '20px', textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end', position: 'sticky', top: '0', background: 'rgba(255,255,255,0.9)', padding: '1rem', borderBottom: '1px solid #ccc' }}>
                    <button onClick={() => window.print()} style={{ padding: '10px 20px', cursor: 'pointer', background: '#d4af37', border: 'none', fontWeight: 'bold', color: '#000', borderRadius: '4px' }}>Print / Save PDF</button>
                    <button onClick={() => setPrintData(null)} style={{ padding: '10px 20px', cursor: 'pointer', background: '#e2e8f0', border: '1px solid #cbd5e1', color: '#000', borderRadius: '4px' }}>Close Window</button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: innerHtml }} />
            </div>
        );
    };


    const filteredDocs = filter === 'All' ? documents : documents.filter(d => d.category === filter);


    return (
        <div className="main-content anim-fade-in" style={{ width: '100%', gridColumn: 'span 2' }}>
            <div className="glass-panel" style={{ position: 'relative' }}>
                <div className="doc-header-top">
                    <h2 className="card-title doc-section-title">
                        <FileText size={20} color="#d4af37" className="doc-section-icon" />
                        <span>Trust Document Vault</span>
                    </h2>
                    <div className="doc-header-actions">
                        <div className="desktop-only" style={{ display: 'flex', gap: '0.5rem' }}>
                            {['All', 'Legal', 'Policy', 'Funding'].map(cat => (
                                <span
                                    key={cat}
                                    className={`badge ${filter === cat ? 'badge-gold' : ''}`}
                                    onClick={() => setFilter(cat)}
                                    style={{ cursor: 'pointer', opacity: filter === cat ? 1 : 0.6 }}
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <div className="mobile-only dropdown-container">
                            <button onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)} className="action-btn" style={{ fontSize: '0.85rem' }}>
                                <Menu size={16} /> Categories ({filter})
                            </button>
                            {isCategoryMenuOpen && (
                                <div className="dropdown-menu" style={{ minWidth: '150px', left: 0, right: 'auto' }}>
                                    {['All', 'Legal', 'Policy', 'Funding'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setFilter(cat); setIsCategoryMenuOpen(false); }}
                                            className={`action-btn ${filter === cat ? 'gold' : ''}`}
                                            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.6rem 0.75rem', border: 'none' }}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="doc-actions-wrapper">
                            {/* Desktop Advanced Actions */}
                            <div className="desktop-only" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                <button onClick={handleRestoreDefaults} className="action-btn">
                                    <History size={14} /> Restore Defaults
                                </button>
                                <button onClick={handleLoadStateTemplates} className="action-btn info">
                                    <Landmark size={14} /> Load State Templates
                                </button>
                                <button onClick={handleExportBackup} className="action-btn">
                                    <Download size={14} /> Backup
                                </button>
                                <button onClick={triggerRestore} className="action-btn">
                                    <History size={14} /> Restore
                                </button>
                                <button onClick={() => setIsPrintModalOpen(true)} className="action-btn">
                                    <Printer size={14} /> Print Portfolio
                                </button>
                                <button onClick={onGenerateSuccessorKey} className="action-btn danger">
                                    <Download size={14} /> Successor Hash Key
                                </button>
                            </div>

                            {/* Mobile Advanced Actions Menu */}
                            <div className="mobile-only dropdown-container">
                                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="action-btn">
                                    <Settings size={14} /> Advanced
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu" style={{ right: '-70px' }}>
                                        <button onClick={() => { handleRestoreDefaults(); setIsDropdownOpen(false); }} className="action-btn">
                                            <History size={14} /> Restore Defaults
                                        </button>
                                        <button onClick={() => { handleLoadStateTemplates(); setIsDropdownOpen(false); }} className="action-btn info">
                                            <Landmark size={14} /> Load State Templates
                                        </button>
                                        <button onClick={() => { handleExportBackup(); setIsDropdownOpen(false); }} className="action-btn">
                                            <Download size={14} /> Backup
                                        </button>
                                        <button onClick={() => { triggerRestore(); setIsDropdownOpen(false); }} className="action-btn">
                                            <History size={14} /> Restore
                                        </button>
                                        <button onClick={() => { setIsPrintModalOpen(true); setIsDropdownOpen(false); }} className="action-btn">
                                            <Printer size={14} /> Print Portfolio
                                        </button>
                                        <button onClick={() => { onGenerateSuccessorKey(); setIsDropdownOpen(false); }} className="action-btn danger">
                                            <Download size={14} /> Successor Hash Key
                                        </button>
                                    </div>
                                )}
                            </div>

                            <input
                                type="file"
                                accept=".zip"
                                ref={backupInputRef}
                                onChange={handleImportBackup}
                                style={{ display: 'none' }}
                            />
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWizardDoc(null); setIsWizardOpen(true); }} className="action-btn gold">
                                <ShieldCheck size={14} /> Create via Wizard
                            </button>
                            <button onClick={handleAdd} className="action-btn solid-gold">
                                <Plus size={14} /> Upload Single
                            </button>
                        </div>
                    </div>

                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredDocs.map((doc, i) => (
                        <div key={i} className="guide-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ padding: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '12px' }}>
                                        <FileText size={24} color="#d4af37" />
                                    </div>
                                    <div className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{doc.category}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {doc.isTemplate && (
                                        <button
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWizardDoc({ ...doc, index: i }); setIsWizardOpen(true); }}
                                            className="icon-btn"
                                            style={{ padding: '0.4rem', color: 'var(--accent-gold)', borderColor: 'var(--accent-gold)' }}
                                            title="Generate Document"
                                        >
                                            <ShieldCheck size={14} />
                                        </button>
                                    )}
                                    <button onClick={() => handleEdit(doc, i)} className="icon-btn" style={{ padding: '0.4rem' }}><Edit3 size={14} /></button>
                                    <button onClick={() => handleDelete(i)} className="icon-btn danger" style={{ padding: '0.4rem' }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <div>
                                <div className="guide-title" style={{ fontSize: '1.1rem' }}>{doc.name}</div>
                                <div className="guide-desc" style={{ marginTop: '0.25rem' }}>Modified: {doc.date} • {doc.size}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                                <button
                                    onClick={() => handleDownload(doc)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    <Download size={14} /> Download
                                </button>
                                <button
                                    onClick={() => handleView(doc)}
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    <ExternalLink size={14} /> View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <DocumentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingDoc}
            />

            <DocumentWizard
                isOpen={isWizardOpen}
                initialDoc={wizardDoc}
                onClose={() => setIsWizardOpen(false)}
                onSave={handleSave}
            />

            <PrintSettingsModal
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                onGenerate={handlePrintPortfolio}
            />

            {/* Restore Defaults Modal */}
            {
                isRestoreModalOpen && (
                    <div className="modal-overlay">
                        <div className="glass-panel modal-content anim-fade-in" style={{ maxWidth: '400px' }}>
                            <h3 className="card-title">
                                <History size={20} color="#d4af37" />
                                Restore Default Templates
                            </h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                This will add missing default templates back to your vault. Existing documents will not be deleted. Do you want to continue?
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={confirmRestoreDefaults}
                                    style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    Continue
                                </button>
                                <button
                                    onClick={() => setIsRestoreModalOpen(false)}
                                    style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Load State Templates Modal */}
            {
                isLoadStateModalOpen && (
                    <div className="modal-overlay">
                        <div className="glass-panel modal-content anim-fade-in" style={{ maxWidth: '400px' }}>
                            <h3 className="card-title">
                                <Landmark size={20} color="#38bdf8" />
                                Load State Templates
                            </h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                                Enter your state (e.g., California, Florida, Texas, New York) to load specific required trust templates:
                            </p>
                            <form onSubmit={submitLoadStateTemplates}>
                                <input
                                    type="text"
                                    value={stateInput}
                                    onChange={(e) => setStateInput(e.target.value)}
                                    placeholder="Enter state name"
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1rem',
                                        color: 'var(--text-main)',
                                        marginBottom: '1.5rem'
                                    }}
                                />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        Load
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsLoadStateModalOpen(false)}
                                        style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-main)', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Unsupported State Modal */}
            {
                isUnsupportedStateModalOpen && (
                    <div className="modal-overlay">
                        <div className="glass-panel modal-content anim-fade-in" style={{ maxWidth: '400px' }}>
                            <h3 className="card-title">
                                <Info size={20} color="#38bdf8" />
                                State Not Specifically Covered
                            </h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                                We do not currently have specific template automation for <strong>{unsupportedStateName}</strong>.
                            </p>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                However, most simple trusts rely solely on the Universal Templates provided. If your state requires local forms (like specific deeds or affidavits), please add them manually using the "Add Document" button.
                            </p>
                            <div style={{ padding: '1rem', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.2)', marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
                                    Need specific forms for {unsupportedStateName}? Contact support to request them: <br />
                                    <a href={`mailto:craig@logicwizards.one?subject=Trust Agent - Request Templates for ${unsupportedStateName}`} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>craig@logicwizards.one</a>
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsUnsupportedStateModalOpen(false)}
                                    style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    I Understand
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            <CrummeyNoticeGenerator />
            {renderPrintPortfolio()}
            {renderDocumentViewer()}
        </div >
    );
};



const FundingContent = ({ stats }) => {
    const [showCalculator, setShowCalculator] = useState(false);

    return (
        <div className="main-content anim-fade-in" style={{ width: '100%', gridColumn: 'span 2' }}>
            <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, var(--insight-bg-end) 100%)', marginBottom: showCalculator ? '2rem' : '0' }}>
                <h2 className="card-title">
                    <Wallet size={24} color="#d4af37" />
                    Funding Mastery
                </h2>
                <div className="funding-mastery-grid">
                    <div>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                            Your trust is efficiently funded through high-cash-value life insurance. Your current capacity for a collateralized loan is calculated at 90% of your total cash value.
                        </p>
                        <div className="stat-card" style={{ background: 'rgba(0,0,0,0.2)', marginBottom: '1.5rem' }} data-tooltip="Typically 90% of your Total Cash Value. This represents the capital the trust can access immediately without surrendering the asset.">
                            <div className="stat-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Available for Borrowing <Info size={14} style={{ opacity: 0.6 }} />
                            </div>
                            <div className="stat-value gold" style={{ fontSize: '2.5rem' }}>${stats.maxLoanAmount.toLocaleString()}</div>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-dim)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                                <strong>Formula:</strong> ${stats.totalCashValue.toLocaleString()} &times; 0.90 = ${stats.maxLoanAmount.toLocaleString()}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                <Info size={16} /> Strategy Note
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                                Policy loans do not affect your credit score and the underlying cash value continues to earn dividends as if the loan didn't exist.
                            </p>
                        </div>
                    </div>
                    {!showCalculator ? (
                        <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--accent-gold-glow)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{ padding: '1.5rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '50%', marginBottom: '1rem' }}>
                                <TrendingUp size={32} color="#d4af37" />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Interactive Calculator</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
                                Simulate how borrowing impacts your long-term growth and debt-to-equity ratio.
                            </p>
                            <button
                                onClick={() => setShowCalculator(true)}
                                style={{ padding: '0.75rem 2rem', background: 'var(--accent-gold)', color: '#000', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                            >
                                Launch Simulator
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
                            <Shield size={48} color="var(--accent-gold)" style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <h4 style={{ color: 'var(--text-dim)' }}>Simulator Active</h4>
                            <button
                                onClick={() => setShowCalculator(false)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', fontSize: '0.8rem', marginTop: '1rem' }}
                            >
                                Close Simulator
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showCalculator && (
                <BorrowingCalculator
                    maxLoan={stats.maxLoanAmount}
                    interestRate={stats.loanInterestRate}
                    totalCashValue={stats.totalCashValue}
                />
            )}
        </div>
    );
};


const EnlightenmentContent = ({ modules }) => {
    const [selectedModule, setSelectedModule] = useState(null);

    return (
        <div className="main-content anim-fade-in" style={{ width: '100%', gridColumn: 'span 2' }}>
            <h2 className="card-title">
                <BookOpen size={24} color="#d4af37" />
                Enlightenment Hub
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {modules.map((module) => (
                    <div key={module.id} className="glass-panel anim-fade-in">
                        <div className="badge badge-gold" style={{ marginBottom: '1rem' }}>{module.tag}</div>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>{module.title}</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.7' }}>{module.content}</p>
                        <button
                            onClick={() => setSelectedModule(module)}
                            style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid var(--accent-gold-glow)', color: 'var(--accent-gold)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Deep Dive Guide
                        </button>
                    </div>
                ))}
            </div>

            <DeepDiveModal
                isOpen={!!selectedModule}
                onClose={() => setSelectedModule(null)}
                module={selectedModule}
            />
        </div>
    );
};


function App() {
    const [theme, setTheme] = useState(localStorage.getItem('trust_theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('trust_theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    const [activeTab, setActiveTab] = useState('overview');
    const [trust, setTrust] = useState(trustData);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [editingPolicyData, setEditingPolicyData] = useState(null);
    const [ledgerPolicy, setLedgerPolicy] = useState(null); // The policy currently viewed in the ledger modal
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

    React.useEffect(() => {
        const initDB = async () => {
            const savedData = await loadTrustData();
            if (savedData) {
                setTrust(savedData);
            }
            setIsDataLoaded(true);
        };
        initDB();
    }, []);

    const [isSuccessorModalOpen, setIsSuccessorModalOpen] = useState(false);
    const [currentHashKey, setCurrentHashKey] = useState('');

    const handleGenerateHashKey = async () => {
        try {
            const key = await generateHashKey(trust);
            setCurrentHashKey(key);
            setIsSuccessorModalOpen(true);
        } catch (e) {
            alert("Failed to generate Hash Key");
        }
    };


    React.useEffect(() => {
        if (isDataLoaded) {
            saveTrustData(trust);
        }
    }, [trust, isDataLoaded]);

    const aggregateStats = React.useMemo(() => {
        if (!trust.policies || trust.policies.length === 0) return { totalCashValue: 0, deathBenefit: 0, maxLoanAmount: 0, loanInterestRate: 4.5 };

        let totalCashValue = 0;
        let deathBenefit = 0;
        let maxLoanRate = 0;

        trust.policies.forEach(p => {
            // Find latest TRUE_UP for current real values
            let currentCV = p.cashValue || 0;
            let currentDB = p.deathBenefit || 0;
            if (p.transactions && p.transactions.length > 0) {
                const trueUps = p.transactions.filter(t => t.type === 'TRUE_UP').sort((a, b) => new Date(b.date) - new Date(a.date));
                if (trueUps.length > 0) {
                    currentCV = trueUps[0].cashValue;
                    currentDB = trueUps[0].deathBenefit;
                }
            }
            totalCashValue += currentCV;
            deathBenefit += currentDB;
            if (p.loanInterestRate > maxLoanRate) maxLoanRate = p.loanInterestRate;
        });

        return {
            totalCashValue,
            deathBenefit,
            maxLoanAmount: Math.floor(totalCashValue * 0.9),
            loanInterestRate: maxLoanRate || 4.5
        };
    }, [trust.policies]);

    // Dynamic Projection Generator
    const generateDynamicProjection = React.useCallback((policy) => {
        const projectionData = [];

        // Find latest true up baseline
        let baselineDate = new Date(policy.issueDate);
        let currentCash = policy.cashValue || 0;
        let currentDeath = policy.deathBenefit || 0;
        let cumulativePremium = 0;

        if (policy.transactions && policy.transactions.length > 0) {
            // Calculate total premiums paid up to baseline
            const premiums = policy.transactions.filter(t => t.type === 'PREMIUM');
            cumulativePremium = premiums.reduce((sum, t) => sum + t.amount, 0);

            const trueUps = policy.transactions.filter(t => t.type === 'TRUE_UP').sort((a, b) => new Date(b.date) - new Date(a.date));
            if (trueUps.length > 0) {
                baselineDate = new Date(trueUps[0].date);
                currentCash = trueUps[0].cashValue;
                currentDeath = trueUps[0].deathBenefit;
            }
        }

        const startYear = baselineDate.getFullYear();
        const basePremium = policy.baseAnnualPremium || 0;
        const puaPremium = policy.plannedAnnualPUA || 0;
        const totalAnnualPremium = basePremium + puaPremium;

        // Project 30 years forward from baseline year
        for (let i = 0; i < 30; i++) {
            const year = startYear + i;
            if (i > 0) {
                // Growth heuristic: 5% on cash + 100% of PUA + 70% of base
                currentCash = (currentCash * 1.05) + puaPremium + (basePremium * 0.7);
                currentDeath = currentDeath * 1.02;
                cumulativePremium += totalAnnualPremium;
            }
            projectionData.push({
                name: `${year}`,
                cash: Math.floor(currentCash),
                death: Math.floor(currentDeath),
                premium: Math.floor(cumulativePremium)
            });
        }
        return projectionData;
    }, []);

    const aggregateProjection = React.useMemo(() => {
        if (!trust.policies || trust.policies.length === 0) return [];
        const combined = {};

        trust.policies.forEach(p => {
            const dynamicData = generateDynamicProjection(p);
            dynamicData.forEach(pt => {
                if (!combined[pt.name]) combined[pt.name] = { name: pt.name, cash: 0, death: 0, premium: 0 };
                combined[pt.name].cash += pt.cash;
                combined[pt.name].death += pt.death;
                combined[pt.name].premium += pt.premium;
            });
        });

        return Object.values(combined).sort((a, b) => {
            return parseInt(a.name) - parseInt(b.name);
        });
    }, [trust.policies, generateDynamicProjection]);

    const handleSavePolicy = (policyData) => {
        setTrust(prev => {
            const existingPolicies = prev.policies || [];
            if (policyData.id) {
                // Editing existing
                return {
                    ...prev,
                    policies: existingPolicies.map(p => p.id === policyData.id ? { ...p, ...policyData } : p)
                };
            } else {
                // Adding new
                const generatedId = `pol_${Math.floor(Math.random() * 10000)}`;
                const newPolicy = {
                    ...policyData,
                    id: generatedId,
                    transactions: [
                        {
                            id: `tx_${Date.now()}`,
                            type: 'TRUE_UP',
                            date: policyData.issueDate,
                            cashValue: policyData.cashValue,
                            deathBenefit: policyData.deathBenefit,
                            note: 'Initial Policy Link'
                        }
                    ]
                };
                return {
                    ...prev,
                    policies: [...existingPolicies, newPolicy]
                };
            }
        });
        setIsPolicyModalOpen(false);
        setEditingPolicyData(null);
    };

    const handleDeletePolicy = (id) => {
        setTrust(prev => ({
            ...prev,
            policies: (prev.policies || []).filter(p => p.id !== id)
        }));
    };

    const handleAddTransaction = (policyId, transaction) => {
        setTrust(prev => {
            const policies = prev.policies.map(p => {
                if (p.id === policyId) {
                    return {
                        ...p,
                        transactions: [...(p.transactions || []), transaction]
                    };
                }
                return p;
            });
            // Update the currently viewed ledger policy state too if it matches
            if (ledgerPolicy && ledgerPolicy.id === policyId) {
                setLedgerPolicy(policies.find(p => p.id === policyId));
            }
            return { ...prev, policies };
        });
    };

    return (
        <div className="app-container">
            <nav className="navbar anim-fade-in" style={{ position: 'relative' }}>
                <div className="logo" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
                    <Landmark size={28} />
                    <span className="premium-text">TRUST WIZARD</span>
                </div>
                <div className="mobile-only">
                    <button onClick={() => setIsNavMenuOpen(!isNavMenuOpen)} className="action-btn" style={{ padding: '0.4rem' }}>
                        {isNavMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <div className={`nav-links ${isNavMenuOpen ? 'mobile-open' : ''}`}>
                    <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => { setActiveTab('overview'); setIsNavMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>DASHBOARD</button>
                    <button className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => { setActiveTab('documents'); setIsNavMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>DOCUMENTS</button>
                    <button className={`nav-link ${activeTab === 'funding' ? 'active' : ''}`} onClick={() => { setActiveTab('funding'); setIsNavMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>FUNDING</button>
                    <button className={`nav-link ${activeTab === 'enlightenment' ? 'active' : ''}`} onClick={() => { setActiveTab('enlightenment'); setIsNavMenuOpen(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>ENLIGHTENMENT</button>
                </div>
                <div className="glass-panel desktop-only" style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="#d4af37" />
                    <span style={{ color: '#94a3b8' }}>Secure Session</span>
                </div>
            </nav>

            <SuccessorExportModal
                isOpen={isSuccessorModalOpen}
                onClose={() => setIsSuccessorModalOpen(false)}
                hashKey={currentHashKey}
            />

            <div className="dashboard-grid">
                {activeTab === 'overview' && (
                    <>
                        <OverviewContent
                            data={aggregateProjection}
                            stats={aggregateStats}
                            policies={trust.policies}
                            onAddPolicy={() => { setEditingPolicyData(null); setIsPolicyModalOpen(true); }}
                            onEditPolicy={(p) => { setEditingPolicyData(p); setIsPolicyModalOpen(true); }}
                            onDeletePolicy={handleDeletePolicy}
                            onOpenLedger={(policy) => setLedgerPolicy(policy)}
                            onTakeOver={(data) => {
                                setTrust(data);
                                alert("Trust Manager state successfully updated from Hash Key.");
                            }}
                        />
                        <div className="sidebar anim-fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="glass-panel" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, var(--insight-bg-end) 100%)' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info size={18} color="#d4af37" />
                                    Wizard Insight
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                                    "Your current aggregated cash value allows for a collateralized loan of up to <strong>${aggregateStats.maxLoanAmount.toLocaleString()}</strong> at your max {aggregateStats.loanInterestRate}% interest rate, while your full ${Math.floor(aggregateStats.totalCashValue / 1000)}k continues to earn dividends."
                                </p>
                                <button
                                    onClick={() => setActiveTab('funding')}
                                    style={{
                                        marginTop: '1.5rem',
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: 'var(--accent-gold)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#0c0e12',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem'
                                    }}>
                                    <Wallet size={18} />
                                    Explore Borrowing
                                </button>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <ComplianceTracker />
                            </div>

                            <div className="glass-panel">
                                <h3 className="card-title">
                                    <BookOpen size={20} color="#d4af37" />
                                    Latest Knowledge
                                </h3>
                                <div className="enlightenment-hub">
                                    {educationalModules.slice(0, 2).map((guide, i) => (
                                        <div key={i} className="guide-card" onClick={() => setActiveTab('enlightenment')}>
                                            <div className="badge badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{guide.tag}</div>
                                            <div className="guide-title">{guide.title}</div>
                                            <div className="guide-desc">{guide.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'documents' && (
                    <DocumentsContent
                        documents={trust.documents}
                        onUpdateDocuments={(docs) => setTrust(prev => ({ ...prev, documents: docs }))}
                        onGenerateSuccessorKey={handleGenerateHashKey}
                    />
                )}
                {activeTab === 'enlightenment' && <EnlightenmentContent modules={educationalModules} />}
                {activeTab === 'funding' && <FundingContent stats={aggregateStats} />}

            </div>

            <footer className="app-footer anim-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="footer-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
                        <Landmark size={18} />
                        <span style={{ fontWeight: 600, letterSpacing: '1px' }}>TRUST WIZARD</span>
                    </div>
                    <div className="footer-links">
                        <span>&copy; {new Date().getFullYear()} Logic Wizards</span>
                        <span className="divider">•</span>
                        <span>For Educational and Administrative Purposes Only</span>
                        <span className="divider">•</span>
                        <span>Not Legal or Financial Advice</span>
                        <span className="divider">•</span>
                        <button
                            onClick={toggleTheme}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: 'transparent', border: '1px solid var(--glass-border)',
                                padding: '0.35rem 0.75rem', borderRadius: '16px', color: 'var(--text-main)',
                                cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.8rem',
                                outline: 'none'
                            }}
                            className="theme-toggle-btn"
                        >
                            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </button>
                    </div>
                </div>
            </footer>

            <PolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => { setIsPolicyModalOpen(false); setEditingPolicyData(null); }}
                onSave={handleSavePolicy}
                initialData={editingPolicyData}
            />

            <PolicyLedgerModal
                isOpen={!!ledgerPolicy}
                policy={ledgerPolicy}
                onClose={() => setLedgerPolicy(null)}
                onAddTransaction={handleAddTransaction}
            />
        </div>
    );
}

export default App;

