import React, { useState, useEffect } from 'react';
import localforage from 'localforage';
import { Calendar, CheckCircle, AlertTriangle, Clock, Settings, X } from 'lucide-react';

const COMPLIANCE_STORAGE_KEY = 'trust_compliance_v1';

const defaultTasks = [
    {
        id: 'crummey',
        title: 'Send Annual Crummey Letters',
        desc: 'Notify beneficiaries of their 30-day right of withdrawal for new premiums.',
        frequencyDays: 365,
        lastCompleted: null,
    },
    {
        id: 'meeting',
        title: 'Annual Trustee Meeting',
        desc: 'Log official minutes for the annual review of trust assets and insurance performance.',
        frequencyDays: 365,
        lastCompleted: null,
    },
    {
        id: 'entity_fees',
        title: 'Pay State Entity/LLC Fees',
        desc: 'Ensure the corporate veil is maintained by paying annual state filing fees.',
        frequencyDays: 365,
        lastCompleted: null,
    }
];

const ComplianceTracker = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const savedTasks = await localforage.getItem(COMPLIANCE_STORAGE_KEY);
                if (savedTasks) {
                    // Merge saved state with defaults in case we add new default tasks later
                    const mergedTasks = defaultTasks.map(defaultTask => {
                        const savedTask = savedTasks.find(t => t.id === defaultTask.id);
                        return savedTask ? { ...defaultTask, lastCompleted: savedTask.lastCompleted } : defaultTask;
                    });
                    setTasks(mergedTasks);
                } else {
                    setTasks(defaultTasks);
                }
            } catch (error) {
                console.error("Error loading compliance tasks", error);
                setTasks(defaultTasks);
            }
            setLoading(false);
        };
        loadTasks();
    }, []);

    const handleCompleteTask = async (taskId) => {
        handleManualDateChange(taskId, new Date().toISOString());
    };

    const handleManualDateChange = async (taskId, dateString) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, lastCompleted: dateString } : task
        );
        setTasks(updatedTasks);
        try {
            await localforage.setItem(COMPLIANCE_STORAGE_KEY, updatedTasks);
        } catch (error) {
            console.error("Error saving compliance tasks", error);
        }
    };

    const getTaskStatus = (task) => {
        if (!task.lastCompleted) return { status: 'due', color: '#fbbf24', icon: <AlertTriangle size={18} />, text: 'Due Now' };

        const lastDate = new Date(task.lastCompleted);
        const nextDueDate = new Date(lastDate);
        nextDueDate.setDate(nextDueDate.getDate() + task.frequencyDays);

        const now = new Date();
        const daysUntilDue = Math.ceil((nextDueDate - now) / (1000 * 60 * 60 * 24));

        if (daysUntilDue < 0) {
            return { status: 'overdue', color: '#ef4444', icon: <AlertTriangle size={18} />, text: `Overdue by ${Math.abs(daysUntilDue)} days` };
        } else if (daysUntilDue <= 30) {
            return { status: 'upcoming', color: '#fbbf24', icon: <Clock size={18} />, text: `Due in ${daysUntilDue} days` };
        } else {
            return { status: 'good', color: '#10b981', icon: <CheckCircle size={18} />, text: `Up to date (Next: ${nextDueDate.toLocaleDateString()})` };
        }
    };

    if (loading) return null;

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Calendar size={24} color="#d4af37" />
                    <h2 className="card-title" style={{ margin: 0, fontSize: '1.25rem' }}>Annual Compliance</h2>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="icon-btn"
                    style={{ padding: '0.4rem', border: 'none', background: showSettings ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                    title="Tracker Settings"
                >
                    {showSettings ? <X size={18} /> : <Settings size={18} />}
                </button>
            </div>

            {showSettings ? (
                <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        Manually adjust the last completed date for each compliance task.
                    </p>
                    {tasks.map(task => (
                        <div key={`setting-${task.id}`} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '1rem',
                        }}>
                            <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem', fontWeight: 600 }}>{task.title}</label>
                            <input
                                type="date"
                                className="premium-input"
                                value={task.lastCompleted ? task.lastCompleted.split('T')[0] : ''}
                                onChange={(e) => {
                                    // Make sure we save it to the timezone appropriately
                                    let dateVal = null;
                                    if (e.target.value) {
                                        const d = new Date(e.target.value);
                                        // Adjust for local timezone offset when picking a simple date string
                                        d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
                                        dateVal = d.toISOString();
                                    }
                                    handleManualDateChange(task.id, dateVal);
                                }}
                                style={{
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    color: 'var(--text-main)',
                                    colorScheme: 'dark'
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.5rem', lineHeight: '1.5' }}>
                        Maintaining the legal boundaries of your Trust is critical for asset protection. Track your annual requirements below.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        {tasks.map(task => {
                            const statusInfo = getTaskStatus(task);
                            return (
                                <div key={task.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${statusInfo.color}40`,
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: statusInfo.color }}></div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--text-main)' }}>{task.title}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>{task.desc}</p>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: statusInfo.color, fontWeight: 600 }}>
                                                {statusInfo.icon}
                                                {statusInfo.text}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleCompleteTask(task.id)}
                                            title="Mark Completed Today"
                                            style={{
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: '8px',
                                                color: 'var(--text-main)',
                                                padding: '0.5rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'; e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
                                            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.color = '#fff'; }}
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplianceTracker;
