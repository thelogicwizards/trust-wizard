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
    { year: '2000', rate: 7.80 },
    { year: '2002', rate: 7.10 },
    { year: '2004', rate: 6.80 },
    { year: '2006', rate: 6.90 },
    { year: '2008', rate: 6.50 },
    { year: '2010', rate: 6.00 },
    { year: '2012', rate: 5.80 },
    { year: '2014', rate: 5.60 },
    { year: '2016', rate: 5.50 },
    { year: '2018', rate: 5.60 },
    { year: '2020', rate: 5.40 },
    { year: '2022', rate: 5.30 },
    { year: '2024', rate: 5.50 },
    { year: '2026', rate: 5.75 }
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel" style={{ padding: '1rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                <p className="premium-text" style={{ color: '#d4af37', marginBottom: '0.5rem', fontWeight: 600 }}>{`Year ${label}`}</p>
                <p style={{ fontSize: '0.85rem' }}>Industry Avg. Dividend Rate: <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{payload[0].value}%</span></p>
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
                            domain={[4.0, 8.5]}
                            stroke="#4a5568"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value.toFixed(1)}%`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke="#d4af37"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0c0e12', stroke: '#d4af37', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#d4af37', stroke: '#fff' }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DividendChart;
