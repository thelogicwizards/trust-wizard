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
    Trash2,
    Printer
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
import { loadTrustData, saveTrustData } from './utils/storage';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel" style={{ padding: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <p className="premium-text" style={{ color: '#d4af37', marginBottom: '0.5rem', fontWeight: 600 }}>{label}</p>
                <p style={{ fontSize: '0.85rem' }}>Cash Value: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${payload[0].value.toLocaleString()}</span></p>
                <p style={{ fontSize: '0.85rem' }}>Death Benefit: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${payload[1].value.toLocaleString()}</span></p>
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
                            color: '#fff',
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
const PolicyModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        carrier: '',
        insured: '',
        cashValue: '',
        deathBenefit: '',
        loanInterestRate: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            carrier: formData.carrier || 'Unknown Carrier',
            insured: formData.insured || 'Unknown Insured',
            cashValue: Number(formData.cashValue) || 0,
            deathBenefit: Number(formData.deathBenefit) || 0,
            loanInterestRate: Number(formData.loanInterestRate) || 0,
        });
        setFormData({ carrier: '', insured: '', cashValue: '', deathBenefit: '', loanInterestRate: '' });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass-panel modal-content anim-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, color: '#fff' }}>Link New Policy</h3>
                    <button onClick={onClose} className="icon-btn" type="button"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Carrier Name</label>
                        <input type="text" value={formData.carrier} onChange={e => setFormData({ ...formData, carrier: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Insured Person</label>
                        <input type="text" value={formData.insured} onChange={e => setFormData({ ...formData, insured: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Cash Value ($)</label>
                        <input type="number" value={formData.cashValue} onChange={e => setFormData({ ...formData, cashValue: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Death Benefit ($)</label>
                        <input type="number" value={formData.deathBenefit} onChange={e => setFormData({ ...formData, deathBenefit: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Loan Interest Rate (%)</label>
                        <input type="number" step="0.1" value={formData.loanInterestRate} onChange={e => setFormData({ ...formData, loanInterestRate: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }} required />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '1rem', background: 'var(--accent-gold)', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>Save Policy</button>
                </form>
            </div>
        </div>
    );
};

const OverviewContent = ({ data, stats, policies, onAddPolicy, onDeletePolicy }) => (
    <div className="main-content anim-fade-in">

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
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.1rem' }}>{p.carrier} <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 400 }}>({p.id})</span></div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Insured: {p.insured} • Loan Rate: {p.loanInterestRate}%</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>CV: ${p.cashValue.toLocaleString()}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>DB: ${p.deathBenefit.toLocaleString()}</div>
                            </div>
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
                ))}
                {(!policies || policies.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No policies linked to this trust yet.</div>
                )}
            </div>
        </div>

        <DividendChart />
    </div>
);


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

                <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#fff' }}>{module.deepDive.title}</h2>

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
                        <h4 style={{ marginBottom: '1rem', color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                                color: '#fff'
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
                            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}
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
            const fileUrl = URL.createObjectURL(selectedFile);
            onSave({
                name,
                category,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                size: (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
                fileUrl,
                fileName: selectedFile.name,
                fileType: selectedFile.type
            });
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
                                color: '#fff'
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
                                color: '#fff'
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
                            style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const DocumentsContent = ({ documents, onUpdateDocuments }) => {
    const [filter, setFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);

    // New Modal States
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [isLoadStateModalOpen, setIsLoadStateModalOpen] = useState(false);
    const [isUnsupportedStateModalOpen, setIsUnsupportedStateModalOpen] = useState(false);
    const [unsupportedStateName, setUnsupportedStateName] = useState('');
    const [stateInput, setStateInput] = useState('');


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
            window.open(doc.fileUrl, '_blank');
        } else {
            alert('This is a mock document. Please upload a real file to use the view feature.');
        }
    };

    const handlePrintPortfolio = (selectedState) => {
        const printWindow = window.open('', '_blank');
        const tocHtml = documents.map((doc, index) => `
            <div class="print-toc-item">
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
                        <div style="padding: 4rem; border: 1px dashed #888; text-align: center; background: #fafafa;">
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

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Trust Document Portfolio - ${selectedState}</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 2cm; color: #000; background: #fff; }
                    .print-header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 2rem; padding-bottom: 1rem; }
                    .judicial-note { font-style: italic; margin-bottom: 2rem; font-size: 0.9rem; color: #333; }
                    .toc-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 1.5rem; text-decoration: underline; }
                    .print-toc-item { display: flex; justify-content: space-between; border-bottom: 1px dotted #888; padding: 0.5rem 0; }
                    .legal-page { page-break-after: always; }
                    .footer { margin-top: 4rem; font-size: 0.8rem; text-align: center; border-top: 1px solid #ccc; padding-top: 1rem; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer;">Print Now</button>
                    <button onclick="window.close()" style="padding: 10px 20px; cursor: pointer; margin-left:10px;">Close Window</button>
                </div>
                <div class="legal-page">
                    <div class="print-header">
                        <h1>OFFICIAL TRUST DOCUMENT PORTFOLIO</h1>
                        <p>Prepared for Judicial Recording: ${selectedState} Superior Court Systems</p>
                    </div>
                    <div class="judicial-note">
                        <strong>LEGAL NOTICE:</strong> This portfolio constitutes a certified index and physical compilation of documents pertaining to the Trust. 
                        This record is intended for physical filing and verification within the judicial recording offices of the State of ${selectedState}.
                    </div>
                    <div class="toc-title">TABLE OF CONTENTS</div>
                    ${tocHtml}
                </div>
                ${docsHtml}
                <div class="footer">
                    Generated by Trust Agent Premium Portfolio System • ${new Date().toLocaleDateString()}
                    <br/>Digital Verification ID: TA-${Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        setIsPrintModalOpen(false);
    };


    const filteredDocs = filter === 'All' ? documents : documents.filter(d => d.category === filter);


    return (
        <div className="main-content anim-fade-in" style={{ width: '100%', gridColumn: 'span 2' }}>
            <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className="card-title" style={{ margin: 0 }}>
                        <FileText size={20} color="#d4af37" />
                        Trust Document Vault
                    </h2>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={handleRestoreDefaults}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    padding: '0.4rem 1rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <History size={16} /> Restore Defaults
                            </button>
                            <button
                                onClick={handleLoadStateTemplates}
                                style={{
                                    background: 'rgba(14, 165, 233, 0.15)',
                                    border: '1px solid rgba(14, 165, 233, 0.4)',
                                    borderRadius: '8px',
                                    color: '#38bdf8',
                                    padding: '0.4rem 1rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <Landmark size={16} /> Load State Templates
                            </button>
                            <button
                                onClick={() => setIsPrintModalOpen(true)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    padding: '0.4rem 1rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <Printer size={16} /> Print Portfolio
                            </button>

                            <button
                                onClick={handleAdd}
                                style={{
                                    background: 'var(--accent-gold)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#000',
                                    padding: '0.4rem 1rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <Plus size={16} /> Add Document
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

            <PrintSettingsModal
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                onGenerate={handlePrintPortfolio}
            />

            {/* Restore Defaults Modal */}
            {isRestoreModalOpen && (
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
                                style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Load State Templates Modal */}
            {isLoadStateModalOpen && (
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
                                    color: '#fff',
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
                                    style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Unsupported State Modal */}
            {isUnsupportedStateModalOpen && (
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
                            <p style={{ fontSize: '0.85rem', color: '#fff', margin: 0 }}>
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
            )}
        </div>
    );
};



const FundingContent = ({ stats }) => {
    const [showCalculator, setShowCalculator] = useState(false);

    return (
        <div className="main-content anim-fade-in" style={{ width: '100%', gridColumn: 'span 2' }}>
            <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(23, 27, 34, 0.7) 100%)', marginBottom: showCalculator ? '2rem' : '0' }}>
                <h2 className="card-title">
                    <Wallet size={24} color="#d4af37" />
                    Funding Mastery
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
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
                                className="nav-link active"
                                style={{ padding: '0.75rem 2rem', background: 'var(--accent-gold)', color: '#000', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
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
                        <h3 style={{ marginBottom: '1rem', color: '#fff' }}>{module.title}</h3>
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

            <CrummeyNoticeGenerator />

            <DeepDiveModal
                isOpen={!!selectedModule}
                onClose={() => setSelectedModule(null)}
                module={selectedModule}
            />
        </div>
    );
};


function App() {
    const [activeTab, setActiveTab] = useState('overview');
    const [trust, setTrust] = useState(trustData);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

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

    React.useEffect(() => {
        if (isDataLoaded) {
            saveTrustData(trust);
        }
    }, [trust, isDataLoaded]);

    const aggregateStats = React.useMemo(() => {
        if (!trust.policies || trust.policies.length === 0) return { totalCashValue: 0, deathBenefit: 0, maxLoanAmount: 0, loanInterestRate: 4.5 };
        const totalCashValue = trust.policies.reduce((sum, p) => sum + p.cashValue, 0);
        const deathBenefit = trust.policies.reduce((sum, p) => sum + p.deathBenefit, 0);
        const loanInterestRate = trust.policies.reduce((max, p) => Math.max(max, p.loanInterestRate), 0) || 4.5;

        return {
            totalCashValue,
            deathBenefit,
            maxLoanAmount: Math.floor(totalCashValue * 0.9),
            loanInterestRate
        };
    }, [trust.policies]);

    const aggregateProjection = React.useMemo(() => {
        if (!trust.policies || trust.policies.length === 0) return [];
        const combined = {};
        trust.policies.forEach(p => {
            if (p.projectionData) {
                p.projectionData.forEach(pt => {
                    if (!combined[pt.name]) combined[pt.name] = { name: pt.name, cash: 0, death: 0 };
                    combined[pt.name].cash += pt.cash;
                    combined[pt.name].death += pt.death;
                });
            }
        });
        return Object.values(combined);
    }, [trust.policies]);

    const handleSavePolicy = (policyData) => {
        const generatedId = `pol_${Math.floor(Math.random() * 10000)}`;
        const cv = policyData.cashValue;
        const db = policyData.deathBenefit;
        const projectionData = [
            { name: "Year 1", cash: cv * 1.05, death: db * 1.01 },
            { name: "Year 3", cash: cv * 1.15, death: db * 1.03 },
            { name: "Year 5", cash: cv * 1.30, death: db * 1.05 },
            { name: "Year 7", cash: cv * 1.45, death: db * 1.07 },
            { name: "Year 10", cash: cv * 1.70, death: db * 1.10 },
            { name: "Year 15", cash: cv * 2.20, death: db * 1.15 },
            { name: "Year 20", cash: cv * 2.80, death: db * 1.25 }
        ];

        const newPolicy = {
            id: generatedId,
            ...policyData,
            projectionData
        };
        setTrust(prev => ({
            ...prev,
            policies: [...(prev.policies || []), newPolicy]
        }));
        setIsPolicyModalOpen(false);
    };

    const handleDeletePolicy = (id) => {
        setTrust(prev => ({
            ...prev,
            policies: (prev.policies || []).filter(p => p.id !== id)
        }));
    };

    return (
        <div className="app-container">
            <nav className="navbar anim-fade-in">
                <div className="logo" onClick={() => setActiveTab('overview')} style={{ cursor: 'pointer' }}>
                    <Landmark size={28} />
                    <span className="premium-text">TRUST WIZARD</span>
                </div>
                <div className="nav-links">
                    <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>DASHBOARD</button>
                    <button className={`nav-link ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>DOCUMENTS</button>
                    <button className={`nav-link ${activeTab === 'funding' ? 'active' : ''}`} onClick={() => setActiveTab('funding')} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>FUNDING</button>
                    <button className={`nav-link ${activeTab === 'enlightenment' ? 'active' : ''}`} onClick={() => setActiveTab('enlightenment')} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>ENLIGHTENMENT</button>
                </div>
                <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={16} color="#d4af37" />
                    <span style={{ color: '#94a3b8' }}>Secure Session</span>
                </div>
            </nav>

            <main className="dashboard-grid">
                {activeTab === 'overview' && (
                    <>
                        <OverviewContent
                            data={aggregateProjection}
                            stats={aggregateStats}
                            policies={trust.policies}
                            onAddPolicy={() => setIsPolicyModalOpen(true)}
                            onDeletePolicy={handleDeletePolicy}
                        />
                        <div className="sidebar anim-fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="glass-panel" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(23, 27, 34, 0.7) 100%)' }}>
                                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info size={18} color="#d4af37" />
                                    Wizard Insight
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
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
                    />
                )}
                {activeTab === 'enlightenment' && <EnlightenmentContent modules={educationalModules} />}
                {activeTab === 'funding' && <FundingContent stats={aggregateStats} />}

            </main>

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
                    </div>
                </div>
            </footer>

            <PolicyModal
                isOpen={isPolicyModalOpen}
                onClose={() => setIsPolicyModalOpen(false)}
                onSave={handleSavePolicy}
            />
        </div>
    );
}

export default App;

