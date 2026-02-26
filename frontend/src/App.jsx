import React, { useState } from 'react';
import { Navbar } from './components/UI';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Detail from './pages/Detail';
import Recommendations from './pages/Recommendations';

export default function App() {
  const [page, setPage] = useState('landing');
  const [studentProfile, setStudentProfile] = useState(null);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <Landing setPage={setPage} />;
      case 'profile':
        return (
          <Profile
            studentProfile={studentProfile}
            setStudentProfile={setStudentProfile}
            setPage={setPage}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            studentProfile={studentProfile}
            setPage={setPage}
            setSelectedOpp={setSelectedOpp}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
          />
        );
      case 'detail':
        return (
          <Detail
            opp={selectedOpp}
            studentProfile={studentProfile}
            setPage={setPage}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
          />
        );
      case 'recommendations':
        return (
          <Recommendations
            studentProfile={studentProfile}
            setPage={setPage}
            setSelectedOpp={setSelectedOpp}
          />
        );
      default:
        return <Landing setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar page={page} setPage={setPage} studentProfile={studentProfile} />
      <main>
        {renderPage()}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        textAlign: 'center',
        marginTop: 48,
      }}>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>
          <strong style={{ color: 'var(--text2)' }}>BridgeNE</strong> — Built for the hackathon. Find opportunities that match your skills.
        </p>
      </footer>
    </div>
  );
}
