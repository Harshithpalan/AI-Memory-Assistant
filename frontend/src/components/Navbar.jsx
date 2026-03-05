import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Upload,
    MessageSquare,
    History,
    BrainCircuit
} from 'lucide-react';

const Navbar = () => {
    const navItems = [
        { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { to: '/upload', icon: <Upload size={20} />, label: 'Upload' },
        { to: '/ask', icon: <MessageSquare size={20} />, label: 'Ask AI' },
        { to: '/timeline', icon: <History size={20} />, label: 'Timeline' },
    ];

    return (
        <nav className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', padding: '0 16px' }}>
                <BrainCircuit className="text-accent-primary" size={32} color="#00f2ff" />
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                    AI <span style={{ color: '#00f2ff' }}>MEMORY</span>
                </h1>
            </div>

            <div style={{ flex: 1 }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="glass-card" style={{ padding: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <p>AI Engine Status: </p>
                <p style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
                    Operational
                </p>
            </div>
        </nav>
    );
};

export default Navbar;
