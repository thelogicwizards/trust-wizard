import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, ArrowRight, RefreshCcw, TrendingUp, Shield } from 'lucide-react';

const BorrowingCalculator = ({ maxLoan, interestRate, totalCashValue }) => {
    const [loanAmount, setLoanAmount] = useState(Math.min(50000, maxLoan));
    const [repaymentYears, setRepaymentYears] = useState(5);
    const [activeRate, setActiveRate] = useState(interestRate);
    const [stats, setStats] = useState({
        monthlyPayment: 0,
        totalInterest: 0,
        remainingCashWork: 0
    });

    useEffect(() => {
        const r = activeRate / 100 / 12;
        const n = repaymentYears * 12;
        const p = loanAmount;

        const monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalInt = (monthly * n) - p;

        setStats({
            monthlyPayment: isNaN(monthly) ? 0 : monthly,
            totalInterest: isNaN(totalInt) ? 0 : totalInt,
            remainingCashWork: totalCashValue // IBC: full value still works
        });
    }, [loanAmount, repaymentYears, activeRate, totalCashValue]);

    const handleGenerateIllustration = () => {
        const printWindow = window.open('', '_blank');
        const d = new Date();

        // Generate Amortization Table
        const r = activeRate / 100 / 12;
        const n = repaymentYears * 12;
        let balance = loanAmount;
        const monthly = stats.monthlyPayment;

        let tableRows = '';
        for (let i = 1; i <= n; i++) {
            const interest = balance * r;
            const principal = monthly - interest;
            balance -= principal;
            if (balance < 0) balance = 0;

            tableRows += `
                <tr>
                    <td>${i}</td>
                    <td>$${monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>$${principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>$${interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Formal Loan Illustration - IBC</title>
                <style>
                    body { font-family: 'Times New Roman', serif; padding: 2cm; color: #000; background: #fff; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #000; margin-bottom: 2rem; padding-bottom: 1rem; }
                    .title { font-size: 1.8rem; font-weight: bold; margin-bottom: 0.5rem; }
                    .subtitle { font-size: 1.1rem; color: #444; }
                    .section { margin-bottom: 2rem; border: 1px solid #ccc; padding: 1.5rem; border-radius: 8px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                    .label { font-size: 0.9rem; font-weight: bold; color: #555; text-transform: uppercase; }
                    .value { font-size: 1.25rem; }
                    .highlight { font-size: 1.5rem; font-weight: bold; color: #000; }
                    .footer { margin-top: 4rem; font-size: 0.8rem; text-align: center; border-top: 1px solid #ccc; padding-top: 1rem; color: #555; }
                    .disclaimer { font-style: italic; font-size: 0.85rem; margin-top: 2rem; padding: 1rem; background: #f9f9f9; border-left: 4px solid #d4af37; }
                    .amortization-table { width: 100%; border-collapse: collapse; margin-top: 2rem; font-size: 0.85rem; page-break-inside: auto; }
                    .amortization-table tr { page-break-inside: avoid; page-break-after: auto; }
                    .amortization-table th, .amortization-table td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    .amortization-table th { background-color: #f2f2f2; color: #333; text-align: center; font-weight: bold; }
                    .amortization-table td:first-child { text-align: center; }    
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="no-print" style="margin-bottom: 20px; text-align: right;">
                    <button onclick="window.print()" style="padding: 10px 20px; cursor: pointer; background: #d4af37; border: none; font-weight: bold;">Print Illustration</button>
                    <button onclick="window.close()" style="padding: 10px 20px; cursor: pointer; margin-left:10px;">Close Window</button>
                </div>
                
                <div class="header">
                    <div class="title">FORMAL LOAN ILLUSTRATION</div>
                    <div class="subtitle">Infinite Banking Concept (IBC) - Trust Wizard Simulation</div>
                    <div style="margin-top: 0.5rem;">Generated on: ${d.toLocaleDateString()} at ${d.toLocaleTimeString()}</div>
                </div>

                <div class="section">
                    <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">Loan Parameters</h3>
                    <div class="grid">
                        <div>
                            <div class="label">Requested Loan Amount</div>
                            <div class="value highlight">$${loanAmount.toLocaleString()}</div>
                        </div>
                        <div>
                            <div class="label">Total Available Collateral</div>
                            <div class="value">$${totalCashValue.toLocaleString()}</div>
                        </div>
                        <div>
                            <div class="label">Simulated Annual Interest Rate</div>
                            <div class="value">${activeRate.toFixed(2)}%</div>
                        </div>
                        <div>
                            <div class="label">Amortized Repayment Term</div>
                            <div class="value">${repaymentYears} Years (${repaymentYears * 12} Months)</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">Projected Repayment Schedule</h3>
                    <div class="grid">
                        <div>
                            <div class="label">Estimated Monthly Payment</div>
                            <div class="value highlight">$${stats.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                            <div class="label">Estimated Total Interest Cost</div>
                            <div class="value">$${stats.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>
                    
                    <h4 style="margin-top: 2rem; margin-bottom: 0.5rem;">Month-by-Month Amortization Schedule</h4>
                    <table class="amortization-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Total Payment</th>
                                <th>Principal Paid</th>
                                <th>Interest Paid</th>
                                <th>Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
                
                <div class="disclaimer">
                    <strong>LEGAL & FINANCIAL DISCLAIMER:</strong> This document is a simulation generated for administrative and educational planning purposes within the Trust Wizard System. It is NOT a binding offer of credit, nor an official illustration from your insurance carrier. The actual interest rate, dividend crediting rate, and repayment terms are subject to your specific policy provisions and carrier processing at the time the loan is formally requested.
                </div>

                <div class="footer">
                    Prepared by Trust Wizard Premium Portfolio System
                    <br/>Simulation ID: SIM-${Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    return (
        <div className="glass-panel anim-fade-in" style={{ background: 'var(--calculator-bg)', border: '1px solid var(--accent-gold-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: '#fff' }}>
                    <RefreshCcw size={20} color="#d4af37" />
                    IBC Loan Simulator
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem' }}>Loan Amount</label>
                        <div style={{ position: 'relative' }}>
                            <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)' }} />
                            <input
                                type="number"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(Math.min(e.target.value, maxLoan))}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <input
                            type="range"
                            min="1000"
                            max={maxLoan}
                            step="1000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                            style={{ width: '100%', marginTop: '1rem', accentColor: 'var(--accent-gold)' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem' }}>Repayment Term (Years)</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[3, 5, 10, 15].map(y => (
                                <button
                                    key={y}
                                    onClick={() => setRepaymentYears(y)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        background: repaymentYears === y ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: repaymentYears === y ? '#000' : '#fff',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {y}Y
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', color: '#fff' }}>Simulated Policy Loan Rate</label>
                            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', fontWeight: 600 }}>{activeRate.toFixed(2)}%</span>
                        </div>
                        <input
                            type="range"
                            min="4.0"
                            max="8.0"
                            step="0.1"
                            value={activeRate}
                            onChange={(e) => setActiveRate(parseFloat(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                            <span>4.0% (Low)</span>
                            <span>8.0% (High)</span>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'rgba(212, 175, 55, 0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="stat-label" style={{ fontSize: '0.7rem', color: '#fff' }}>Estimated Monthly Repayment</div>
                        <div className="stat-value gold" style={{ fontSize: '1.8rem' }}>${stats.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#fff' }}>Total Interest Cost</span>
                            <span style={{ fontSize: '0.9rem', color: '#fff' }}>${stats.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', color: '#fff' }}>Capital Still Earning Dividends</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <TrendingUp size={14} /> ${stats.remainingCashWork.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <Shield size={16} color="var(--success)" style={{ marginTop: '2px' }} />
                            <p style={{ fontSize: '0.75rem', color: '#fff', lineHeight: '1.4' }}>
                                This loan is collateralized by your policy. Your death benefit will be adjusted by the outstanding loan balance if not repaid.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={handleGenerateIllustration}
                style={{
                    marginTop: '2rem',
                    width: '100%',
                    padding: '1rem',
                    background: 'var(--accent-gold)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                Generate Formal Illustration <ArrowRight size={18} />
            </button>
        </div>
    );
};

export default BorrowingCalculator;
