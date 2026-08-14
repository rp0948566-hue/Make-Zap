import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  HistoryIcon,
  DownloadIcon 
} from './Icons';
import { useAuth } from '../AuthContext';
import { fetchUserChats } from '../chatService';

export const LeftGlassPanel = ({ onNewChat, onSelectHistoryQuery }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [historyItems, setHistoryItems] = useState([
    { title: "find me a lead in indore on restaurant without website", time: "Just now" },
    { title: "Indore Restaurant Lead Discovery (10 Prospects)", time: "10 mins ago" },
    { title: "Miami Auto Workshops Without Website", time: "2 hours ago" },
    { title: "Austin Plumbing Contractors Target Leads", time: "Yesterday" },
    { title: "Dallas CPA Tax Firms Web Outreach", time: "3 days ago" },
    { title: "NY Artisan Bakery Corporate Catering Leads", time: "4 days ago" }
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

  const handleItemClick = (title) => {
    if (onSelectHistoryQuery) {
      onSelectHistoryQuery(title);
    }
    setShowHistory(false);
  };

  // Compute initials or Google User photo
  const userInitial = user?.user_metadata?.full_name 
    ? user.user_metadata.full_name[0].toUpperCase() 
    : (user?.email ? user.email[0].toUpperCase() : 'R');

  const userAvatar = 
    user?.user_metadata?.avatar_url || 
    user?.user_metadata?.picture || 
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.identities?.[0]?.identity_data?.picture;

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
            onClick={() => {
              setShowHistory(!showHistory);
              setShowProfileMenu(false);
            }}
            title="History Log & Past Chats"
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

          {/* Profile Badge - Toggles Small Smooth Popup */}
          <div
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowHistory(false);
            }}
            title="Account & Settings"
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
              <img 
                src={userAvatar} 
                alt={user?.user_metadata?.full_name || "Google Profile"} 
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
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

      {/* Small Smooth Profile Popup Menu */}
      {showProfileMenu && (
        <div
          className="history-paper-drawer"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '80px',
            width: '240px',
            backgroundColor: '#0c100e',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '18px',
            padding: '12px',
            boxSizing: 'border-box',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            zIndex: 45,
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif"
          }}
        >
          {/* User Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#30D158', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 700 }}>
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : userInitial}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.user_metadata?.full_name || 'Rudra Account'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || 'markzap.lead@pro'}
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '2px 0' }} />

          {/* Option 1: Settings */}
          <button
            onClick={() => {
              setShowSettingsModal(true);
              setShowProfileMenu(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              textAlign: 'left',
              transition: 'background-color 0.15s ease'
            }}
            className="glass-panel-item"
          >
            <span style={{ fontSize: '15px' }}>⚙️</span>
            <span>Settings</span>
          </button>

          {/* Option 2: Google Login / Sign Out */}
          <button
            onClick={() => {
              if (user) {
                signOut();
              } else {
                signInWithGoogle();
              }
              setShowProfileMenu(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: user ? '#ff453a' : '#30D158',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13.5px',
              fontWeight: 600,
              textAlign: 'left',
              transition: 'background-color 0.15s ease'
            }}
            className="glass-panel-item"
          >
            <span style={{ fontSize: '15px' }}>{user ? '🚪' : '🔐'}</span>
            <span>{user ? 'Sign Out' : 'Google Login'}</span>
          </button>
        </div>
      )}

      {/* Scrollable History Pop-up Drawer */}
      {showHistory && (
        <div
          className="history-paper-drawer"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '80px',
            width: '330px',
            maxHeight: '440px',
            backgroundColor: '#0c100e',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '22px',
            padding: '20px',
            boxSizing: 'border-box',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6)',
            zIndex: 45,
            color: '#ffffff',
            fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Drawer Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
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

          {/* Scrollable History Items Container */}
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              overflowY: 'auto',
              maxHeight: '360px',
              paddingRight: '4px'
            }}
          >
            {historyItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleItemClick(item.title)}
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
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff', marginBottom: '3px', lineHeight: '1.35' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: '#30D158', fontWeight: 500 }}>
                  🕒 {item.time} • Click to load session
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Center Settings Modal (Clean Sharp Solid Dark Glass — NO BLUR) */}
      {showSettingsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif"
          }}
        >
          <div
            className="history-paper-drawer"
            style={{
              width: '65vw',
              maxWidth: '920px',
              height: '65vh',
              maxHeight: '680px',
              backgroundColor: '#0c100e',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '28px',
              padding: '36px',
              boxSizing: 'border-box',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.9)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.10)', paddingBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                  ⚙️ Workspace & Engine Settings
                </h2>
                <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.55)', margin: '4px 0 0 0' }}>
                  Manage AI Lead Engine, Supabase Auth, and API integrations
                </p>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#ffffff',
                  fontSize: '16px',
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

            {/* Modal Body: Settings Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1, margin: '24px 0', overflowY: 'auto' }}>
              {/* Box 1: General Workspace */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0', color: '#ffffff' }}>🌐 General</h3>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                  <div><strong>App Name:</strong> Mark Zap Lead Finder</div>
                  <div><strong>Version:</strong> v1.0.0 Pro</div>
                  <div><strong>Theme:</strong> Dark Solid Glass (No Blur)</div>
                </div>
              </div>

              {/* Box 2: Lead Engine Config */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0', color: '#30D158' }}>⚡ Lead Engine</h3>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                  <div><strong>Provider Key:</strong> AQ.Ab8RN6J... (Active)</div>
                  <div><strong>Project ID:</strong> 171579689146</div>
                  <div><strong>Filter Rules:</strong> Mid-Range (No Website)</div>
                </div>
              </div>

              {/* Box 3: Supabase Cloud */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0', color: '#0A84FF' }}>⚡ Supabase Auth</h3>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                  <div><strong>Supabase Host:</strong> laubhpdscqcfvnwdwakh</div>
                  <div><strong>OAuth Provider:</strong> Google Authorized</div>
                  <div><strong>Status:</strong> {user ? `Logged in as ${user.email}` : 'Guest Mode (Local Storage)'}</div>
                </div>
              </div>

              {/* Box 4: Agent-Reach-main */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '18px', padding: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0', color: '#FF9F0A' }}>📁 Agent-Reach-main</h3>
                <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.6' }}>
                  <div><strong>Status:</strong> Integrated in /code workspace</div>
                  <div><strong>CLI Modules:</strong> cli.py, core.py, config.py</div>
                  <div><strong>Target:</strong> Mid-range businesses</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.10)', paddingTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 24px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
