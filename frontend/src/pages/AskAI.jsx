import React, { useState, useRef, useEffect } from 'react';
import { queryAI } from '../services/api';
import { Send, Bot, User, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AskAIPage = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hello! I am your Digital Second Brain. Ask me anything about your past notes, documents, or recordings.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleQuery = async (e) => {
        e.preventDefault();
        if (!input || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const res = await queryAI(input);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: res.data.answer,
                sources: res.data.sources
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', content: "I encountered an error accessing my neural network. Is the backend running?" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2rem' }}>Query Your Consciousness</h1>
            </header>

            <div
                ref={scrollRef}
                className="glass-card"
                style={{
                    flex: 1,
                    padding: '2rem',
                    overflowY: 'auto',
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}
            >
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        {msg.role === 'ai' && <div style={{ minWidth: '40px', height: '40px', background: 'var(--accent-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={24} /></div>}

                        <div style={{ maxWidth: '80%', padding: '1rem', borderRadius: '16px', background: msg.role === 'user' ? 'rgba(0, 242, 255, 0.1)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)' }}>
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{msg.content}</div>

                            {msg.sources && msg.sources.length > 0 && (
                                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', width: '100%' }}>Found in memories:</span>
                                    {msg.sources.map((src, sIdx) => (
                                        <div key={sIdx} style={{ fontSize: '0.75rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <FileText size={12} /> {src.filename}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && <div style={{ minWidth: '40px', height: '40px', background: 'var(--accent-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={24} color="#050b18" /></div>}
                    </motion.div>
                ))}
                {loading && (
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ minWidth: '40px', height: '40px', background: 'var(--accent-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" size={24} /></div>
                        <div className="glass-card" style={{ padding: '0.8rem 1.2rem', borderRadius: '16px', border: 'none' }}>AI is searching through your memories...</div>
                    </div>
                )}
            </div>

            <form onSubmit={handleQuery} style={{ display: 'flex', gap: '12px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What did I learn about blockchain last month?"
                    style={{
                        flex: 1,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: 'white',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
                <button type="submit" className="btn-primary" style={{ borderRadius: '12px', width: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default AskAIPage;
