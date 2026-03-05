import React, { useState } from 'react';
import { uploadFile, uploadNote } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            await uploadFile(file);
            setStatus({ type: 'success', msg: `Successfully uploaded ${file.name}` });
            setFile(null);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to upload file. Check if backend is running.' });
        } finally {
            setLoading(false);
        }
    };

    const handleNoteUpload = async (e) => {
        e.preventDefault();
        if (!noteContent) return;
        setLoading(true);
        setStatus({ type: '', msg: '' });
        try {
            await uploadNote(noteContent, noteTitle || 'Untitled Note');
            setStatus({ type: 'success', msg: 'Note saved to memory bank' });
            setNoteTitle('');
            setNoteContent('');
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to save note.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '2.5rem' }}>Synchronise Knowledge</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Upload documents, images, or audio to your second brain.</p>
            </header>

            <AnimatePresence>
                {status.msg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card"
                        style={{
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            borderColor: status.type === 'success' ? '#10b981' : '#ef4444'
                        }}
                    >
                        {status.type === 'success' ? <CheckCircle color="#10b981" /> : <AlertCircle color="#ef4444" />}
                        <p>{status.msg}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* File Upload */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <Upload size={20} color="var(--accent-primary)" />
                        Direct Upload
                    </h3>
                    <form onSubmit={handleFileUpload}>
                        <div
                            style={{
                                border: '2px dashed var(--border-glass)',
                                borderRadius: '12px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: file ? 'rgba(0, 242, 255, 0.05)' : 'transparent'
                            }}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                style={{ display: 'none' }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                {file ? file.name : 'Click to select PDF, Image, or Audio'}
                            </p>
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                            disabled={loading || !file}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Process File'}
                        </button>
                    </form>
                </div>

                {/* Text Note */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                        <FileText size={20} color="var(--accent-secondary)" />
                        Quick Note
                    </h3>
                    <form onSubmit={handleNoteUpload}>
                        <input
                            type="text"
                            placeholder="Give your memory a title..."
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-glass)',
                                padding: '10px',
                                borderRadius: '8px',
                                color: 'white',
                                marginBottom: '1rem'
                            }}
                        />
                        <textarea
                            placeholder="What do you want to remember?"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            style={{
                                width: '100%',
                                height: '120px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--border-glass)',
                                padding: '10px',
                                borderRadius: '8px',
                                color: 'white',
                                resize: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '1rem', background: 'linear-gradient(135deg, var(--accent-secondary), #3b82f6)' }}
                            disabled={loading || !noteContent}
                        >
                            Store Note
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
