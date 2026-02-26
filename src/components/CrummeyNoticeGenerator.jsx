import React, { useState } from 'react';
import { FileText, Printer } from 'lucide-react';

const CrummeyNoticeGenerator = () => {
    const [formData, setFormData] = useState({
        trustName: 'The Family Irrevocable Trust',
        beneficiaryName: '',
        giftAmount: '18000',
        giftDate: new Date().toISOString().split('T')[0]
    });

    const handleGenerate = () => {
        const printWindow = window.open('', '_blank');
        const currentDate = new Date().toLocaleDateString();

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Crummey Right of Withdrawal Notice</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 2cm; color: #000; line-height: 1.6; }
                    .header { text-align: center; margin-bottom: 2rem; }
                    .title { font-size: 1.5rem; font-weight: bold; text-decoration: underline; margin-bottom: 2rem; }
                    .content { margin-bottom: 2rem; text-align: justify; }
                    .signature-block { margin-top: 4rem; display: flex; justify-content: space-between; }
                    .sig-line { border-top: 1px solid #000; width: 300px; padding-top: 0.5rem; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #d4af37; border: none; font-weight: bold; cursor: pointer;">Print Notice</button>
                    <button onclick="window.close()" style="padding: 10px 20px; margin-left:10px; cursor: pointer;">Close</button>
                </div>
                
                <div class="header">
                    <h2>NOTICE OF RIGHT OF WITHDRAWAL</h2>
                    <p>Relating to <strong>${formData.trustName}</strong></p>
                </div>
                
                <div class="content">
                    <p><strong>Date:</strong> ${currentDate}</p>
                    <p><strong>To:</strong> ${formData.beneficiaryName}</p>
                    <br/>
                    <p>Dear ${formData.beneficiaryName},</p>
                    <p>This letter is to inform you that on <strong>${new Date(formData.giftDate).toLocaleDateString()}</strong>, a contribution in the amount of <strong>$${Number(formData.giftAmount).toLocaleString()}</strong> was made to the <strong>${formData.trustName}</strong> (the "Trust").</p>
                    <p>Under the terms of the Trust instrument, you are hereby granted an absolute, unqualified right to withdraw your pro-rata share of this contribution. This right of withdrawal must be exercised within thirty (30) days from the receipt of this notice.</p>
                    <p>If you fail to exercise this right of withdrawal within the specified time period, your right to withdraw this specific contribution will lapse, and the funds will remain in the Trust to be administered and distributed in accordance with the terms of the Trust agreement.</p>
                    <p>To exercise your right of withdrawal, please submit a written request to the Trustee before the expiration of the thirty-day period.</p>
                </div>
                
                <div class="signature-block">
                    <div>
                        <div class="sig-line">Trustee Signature</div>
                    </div>
                </div>

                <div style="margin-top: 6rem;">
                    <h3 style="text-decoration: underline; margin-bottom: 3rem;">ACKNOWLEDGMENT OF RECEIPT</h3>
                    <p>I, <strong>${formData.beneficiaryName}</strong>, acknowledge receipt of this Notice of Right of Withdrawal and understand my rights as described herein.</p>
                    <div class="signature-block">
                        <div>
                            <div class="sig-line">Beneficiary Signature</div>
                        </div>
                        <div>
                            <div class="sig-line">Date</div>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="glass-panel" style={{ marginTop: '2rem', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
            <h3 className="card-title">
                <FileText size={20} color="#d4af37" />
                Dynamic Legal Tool: Crummey Notice Generator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
                Generate legally formatted Crummey Notices instantly. This required documentation proves beneficiaries were notified of their withdrawal rights, securing the annual gift tax exclusion for your trust contributions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Trust Name</label>
                    <input
                        type="text"
                        value={formData.trustName}
                        onChange={(e) => setFormData({ ...formData, trustName: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Beneficiary Name</label>
                    <input
                        type="text"
                        placeholder="e.g. John Doe Jr."
                        value={formData.beneficiaryName}
                        onChange={(e) => setFormData({ ...formData, beneficiaryName: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Gift Amount ($)</label>
                    <input
                        type="number"
                        value={formData.giftAmount}
                        onChange={(e) => setFormData({ ...formData, giftAmount: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>Date of Gift</label>
                    <input
                        type="date"
                        value={formData.giftDate}
                        onChange={(e) => setFormData({ ...formData, giftDate: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }}
                    />
                </div>
            </div>

            <button
                onClick={handleGenerate}
                disabled={!formData.beneficiaryName}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: formData.beneficiaryName ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                    color: formData.beneficiaryName ? '#000' : 'var(--text-dim)',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: formData.beneficiaryName ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
            >
                <Printer size={18} />
                Generate Official Notice
            </button>
        </div>
    );
};

export default CrummeyNoticeGenerator;
