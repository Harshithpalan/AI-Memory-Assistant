import React, { useState, useEffect } from 'react';
import { getStats, getReminders } from '../services/api';
import {
    Brain,
    Files,
    Tags,
    AlertCircle,
    TrendingUp,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState({ total_memories: 0, topics: {}, recent_uploads: [] });
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, remindersRes] = await Promise.all([getStats(), getReminders()]);
                setStats(statsRes.data);
                setReminders(remindersRes.data.reminders);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const cardVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
    };

    if (loading) return <div className="text-center py-20">Initialising Neural Links...</div>;

    return (
        <div className="animate-fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Digital Second Brain</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Your personal knowledge base, processed by AI.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div variants={cardVariants} initial="initial" animate="animate" className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Files color="#00f2ff" size={32} />
                        <span style={{ color: 'var(--text-secondary)' }}>Total Memories</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{stats.total_memories}</h2>
                </motion.div>

                <motion.div variants={cardVariants} initial="initial" animate="animate" transition={{ delay: 0.1 }} className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tags color="#7000ff" size={32} />
                        <span style={{ color: 'var(--text-secondary)' }}>Active Topics</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{Object.keys(stats.topics).length}</h2>
                </motion.div>

                <motion.div variants={cardVariants} initial="initial" animate="animate" transition={{ delay: 0.2 }} className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <AlertCircle color="#f59e0b" size={32} />
                        <span style={{ color: 'var(--text-secondary)' }}>AI Reminders</span>
                    </div>
                    <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>{reminders.length}</h2>
                </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Recent Memories */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <Clock size={20} color="var(--accent-primary)" />
                        Recent Knowledge Syncs
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.recent_uploads.map((upload, idx) => (
                            <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.95rem' }}>{upload.filename}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{upload.topic} • {new Date(upload.date).toLocaleDateString()}</p>
                                </div>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px' }}>
                                    {upload.type.toUpperCase()}
                                </span>
                            </div>
                        ))}
                        {stats.recent_uploads.length === 0 && <p className="text-secondary">No memories found. Start by uploading files or notes.</p>}
                    </div>
                </div>

                {/* Reminders / Topics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
                            <Brain size={20} color="#7000ff" />
                            Smart Reminders
                        </h3>
                        {reminders.map((rem, idx) => (
                            <div key={idx} style={{ marginBottom: '1rem', padding: '0.8rem', borderLeft: '2px solid #7000ff', background: 'rgba(112, 0, 255, 0.05)' }}>
                                <p style={{ fontSize: '0.9rem' }}>{rem.suggestion}</p>
                                <p style={{ fontSize: '0.7rem', color: '#7000ff', marginTop: '4px' }}>Trigger: {rem.context} in {rem.source_file}</p>
                            </div>
                        ))}
                        {reminders.length === 0 && <p className="text-secondary" style={{ fontSize: '0.85rem' }}>AI is scanning for tasks...</p>}
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <TrendingUp size={20} color="#10b981" />
                            Topic Distribution
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {Object.entries(stats.topics).map(([topic, count], idx) => (
                                <span key={idx} className="glass-card" style={{ padding: '4px 12px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)' }}>
                                    {topic} ({count})
                                </span>
                            ))}
                            {Object.keys(stats.topics).length === 0 && <p className="text-secondary">No topics detected yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
