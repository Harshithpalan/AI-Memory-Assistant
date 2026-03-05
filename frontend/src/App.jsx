import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
// These will be created in next steps
import UploadPage from './pages/Upload';
import AskAIPage from './pages/AskAI';
import TimelinePage from './pages/Timeline';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/ask" element={<AskAIPage />} />
            <Route path="/timeline" element={<TimelinePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
