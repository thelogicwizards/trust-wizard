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
    const [showIllustration, setShowIllustration] = useState(false);

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
        setShowIllustration(true);
    };

    const renderAmortizationRows = () => {
        const r = activeRate / 100 / 12;
        const n = repaymentYears * 12;
        let balance = loanAmount;
        const monthly = stats.monthlyPayment;

        const rows = [];
        for (let i = 1; i <= n; i++) {
            const interest = balance * r;
            const principal = monthly - interest;
            balance -= principal;
            if (balance < 0) balance = 0;

            rows.push(
                <tr key={i}>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{i}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>${monthly.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>${principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>${interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            );
        }
        return rows;
    };

    return (
        <>
        <div className="glass-panel anim-fade-in" style={{ background: 'var(--calculator-bg)', border: '1px solid var(--accent-gold-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, color: '#fff' }}>
                    <RefreshCcw size={20} color="#d4af37" />
                    IBC Loan Simulator
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                </div>
            </div>

            <div className="calculator-grid">
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

        {showIllustration && (
            <div className="print-portfolio-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#fff', zIndex: 9999, overflow: 'auto', padding: '2cm', color: '#000', fontFamily: "'Times New Roman', serif", lineHeight: 1.6 }}>
                <div className="no-print" style={{ marginBottom: '20px', textAlign: 'right', display: 'flex', gap: '1rem', justifyContent: 'flex-end', position: 'sticky', top: '0', background: 'rgba(255,255,255,0.9)', padding: '1rem', borderBottom: '1px solid #ccc' }}>
                    <button onClick={() => window.print()} style={{ padding: '10px 20px', cursor: 'pointer', background: '#d4af37', border: 'none', fontWeight: 'bold', color: '#000', borderRadius: '4px' }}>Print / Save PDF</button>
                    <button onClick={() => setShowIllustration(false)} style={{ padding: '10px 20px', cursor: 'pointer', background: '#e2e8f0', border: '1px solid #cbd5e1', color: '#000', borderRadius: '4px' }}>Close Window</button>
                </div>
                
                <div style={{ textAlign: 'center', borderBottom: '2px solid #000', marginBottom: '2rem', paddingBottom: '1rem' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>FORMAL LOAN ILLUSTRATION</div>
                    <div style={{ fontSize: '1.1rem', color: '#444' }}>Infinite Banking Concept (IBC) - Trust Wizard Simulation</div>
                    <div style={{ marginTop: '0.5rem' }}>Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</div>
                </div>

                <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Loan Parameters</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Requested Loan Amount</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>${loanAmount.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Total Available Collateral</div>
                            <div style={{ fontSize: '1.25rem' }}>${totalCashValue.toLocaleString()}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Simulated Annual Interest Rate</div>
                            <div style={{ fontSize: '1.25rem' }}>{activeRate.toFixed(2)}%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Amortized Repayment Term</div>
                            <div style={{ fontSize: '1.25rem' }}>{repaymentYears} Years ({repaymentYears * 12} Months)</div>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem', border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>Projected Repayment Schedule</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Estimated Monthly Payment</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>${stats.monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#555', textTransform: 'uppercase' }}>Estimated Total Interest Cost</div>
                            <div style={{ fontSize: '1.25rem' }}>${stats.totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        </div>
                    </div>
                    
                    <h4 style={{ marginTop: '2rem', marginBottom: '0.5rem' }}>Month-by-Month Amortization Schedule</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem', fontSize: '0.85rem' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>Month</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>Total Payment</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>Principal Paid</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>Interest Paid</th>
                                <th style={{ border: '1px solid #ddd', padding: '8px', background: '#f2f2f2', color: '#333', textAlign: 'center', fontWeight: 'bold' }}>Remaining Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderAmortizationRows()}
                        </tbody>
                    </table>
                </div>
                
                <div style={{ fontStyle: 'italic', fontSize: '0.85rem', marginTop: '2rem', padding: '1rem', background: '#f9f9f9', borderLeft: '4px solid #d4af37' }}>
                    <strong>LEGAL & FINANCIAL DISCLAIMER:</strong> This document is a simulation generated for administrative and educational planning purposes within the Trust Wizard System. It is NOT a binding offer of credit, nor an official illustration from your insurance carrier. The actual interest rate, dividend crediting rate, and repayment terms are subject to your specific policy provisions and carrier processing at the time the loan is formally requested.
                </div>

                <div style={{ marginTop: '4rem', fontSize: '0.8rem', textAlign: 'center', borderTop: '1px solid #ccc', paddingTop: '1rem', color: '#555' }}>
                    Prepared by Trust Wizard Premium Portfolio System<br/>
                    Simulation ID: SIM-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
            </div>
        )}
        </>
    );
};

export default BorrowingCalculator;
