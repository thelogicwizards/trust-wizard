import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const dividendData = [
    { year: '2000', rate: 7.80, sp500: -9.10, event: 'Dot-com Bubble' },
    { year: '2002', rate: 7.10, sp500: -22.10, event: 'Market Downturn' },
    { year: '2004', rate: 6.80, sp500: 10.88 },
    { year: '2006', rate: 6.90, sp500: 15.79 },
    { year: '2008', rate: 6.50, sp500: -38.49, event: 'Great Recession' },
    { year: '2010', rate: 6.00, sp500: 15.06 },
    { year: '2012', rate: 5.80, sp500: 16.00 },
    { year: '2014', rate: 5.60, sp500: 13.69 },
    { year: '2016', rate: 5.50, sp500: 11.96 },
    { year: '2018', rate: 5.60, sp500: -4.38 },
    { year: '2020', rate: 5.40, sp500: 18.40, event: 'COVID-19 Pandemic' },
    { year: '2022', rate: 5.30, sp500: -18.11, event: 'Inflation Shock' },
    { year: '2024', rate: 5.50, sp500: 24.23 },
    { year: '2026', rate: 5.75, sp500: 8.00 }
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="glass-panel" style={{ padding: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)', minWidth: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <p className="premium-text" style={{ color: '#d4af37', fontWeight: 600, margin: 0 }}>{`Year ${label}`}</p>
                    {data.event && (
                        <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                            {data.event}
                        </span>
                    )}
                </div>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    Dividend Rate: <span style={{ color: '#d4af37', fontWeight: 600 }}>{payload[0].value.toFixed(2)}%</span>
                </p>
                {payload[1] && (
                    <p style={{ fontSize: '0.85rem' }}>
                        S&P 500 Return: <span style={{ color: payload[1].value < 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                            {payload[1].value > 0 ? '+' : ''}{payload[1].value.toFixed(2)}%
                        </span>
                    </p>
                )}
            </div>
        );
    }
    return null;
};

const DividendChart = () => {
    return (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3 className="card-title">
                <TrendingUp size={20} color="#d4af37" />
                Historical Dividend Crediting History
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                A multi-decade view of mutually credited dividend rates relative to macro-economic events. This demonstrates the engineered stability, guaranteed floor, and non-correlated steady growth of the trust's underlying foundation.
            </p>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={dividendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="#4a5568"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            stroke="#4a5568"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value.toFixed(0)}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            name="Mutual Dividend Rate"
                            stroke="#d4af37"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0c0e12', stroke: '#d4af37', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#d4af37', stroke: '#fff' }}
                            zIndex={10}
                        />
                        <Line
                            type="monotone"
                            dataKey="sp500"
                            name="S&P 500 Return"
                            stroke="rgba(239, 68, 68, 0.5)"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            dot={false}
                            activeDot={{ r: 4, fill: '#ef4444', stroke: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DividendChart;
