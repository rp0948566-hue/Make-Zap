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

  // Custom MCP Integrations State
  const [customMcpName, setCustomMcpName] = useState('');
  const [customMcpUrl, setCustomMcpUrl] = useState('');
  const [customMcps, setCustomMcps] = useState([]);

  const [historyItems, setHistoryItems] = useState([
    { title: "find me a lead in indore on restaurant without website", time: "Just now" },
    { title: "10 Indore Restaurants Without Website (Vijay Nagar, Rajwada)", time: "10 mins ago" },
    { title: "Miami Auto Workshops Without Website ($850K-$1.5M/yr)", time: "2 hours ago" },
    { title: "Austin Plumbing Contractors Target Leads ($900K-$1.8M/yr)", time: "Yesterday" },
    { title: "Dallas CPA Tax Firms Web Outreach ($750K-$1.4M/yr)", time: "2 days ago" },
    { title: "NY Artisan Bakery Corporate Catering Leads ($600K-$1.1M/yr)", time: "3 days ago" },
    { title: "San Francisco Commercial Roofing & Solar Leads", time: "4 days ago" },
    { title: "Seattle Physical Therapy & Rehab Clinics", time: "5 days ago" },
    { title: "Chicago HVAC & Climate Control Contractors", time: "6 days ago" },
    { title: "Mumbai Fine Dining Restaurants Without Website", time: "1 week ago" },
    { title: "Delhi NCR Dental Clinics & Care Centers", time: "1 week ago" },
    { title: "Bangalore Tech Startups Without Web Landing", time: "2 weeks ago" }
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

  const handleAddCustomMcp = (e) => {
    e.preventDefault();
    if (!customMcpName.trim() || !customMcpUrl.trim()) return;
    setCustomMcps((prev) => [...prev, { name: customMcpName, url: customMcpUrl }]);
    setCustomMcpName('');
    setCustomMcpUrl('');
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
                {user?.user_metadata?.full_name || 'Rudra Pratap'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || 'rp0948566@gmail.com'}
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
            width: '340px',
            maxHeight: '480px',
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
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>History Log</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)' }}>Scroll to view all past searches</div>
              </div>
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
            className="scrollable-history"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              overflowY: 'auto',
              maxHeight: '380px',
              paddingRight: '6px'
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
                  animationDelay: `${(idx + 1) * 0.04}s`,
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
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
              width: '68vw',
              maxWidth: '960px',
              height: '72vh',
              maxHeight: '740px',
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
                  ⚙️ AI Integrations & Custom Connections
                </h2>
                <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.55)', margin: '4px 0 0 0' }}>
                  Connect GitHub, Gmail, Vercel, 21st.dev & Motion MCP endpoints to let AI inspect, edit code & send emails
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

            {/* Modal Body: Custom Integration Connections Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', flex: 1, margin: '20px 0', overflowY: 'auto', paddingRight: '4px' }}>
              
              {/* Card 1: GitHub Connection */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>🐙 GitHub Repository Access</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>✓ Connected</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.5' }}>
                    <strong>Account:</strong> rp0948566-hue / Make-Zap<br />
                    Allows AI to pull code, make edits, sync commits & push directly to GitHub repositories.
                  </div>
                </div>
                <button
                  onClick={() => alert("GitHub integration active & authorized for rp0948566-hue/Make-Zap.")}
                  style={{ marginTop: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Manage GitHub Permissions
                </button>
              </div>

              {/* Card 2: Gmail Outreach Connection */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>📧 Gmail & Email Outreach</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>✓ Connected</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.5' }}>
                    <strong>Account:</strong> rp0948566@gmail.com<br />
                    Allows AI to generate & send custom sales proposals, cold outreach emails & read lead replies.
                  </div>
                </div>
                <button
                  onClick={() => alert("Gmail outreach active for rp0948566@gmail.com.")}
                  style={{ marginTop: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Configure Email Templates
                </button>
              </div>

              {/* Card 3: Vercel Cloud Connection */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>▲ Vercel Cloud Deployment</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>✓ Connected</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.5' }}>
                    <strong>Account:</strong> rp0948566-projects<br />
                    Auto-deploys cloned websites, React components & live landing page previews instantly.
                  </div>
                </div>
                <button
                  onClick={() => alert("Vercel deployment engine active.")}
                  style={{ marginTop: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  View Live Deployments
                </button>
              </div>

              {/* Card 4: 21st.dev MCP Integration */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#FF9F0A' }}>⚡ 21st.dev MCP Server</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>✓ Connected (Free Tier)</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.45', fontFamily: 'monospace' }}>
                    <div><strong>URL:</strong> https://21st.dev/api/mcp</div>
                    <div><strong>API Key:</strong> 21st_sk_c68675f8... (Active)</div>
                    <div style={{ marginTop: '4px', fontFamily: 'sans-serif', fontSize: '12px' }}>Pulls UI components & design primitives for web cloner.</div>
                  </div>
                </div>
                <button
                  onClick={() => alert("21st.dev MCP Server connected cleanly!")}
                  style={{ marginTop: '12px', backgroundColor: 'rgba(255, 159, 10, 0.15)', color: '#FF9F0A', border: '1px solid rgba(255, 159, 10, 0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Verify 21st.dev Status
                </button>
              </div>

              {/* Card 5: Motion MCP Integration */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0A84FF' }}>⚡ Motion MCP Server</div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>✓ Connected (Free Tier)</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: '1.45', fontFamily: 'monospace' }}>
                    <div><strong>URL:</strong> https://xgdzyqfalbibzelpdpvr.../mcp</div>
                    <div style={{ marginTop: '4px', fontFamily: 'sans-serif', fontSize: '12px' }}>Motion animation & workflow automation server.</div>
                  </div>
                </div>
                <button
                  onClick={() => alert("Motion MCP Server active on free endpoint.")}
                  style={{ marginTop: '12px', backgroundColor: 'rgba(10, 132, 255, 0.15)', color: '#0A84FF', border: '1px solid rgba(10, 132, 255, 0.3)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Verify Motion Endpoint
                </button>
              </div>

              {/* Card 6: Add Custom Connection Form */}
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px dashed rgba(255, 255, 255, 0.25)', borderRadius: '18px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                    ➕ Add Custom MCP / API Connection
                  </div>

                  {customMcps.length > 0 && (
                    <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {customMcps.map((m, i) => (
                        <div key={i} style={{ fontSize: '11.5px', color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                          ✓ {m.name}: {m.url}
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddCustomMcp} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Server Name (e.g. My Custom MCP)"
                      value={customMcpName}
                      onChange={(e) => setCustomMcpName(e.target.value)}
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="MCP Server Endpoint URL (https://...)"
                      value={customMcpUrl}
                      onChange={(e) => setCustomMcpUrl(e.target.value)}
                      style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 10px', color: '#fff', fontSize: '12px' }}
                    />
                    <button
                      type="submit"
                      style={{ backgroundColor: '#30D158', color: '#000', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Connection Endpoint
                    </button>
                  </form>
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
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
