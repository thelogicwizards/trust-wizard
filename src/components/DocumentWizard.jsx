import React, { useState, useRef } from 'react';
import { X, FileText, Camera, Check, Printer, ArrowRight } from 'lucide-react';

const DocumentWizard = ({ isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);

    // Step 1: Form Data
    const [formData, setFormData] = useState({
        trustName: '',
        trusteeName: '',
        dateAffirmed: new Date().toISOString().split('T')[0]
    });

    // Step 3: Scanned File
    const [scannedFile, setScannedFile] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step > 1 ? step - 1 : 1);

    const handlePrintTemplate = () => {
        const printWindow = window.open('', '_blank');
        const printContent = `
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
                <p><strong>Trust Name:</strong> ${formData.trustName}</p>
                <p><strong>Current Trustee:</strong> ${formData.trusteeName}</p>
                <p><strong>Date of Execution:</strong> ${new Date(formData.dateAffirmed).toLocaleDateString()}</p>
                <p>This Certification of Trust is presented by the Trustee named above, who affirms that the Trust exists and that they possess full authority under the Trust agreement to manage, buy, sell, or otherwise transact on behalf of the Trust estate.</p>
                <p>The Trustee confirms that the Trust has not been revoked, modified, or amended in any manner that would cause the representations contained herein to be incorrect.</p>
                <p>I certify under penalty of perjury under the laws of the State that the foregoing is true and correct.</p>
                
                <div class="signature-block">
                    ${formData.trusteeName}, Trustee
                </div>
                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
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
                name: 'Certification of Trust',
                category: 'Legal',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                size: (scannedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
                fileUrl: base64Url,
                fileName: scannedFile.name,
                fileType: scannedFile.type
            });

            // Reset and close
            setStep(1);
            setFormData({ trustName: '', trusteeName: '', dateAffirmed: '' });
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
                        <h4 style={{ marginBottom: '1rem', color: '#fff' }}>Step 1: Input Trust Details</h4>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Enter the details to automatically generate a standard Certification of Trust.</p>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Formal Trust Name</label>
                            <input
                                type="text"
                                className="premium-input"
                                value={formData.trustName}
                                onChange={(e) => setFormData({ ...formData, trustName: e.target.value })}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff' }}
                                placeholder="e.g. The Smith Family Trust"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Successor / Current Trustee Name</label>
                            <input
                                type="text"
                                className="premium-input"
                                value={formData.trusteeName}
                                onChange={(e) => setFormData({ ...formData, trusteeName: e.target.value })}
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: '#fff' }}
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                            <button
                                disabled={!formData.trustName || !formData.trusteeName}
                                onClick={handleNext}
                                style={{ padding: '0.75rem 1.5rem', background: 'var(--accent-gold)', border: 'none', borderRadius: '8px', color: '#000', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (!formData.trustName || !formData.trusteeName) ? 0.5 : 1 }}
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
                            <h5 style={{ margin: '0 0 1rem 0', color: '#fff' }}>Certification of Trust Generated</h5>
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
        </div>
    );
};

export default DocumentWizard;
