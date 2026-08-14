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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general'); // 'general' | 'engine' | 'supabase'

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

  // Compute initials or Google User photo from all possible metadata paths
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

      {/* Small Smooth Profile & Settings Popup Menu */}
      {showProfileMenu && (
        <div
          className="history-paper-drawer"
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '78px',
            width: '210px',
            backgroundColor: 'rgba(14, 18, 16, 0.96)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '16px',
            padding: '8px',
            boxSizing: 'border-box',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            zIndex: 45,
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif"
          }}
        >
          {/* User Account Info Header */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '4px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.user_metadata?.full_name || user?.email || 'Mark Zap Guest'}
            </div>
            <div style={{ fontSize: '10.5px', color: '#30D158', fontWeight: 600, marginTop: '2px' }}>
              {user ? 'Google Account Active' : 'Guest Mode'}
            </div>
          </div>

          {/* Option 1: Settings */}
          <button
            onClick={() => {
              setShowProfileMenu(false);
              setShowSettingsModal(true);
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

          {/* Option 2: Login / Logout */}
          <button
            onClick={() => {
              setShowProfileMenu(false);
              if (user) {
                signOut();
              } else {
                signInWithGoogle();
              }
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

          {/* History Items */}
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

      {/* Center Settings Modal (Covers 65% of screen with soft rounded corners) */}
      {showSettingsModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.68)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
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
              backgroundColor: 'rgba(14, 18, 16, 0.95)',
              backdropFilter: 'blur(36px)',
              WebkitBackdropFilter: 'blur(36px)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '28px',
              boxShadow: '0 40px 100px rgba(0, 0, 0, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              color: '#ffffff',
              boxSizing: 'border-box'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                height: '64px',
                padding: '0 28px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'rgba(20, 26, 23, 0.6)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>⚙️</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>Workspace & Engine Settings</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#ffffff',
                  fontSize: '14px',
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

            {/* Modal Body: Sidebar Tabs + Content Area */}
            <div style={{ flex: 1, display: 'flex' }}>
              {/* Settings Sidebar Tabs */}
              <div
                style={{
                  width: '210px',
                  backgroundColor: 'rgba(10, 14, 12, 0.8)',
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '20px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <button
                  onClick={() => setActiveSettingsTab('general')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: activeSettingsTab === 'general' ? '#ffffff' : 'transparent',
                    color: activeSettingsTab === 'general' ? '#000000' : 'rgba(255, 255, 255, 0.75)',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  🌐 General
                </button>
                <button
                  onClick={() => setActiveSettingsTab('engine')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: activeSettingsTab === 'engine' ? '#ffffff' : 'transparent',
                    color: activeSettingsTab === 'engine' ? '#000000' : 'rgba(255, 255, 255, 0.75)',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ⚡ Lead Engine
                </button>
                <button
                  onClick={() => setActiveSettingsTab('supabase')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: activeSettingsTab === 'supabase' ? '#ffffff' : 'transparent',
                    color: activeSettingsTab === 'supabase' ? '#000000' : 'rgba(255, 255, 255, 0.75)',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ⚡ Supabase Auth & Cloud
                </button>
              </div>

              {/* Main Content Pane */}
              <div style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {activeSettingsTab === 'general' && (
                  <>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>General Workspace Configuration</div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600 }}>App Name</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Make Zap Lead Finder</div>
                        </div>
                        <span style={{ fontSize: '12px', color: '#30D158', fontWeight: 600, backgroundColor: 'rgba(48,209,88,0.15)', padding: '4px 10px', borderRadius: '6px' }}>
                          v1.0.0 Pro
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {activeSettingsTab === 'engine' && (
                  <>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Lead Engine Preferences</div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600 }}>Auto Verification Threshold</div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Filter lead scores above 95/100</div>
                        </div>
                        <span style={{ fontSize: '13px', color: '#30D158', fontWeight: 700 }}>95% Active</span>
                      </div>
                    </div>
                  </>
                )}

                {activeSettingsTab === 'supabase' && (
                  <>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Supabase Cloud Connection</div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>SUPABASE PROJECT URL</div>
                        <div style={{ fontSize: '13.5px', fontFamily: 'monospace', color: '#30D158', marginTop: '4px' }}>
                          https://laubhpdscqcfvnwdwakh.supabase.co
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Auth Provider</span>
                        <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 600 }}>Google OAuth 2.0</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
