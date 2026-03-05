import React, { useState, useEffect } from 'react';
import { getTimeline } from '../services/api';
import { Clock, FileText, Music, Image as ImgIcon, File } from 'lucide-react';
import { motion } from 'framer-motion';

const TimelinePage = () => {
    const [memories, setMemories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const res = await getTimeline();
                setMemories(res.data);
            } catch (err) {
                console.error("Timeline error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'pdf': return <FileText size={18} color="#00f2ff" />;
            case 'image': return <ImgIcon size={18} color="#10b981" />;
            case 'voice': return <Music size={18} color="#f59e0b" />;
            default: return <File size={18} color="#7000ff" />;
        }
    };

    if (loading) return <div className="text-center py-20">Reconstructing Timeline...</div>;

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Memory Timeline</h1>
                <p style={{ color: 'var(--text-secondary)' }}>A chronological history of your stored knowledge.</p>
            </header>

            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '0', top: '0', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, var(--accent-primary), var(--accent-secondary), transparent)' }}></div>

                {memories.map((memory, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ position: 'relative', marginBottom: '2.5rem' }}
                    >
                        {/* Dot */}
                        <div style={{ position: 'absolute', left: '-2.4rem', top: '0', width: '12px', height: '12px', background: 'var(--bg-dark)', border: '2px solid var(--accent-primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-primary)' }}></div>

                        <div className="glass-card" style={{ padding: '1.5rem', marginLeft: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <Clock size={14} />
                                    {new Date(memory.date).toLocaleString()}
                                </span>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', border: '1px solid var(--border-glass)', borderRadius: '12px' }}>
                                    {memory.topic}
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                                    {getIcon(memory.type)}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{memory.filename}</h3>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Recorded as {memory.type} memory</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {memories.length === 0 && (
                    <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                        <p className="text-secondary">Your timeline is empty. Start your journey by synchronising your first memory.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelinePage;
