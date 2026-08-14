import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  HistoryIcon,
  DownloadIcon 
} from './Icons';
import { useAuth } from '../AuthContext';
import { fetchUserChats } from '../chatService';

export const LeftGlassPanel = ({ onNewChat }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([
    { title: "Lead Generation Strategy Q3", time: "10 mins ago" },
    { title: "Sales Funnel Conversion Metrics", time: "2 hours ago" },
    { title: "Automated Email Sequences", time: "Yesterday" },
    { title: "Competitor Market Insights", time: "3 days ago" },
  ]);

  const { user, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserChats(user.id).then(chats => {
        if (chats && chats.length > 0) {
          setHistoryItems(chats.map(c => ({
            title: c.title,
            time: new Date(c.updated_at || c.created_at).toLocaleDateString()
          })));
        }
      });
    }
  }, [user]);

  // Compute initials or Google User photo
  const userInitial = user?.user_metadata?.full_name ? user.user_metadata.full_name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'R');
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <>
      <aside
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '64px',
          height: '100vh',
          backgroundColor: 'rgba(12, 14, 16, 0.92)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '10px 0 40px rgba(0, 0, 0, 0.4)',
          zIndex: 40,
          padding: '20px 0',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#ffffff',
          fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif"
        }}
      >
        {/* Top Section: Plus Button & History Icon */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
          {/* Plus Button */}
          <button
            onClick={onNewChat}
            title="New Lead / Query"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, transform 0.15s ease'
            }}
            className="plus-circle-btn"
          >
            <PlusIcon />
          </button>

          {/* History Icon Button below Plus */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            title="History"
            aria-label="History"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: showHistory ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
              color: showHistory ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, color 0.15s ease, transform 0.15s ease'
            }}
            className="rail-icon-btn"
          >
            <HistoryIcon />
          </button>
        </div>

        {/* Bottom Section: Download Icon & Profile Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
          {/* Download Icon */}
          <button
            title="Download App"
            aria-label="Download"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '8px',
              transition: 'color 0.15s ease'
            }}
            className="rail-icon-btn"
          >
            <DownloadIcon />
          </button>

          {/* Profile Badge (Connected to Google Auth) */}
          <div
            onClick={user ? signOut : signInWithGoogle}
            title={user ? `Signed in as ${user.email} (Click to Sign Out)` : "Sign in with Google"}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#d8dacd',
              color: '#1a1c18',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Google Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#c4c6b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                {userInitial}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* History Pop-up Drawer */}
      {showHistory && (
        <div
          className="history-paper-drawer"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '80px',
            width: '310px',
            backgroundColor: 'rgba(12, 16, 14, 0.94)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '22px',
            padding: '20px',
            boxSizing: 'border-box',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6)',
            zIndex: 45,
            color: '#ffffff',
            fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif"
          }}
        >
          {/* Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <HistoryIcon className="w-4 h-4" />
              </div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>History Log</span>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease'
              }}
            >
              ✕
            </button>
          </div>

          {/* Staggered Animated History Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px 14px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  animationDelay: `${(idx + 1) * 0.07}s`,
                  transition: 'background-color 0.18s ease, transform 0.18s ease'
                }}
                className="glass-panel-item history-pop-item"
              >
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff', marginBottom: '3px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', fontWeight: 400 }}>
                  {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
