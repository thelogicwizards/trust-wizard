import React, { useState, useRef, useEffect } from 'react';
import { X, FileText, Camera, Check, Printer, ArrowRight } from 'lucide-react';

const DOCUMENT_TEMPLATES = {
    "Certificate of Trust": {
        title: "Certification of Trust",
        description: "Enter the details to automatically generate a standard Certification of Trust.",
        fields: [
            { name: 'trustName', label: 'Formal Trust Name', placeholder: 'e.g. The Smith Family Trust', type: 'text' },
            { name: 'trusteeName', label: 'Successor / Current Trustee Name', placeholder: 'e.g. John Doe', type: 'text' },
            { name: 'dateAffirmed', label: 'Date of Execution', placeholder: '', type: 'date' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certification of Trust</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }
                    h1 { text-align: center; text-transform: uppercase; margin-bottom: 2rem; text-decoration: underline; }
                    p { margin-bottom: 1rem; text-align: justify; }
                    .signature-block { margin-top: 4rem; width: 300px; border-top: 1px solid #000; padding-top: 0.5rem; text-align: center; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <h1>Certification of Trust</h1>
                <p><strong>Trust Name:</strong> ${data.trustName}</p>
                <p><strong>Current Trustee:</strong> ${data.trusteeName}</p>
                <p><strong>Date of Execution:</strong> ${new Date(data.dateAffirmed).toLocaleDateString()}</p>
                <p>This Certification of Trust is presented by the Trustee named above, who affirms that the Trust exists and that they possess full authority under the Trust agreement to manage, buy, sell, or otherwise transact on behalf of the Trust estate.</p>
                <p>The Trustee confirms that the Trust has not been revoked, modified, or amended in any manner that would cause the representations contained herein to be incorrect.</p>
                <p>I certify under penalty of perjury under the laws of the State that the foregoing is true and correct.</p>
                
                <div class="signature-block">
                    ${data.trusteeName}, Trustee
                </div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    "Trust Agreement - Executed": {
        title: "Trust Agreement Cover",
        description: "Generate a formal cover page for your Trust Agreement execution.",
        fields: [
            { name: 'trustName', label: 'Formal Trust Name', placeholder: 'e.g. The Smith Family Trust', type: 'text' },
            { name: 'grantorName', label: 'Grantor/Settlor Name', placeholder: 'e.g. Jane Doe', type: 'text' },
            { name: 'executionDate', label: 'Original Date of Trust', placeholder: '', type: 'date' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Trust Agreement</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; text-align: center; }
                    h1 { text-transform: uppercase; margin-top: 30%; font-size: 2.5rem; margin-bottom: 2rem; }
                    h3 { font-weight: normal; margin-bottom: 4rem; }
                    p { font-size: 1.2rem; margin-bottom: 1rem; }
                    @media print { body { padding: 0; } }
                </style>
            </head>
            <body>
                <h1>${data.trustName}</h1>
                <h3>A Revocable Living Trust</h3>
                <p><strong>Created By:</strong><br>${data.grantorName}, Grantor</p>
                <p style="margin-top: 4rem;"><strong>Dated:</strong><br>${new Date(data.executionDate).toLocaleDateString()}</p>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    "SS-4 Form (EIN)": {
        title: "SS-4 Form Reference",
        description: "Generate an EIN application reference record.",
        fields: [
            { name: 'trustName', label: 'Name of Trust', placeholder: '', type: 'text' },
            { name: 'trusteeName', label: 'Responsible Party (Trustee)', placeholder: '', type: 'text' },
            { name: 'ssn', label: 'Responsible Party SSN/ITIN', placeholder: 'XXX-XX-XXXX', type: 'text' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head><title>SS-4 Application Record</title><style>body { font-family: 'Times New Roman', serif; padding: 2rem; line-height: 1.6; } h2 { text-align: center; }</style></head>
            <body>
                <h2>Application for Employer Identification Number (Record)</h2>
                <p><strong>1. Legal name of entity:</strong> ${data.trustName}</p>
                <p><strong>2. Trade name of business:</strong> N/A</p>
                <p><strong>3. Executor, administrator, trustee:</strong> ${data.trusteeName}</p>
                <p><strong>4. SSN, ITIN, or EIN:</strong> ${data.ssn}</p>
                <br/><hr/><br/>
                <p><em>Note: This is an internal trust record representing the data submitted to the IRS via Form SS-4.</em></p>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    "Schedule A (Initial Assets)": {
        title: "Schedule A",
        description: "Generate the Schedule of Initial Assets funded into the Trust.",
        fields: [
            { name: 'trustName', label: 'Trust Name', placeholder: '', type: 'text' },
            { name: 'asset1', label: 'Primary Asset (e.g., $10.00 bill)', placeholder: '', type: 'text' },
            { name: 'date', label: 'Funding Date', placeholder: '', type: 'date' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head><title>Schedule A</title><style>body { font-family: 'Times New Roman', serif; padding: 2rem; line-height: 1.6; } h2 { text-align: center; text-decoration: underline; }</style></head>
            <body>
                <h2>SCHEDULE A</h2>
                <h3 style="text-align:center;">${data.trustName}</h3>
                <p>The Grantor hereby transfers and delivers to the Trustee, and the Trustee hereby accepts receipt of, the following property to be held, administered, and distributed according to the terms of the Trust Agreement:</p>
                <ul style="margin: 2rem 0; font-size: 1.2rem;">
                    <li>${data.asset1}</li>
                </ul>
                <p>IN WITNESS WHEREOF, the Grantor and Trustee have executed this Schedule A on ${new Date(data.date).toLocaleDateString()}.</p>
                <div style="margin-top: 4rem; width: 300px; border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">Trustee Signature</div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    // State Templates
    "Trust Transfer Deed": {
        title: "Trust Transfer Deed (California)",
        description: "California specific deed transfer form.",
        fields: [
            { name: 'grantor', label: 'Grantor', placeholder: '', type: 'text' },
            { name: 'grantee', label: 'Grantee (Trust Name)', placeholder: '', type: 'text' },
            { name: 'apn', label: 'Assessor Parcel Number (APN)', placeholder: '', type: 'text' },
            { name: 'propertyDesc', label: 'Legal Property Description', placeholder: '', type: 'text' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head><title>Trust Transfer Deed</title><style>body { font-family: 'Times New Roman', serif; padding: 2rem; line-height: 1.6; } h2 { text-align: center; }</style></head>
            <body>
                <h2>TRUST TRANSFER DEED</h2>
                <p><strong>APN:</strong> ${data.apn}</p>
                <p>FOR NO CONSIDERATION, Grantor(s): <strong>${data.grantor}</strong> hereby GRANT(S) to <strong>${data.grantee}</strong>, all that real property situated in the State of California, described as follows:</p>
                <p style="margin: 2rem; padding: 1rem; border: 1px solid #ccc;">${data.propertyDesc}</p>
                <p>This conveyance transfers the grantor's interest into his or her revocable living trust, R&T 11930.</p>
                <div style="margin-top: 4rem; width: 300px; border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">Grantor Signature</div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    "Preliminary Change of Ownership Report (PCOR)": {
        title: "PCOR (California)",
        description: "California PCOR form data capture.",
        fields: [
            { name: 'apn', label: 'Assessor Parcel Number', placeholder: '', type: 'text' },
            { name: 'buyerName', label: 'Transferee/Buyer (Trust)', placeholder: '', type: 'text' },
            { name: 'sellerName', label: 'Transferor/Seller', placeholder: '', type: 'text' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head><title>PCOR</title><style>body { font-family: 'Times New Roman', serif; padding: 2rem; line-height: 1.6; } h2 { text-align: center; }</style></head>
            <body>
                <h2>PRELIMINARY CHANGE OF OWNERSHIP REPORT</h2>
                <p><strong>APN:</strong> ${data.apn}</p>
                <p><strong>Transferor:</strong> ${data.sellerName}</p>
                <p><strong>Transferee:</strong> ${data.buyerName}</p>
                <p><em>Transfer to a revocable living trust. Excluded from reappraisal under R&T 62(d).</em></p>
                <div style="margin-top: 4rem; width: 300px; border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">Transferee Signature</div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    "Notice of Trust": {
        title: "Notice of Trust (Florida)",
        description: "Florida statutory Notice of Trust.",
        fields: [
            { name: 'settlorName', label: 'Name of Settlor', placeholder: '', type: 'text' },
            { name: 'dod', label: 'Date of Death', placeholder: '', type: 'date' },
            { name: 'trustName', label: 'Name of Trust', placeholder: '', type: 'text' },
            { name: 'trusteeAddress', label: 'Trustee Address', placeholder: '', type: 'text' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head><title>Notice of Trust</title><style>body { font-family: 'Times New Roman', serif; padding: 2rem; line-height: 1.6; } h2 { text-align: center; }</style></head>
            <body>
                <h2>NOTICE OF TRUST</h2>
                <p>The trust estate of the <strong>${data.trustName}</strong>, whose settlor was <strong>${data.settlorName}</strong>, who died on <strong>${new Date(data.dod).toLocaleDateString()}</strong>, is liable for the expenses of the administration of the decedent’s estate and enforceable claims of the decedent’s creditors to the extent the decedent’s estate is insufficient to pay them, as provided in s. 733.607(2), Florida Statutes.</p>
                <p><strong>Trustee Address:</strong> ${data.trusteeAddress}</p>
                <div style="margin-top: 4rem; width: 300px; border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">Trustee Signature</div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    "Affidavit of Trust": {
        title: "Affidavit of Trust (Texas)",
        description: "Texas specific trust execution affidavit.",
        fields: [
            { name: 'trustName', label: 'Name of Trust', placeholder: '', type: 'text' },
            { name: 'affiantName', label: 'Name of Affiant', placeholder: '', type: 'text' },
            { name: 'date', label: 'Date Executed', placeholder: '', type: 'date' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head><title>Affidavit of Trust</title><style>body { font-family: 'Times New Roman', serif; padding: 2rem; line-height: 1.6; } h2 { text-align: center; }</style></head>
            <body>
                <h2>AFFIDAVIT OF TRUST</h2>
                <p>STATE OF TEXAS</p>
                <p>BEFORE ME, the undersigned authority, personally appeared <strong>${data.affiantName}</strong>, who, being fully sworn, upon oath states:</p>
                <p>1. The Trust known as <strong>${data.trustName}</strong> is currently in full force and effect.</p>
                <p>2. The Affiant is the current Trustee and possesses the powers to transact on behalf of the Trust.</p>
                <div style="margin-top: 4rem; width: 300px; border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">Affiant Signature<br/><br/>Date: ${new Date(data.date).toLocaleDateString()}</div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    },
    "Trustee Oath and Designation": {
        title: "Trustee Oath (New York)",
        description: "New York Trustee designation and oath.",
        fields: [
            { name: 'trusteeName', label: 'Name of Trustee', placeholder: '', type: 'text' },
            { name: 'trustName', label: 'Name of Trust', placeholder: '', type: 'text' },
            { name: 'address', label: 'Trustee Address', placeholder: '', type: 'text' }
        ],
        generateHTML: (data) => `
            <!DOCTYPE html>
            <html>
            <head><title>Trustee Oath and Designation</title><style>body { font-family: 'Times New Roman', serif; padding: 2rem; line-height: 1.6; } h2 { text-align: center; }</style></head>
            <body>
                <h2>OATH AND DESIGNATION OF TRUSTEE</h2>
                <p>STATE OF NEW YORK</p>
                <p>I, <strong>${data.trusteeName}</strong>, residing at ${data.address}, do solemnly swear that I will well, faithfully and honestly discharge the duties of Trustee of the <strong>${data.trustName}</strong>.</p>
                <p>I hereby designate the Clerk of the Court as a person on whom service of any process issuing from the Court may be made.</p>
                <div style="margin-top: 4rem; width: 300px; border-top: 1px solid #000; padding-top: 0.5rem; text-align: center;">Trustee Signature</div>
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `
    }
};

const DocumentWizard = ({ isOpen, onClose, onSave, initialDoc }) => {
    const [step, setStep] = useState(1);

    const [selectedTemplateName, setSelectedTemplateName] = useState(
        initialDoc?.name && DOCUMENT_TEMPLATES[initialDoc.name] ? initialDoc.name : "Certificate of Trust"
    );

    const activeTemplate = DOCUMENT_TEMPLATES[selectedTemplateName] || DOCUMENT_TEMPLATES["Certificate of Trust"];

    // Initialize generic form data state
    const [formData, setFormData] = useState({});

    // Populate initial form fields whenever active template changes
    useEffect(() => {
        const initialFormState = {};
        activeTemplate.fields.forEach(f => {
            if (f.type === 'date') {
                initialFormState[f.name] = new Date().toISOString().split('T')[0];
            } else {
                initialFormState[f.name] = '';
            }
        });
        setFormData(initialFormState);
    }, [selectedTemplateName]);

    // Step 3: Scanned File
    const [scannedFile, setScannedFile] = useState(null);
    const fileInputRef = useRef(null);

    const [showPrintOverlay, setShowPrintOverlay] = useState(false);

    if (!isOpen) return null;

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step > 1 ? step - 1 : 1);

    const handlePrintTemplate = () => {
        setShowPrintOverlay(true);
    };

    const renderPrintOverlay = () => {
        if (!showPrintOverlay) return null;
        
        let rawHtml = activeTemplate.generateHTML(formData);
        
        rawHtml = rawHtml.replace(/<script>window\.onload = function\(\) \{ window\.print\(\); \}<\/script>/g, '');
        rawHtml = rawHtml.replace(/<!DOCTYPE html>/gi, '');
        rawHtml = rawHtml.replace(/<html>/gi, '');
        rawHtml = rawHtml.replace(/<\/html>/gi, '');
        rawHtml = rawHtml.replace(/<body>/gi, '');
        rawHtml = rawHtml.replace(/<\/body>/gi, '');
        rawHtml = rawHtml.replace(/<head>/gi, '');
        rawHtml = rawHtml.replace(/<\/head>/gi, '');
        
        return (
            <div className="print-portfolio-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 99999, overflow: 'auto', color: '#000' }}>
                <div className="no-print" style={{ position: 'sticky', top: 0, background: 'rgba(255,255,255,0.9)', padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'flex-end', gap: '1rem', zIndex: 100000 }}>
                    <button onClick={() => window.print()} style={{ padding: '10px 20px', background: '#d4af37', border: 'none', fontWeight: 'bold', color: '#000', borderRadius: '4px', cursor: 'pointer' }}>Print Document</button>
                    <button onClick={() => setShowPrintOverlay(false)} style={{ padding: '10px 20px', background: '#e2e8f0', border: '1px solid #cbd5e1', color: '#000', borderRadius: '4px', cursor: 'pointer' }}>Close Window</button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
            </div>
        );
    };

    const handleFileCapture = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                alert('Invalid file format. Please capture/upload a JPG or PNG image.');
                return;
            }
            setScannedFile(file);
        }
    };

    const handleFinish = () => {
        if (!scannedFile) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Url = reader.result;
            onSave({
                ...(initialDoc ? { index: initialDoc.index } : {}), // Preserve index if replacing a template
                name: selectedTemplateName,
                category: initialDoc?.category || 'Legal', // Preserve category or default
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                size: (scannedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
                fileUrl: base64Url,
                fileName: scannedFile.name,
                fileType: scannedFile.type,
                isTemplate: false // No longer a template since a file is attached
            });

            // Reset and close
            setStep(1);
            setScannedFile(null);
            onClose();
        };
        reader.readAsDataURL(scannedFile);
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
            <div className="glass-panel modal-content anim-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={20} color="#d4af37" />
                        Document Creation Wizard
                    </h3>
                    <button onClick={onClose} className="icon-btn" style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(s => (
                        <div key={s} style={{ flex: 1, height: '4px', background: step >= s ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', transition: 'all 0.3s' }}></div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="wizard-step anim-fade-in">
                        <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Step 1: Select & Input Data</h4>

                        {!initialDoc && (
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Select Document Type</label>
                                <select
                                    value={selectedTemplateName}
                                    onChange={(e) => setSelectedTemplateName(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff', outline: 'none' }}
                                >
                                    {Object.keys(DOCUMENT_TEMPLATES).map(key => (
                                        <option key={key} value={key} style={{ background: '#1c1c1c' }}>{key}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{activeTemplate.description}</p>

                        <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {activeTemplate.fields.map(field => (
                                <div key={field.name} className="form-group">
                                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        className="premium-input"
                                        value={formData[field.name] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff' }}
                                        placeholder={field.placeholder}
                                    />
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button
                                disabled={activeTemplate.fields.some(f => !formData[f.name])}
                                onClick={handleNext}
                                style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: activeTemplate.fields.some(f => !formData[f.name]) ? 0.5 : 1 }}
                            >
                                Generate Form <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="wizard-step anim-fade-in">
                        <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Step 2: Print & Sign</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>A formal Trust must be physically signed to be valid. Please print the generated form, sign it on paper, and prepare to scan it back into the Vault.</p>

                        <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--glass-border)', borderRadius: '12px', textAlign: 'center', marginBottom: '2rem' }}>
                            <FileText size={48} color="var(--dim)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <h5 style={{ margin: '0 0 1rem 0', color: '#fff' }}>{activeTemplate.title} Generated</h5>
                            <button
                                onClick={handlePrintTemplate}
                                style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--accent-gold)', borderRadius: '8px', color: 'var(--accent-gold)', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Printer size={16} /> Open Print Window
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <button onClick={handleBack} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Back</button>
                            <button
                                onClick={handleNext}
                                style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                I've Printed & Signed <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="wizard-step anim-fade-in">
                        <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Step 3: Scan & Finalize</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Use your device camera to take a photo of the completed document and upload it securely to your Trust Vault.</p>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            capture="environment"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileCapture}
                        />

                        <div
                            style={{ padding: '3rem 2rem', background: scannedFile ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)', border: `1px dashed ${scannedFile ? '#10b981' : 'var(--glass-border)'}`, borderRadius: '12px', textAlign: 'center', marginBottom: '2rem', cursor: 'pointer', transition: 'all 0.3s' }}
                            onClick={() => fileInputRef.current.click()}
                        >
                            {scannedFile ? (
                                <>
                                    <Check size={48} color="#10b981" style={{ marginBottom: '1rem' }} />
                                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#10b981' }}>File Ready: {scannedFile.name}</h5>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Click to retake photo</p>
                                </>
                            ) : (
                                <>
                                    <Camera size={48} color="var(--dim)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <h5 style={{ margin: '0 0 0.5rem 0', color: '#fff' }}>Tap to Scan Signed Document</h5>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Opens device camera</p>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                            <button onClick={handleBack} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Back</button>
                            <button
                                disabled={!scannedFile}
                                onClick={handleFinish}
                                style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: !scannedFile ? 0.5 : 1 }}
                            >
                                Upload to Vault <Check size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {renderPrintOverlay()}
        </div>
    );
};

export default DocumentWizard;
