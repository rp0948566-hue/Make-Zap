import React, { useState, useEffect } from 'react';
import { SearchInputBox } from './SearchInputBox';
import { CodeIcon } from './Icons';
import { useAuth } from '../AuthContext';
import { saveChatToSupabase } from '../chatService';

export const CodeStudioView = ({ initialQuery }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: initialQuery },
    { 
      id: 2, 
      sender: 'ai', 
      text: `Code generation session initialized for "${initialQuery.replace('/code', '').trim() || 'Custom Script'}". Workspace active.` 
    }
  ]);
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [panelTabMode, setPanelTabMode] = useState('code'); // Default to 'code' for /code mode
  const [isPaneVisible, setIsPaneVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState('SearchInputBox.jsx');
  const [isFolderOpen, setIsFolderOpen] = useState(true);

  // Sync session to Supabase
  useEffect(() => {
    if (initialQuery && messages.length > 0) {
      saveChatToSupabase(user?.id, initialQuery, messages);
    }
  }, [messages, user, initialQuery]);

  const handleSendFollowUp = (queryText) => {
    if (!queryText.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: `Updated code configuration for "${queryText}". Workspace code updated.`
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const isMobileMode = deviceMode === 'mobile';

  const designFiles = [
    { name: 'SearchInputBox.jsx', type: 'jsx' },
    { name: 'ChatView.jsx', type: 'jsx' },
    { name: 'CodeStudioView.jsx', type: 'jsx' },
    { name: 'LeftGlassPanel.jsx', type: 'jsx' },
    { name: 'LoginModal.jsx', type: 'jsx' },
    { name: 'NavigationBar.jsx', type: 'jsx' },
    { name: 'VideoBackground.jsx', type: 'jsx' }
  ];

  const codeSnippets = {
    'SearchInputBox.jsx': `import React, { useState, useRef } from 'react';
import { AISparkleIcon, UpArrowIcon, PaperclipIcon, SearchIcon, CodeIcon } from './Icons';

export const SearchInputBox = ({ onSubmit, placeholder = "Ask anything..." }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim()) return;
    if (onSubmit) onSubmit(text);
    setText('');
  };

  return (
    <div style={{ maxWidth: '728px', width: '100%', borderRadius: '22px' }}>
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '18px' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
        <button onClick={handleSend}><UpArrowIcon /></button>
      </div>
    </div>
  );
};`,
    'ChatView.jsx': `import React, { useState } from 'react';
import { SearchInputBox } from './SearchInputBox';

export const ChatView = ({ initialQuery }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: initialQuery }
  ]);

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {messages.map((msg) => (
        <div key={msg.id} style={{ color: '#fff' }}>{msg.text}</div>
      ))}
      <SearchInputBox placeholder="Ask follow-up..." />
    </div>
  );
};`,
    'CodeStudioView.jsx': `import React, { useState } from 'react';
import { SearchInputBox } from './SearchInputBox';

export const CodeStudioView = ({ initialQuery }) => {
  const [selectedFile, setSelectedFile] = useState('SearchInputBox.jsx');

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {/* Split-screen Code Studio & Phone/Desktop Workspace */}
    </div>
  );
};`,
    'LeftGlassPanel.jsx': `import React from 'react';
import { PlusIcon, HistoryIcon, DownloadIcon } from './Icons';

export const LeftGlassPanel = ({ onNewChat }) => {
  return (
    <aside style={{ width: '64px', height: '100vh', position: 'fixed' }}>
      {/* 64px Dark Glass Navigation Rail */}
    </aside>
  );
};`,
    'LoginModal.jsx': `import React from 'react';
import { useAuth } from '../AuthContext';

export const LoginModal = ({ onClose }) => {
  const { signInWithGoogle } = useAuth();
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      {/* Google OAuth & Email Authentication Modal */}
    </div>
  );
};`,
    'NavigationBar.jsx': `import React from 'react';

export const NavigationBar = ({ onLoginClick }) => {
  return (
    <nav style={{ padding: '16px 120px', width: '100%' }}>
      <div style={{ fontSize: '34px', fontWeight: 700 }}>Mark Zap</div>
    </nav>
  );
};`,
    'VideoBackground.jsx': `import React from 'react';

export const VideoBackground = () => {
  return (
    <video autoPlay loop muted playsInline style={{ position: 'fixed', inset: 0 }}>
      <source src="https://d8j0ntlcm91z4.cloudfront.net/..." type="video/mp4" />
    </video>
  );
};`
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 8, 7, 0.25)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 35,
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif",
        color: '#ffffff'
      }}
    >
      {/* Left Column: Typing Bar & Chat Stream */}
      <div
        style={{
          flex: isPaneVisible && isMobileMode ? 1 : undefined,
          width: !isPaneVisible ? '100%' : (isMobileMode ? 'auto' : '42%'),
          minWidth: isPaneVisible ? '460px' : '100%',
          maxWidth: !isPaneVisible ? '100%' : (isMobileMode ? 'none' : '540px'),
          height: '100vh',
          backgroundColor: 'rgba(6, 8, 7, 0.32)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isPaneVisible ? '24px 32px 28px 128px' : '24px 120px 28px 128px',
          boxSizing: 'border-box',
          position: 'relative',
          zIndex: 10,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top Header */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            paddingBottom: '14px', 
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)' 
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CodeIcon className="w-4 h-4" />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#30D158' }}>Code Studio</span>
          </div>

          {/* Toggle Pane Button on Left Header if pane is hidden */}
          {!isPaneVisible && (
            <button
              onClick={() => setIsPaneVisible(true)}
              style={{
                backgroundColor: 'rgba(48, 209, 88, 0.15)',
                color: '#30D158',
                border: '1px solid rgba(48, 209, 88, 0.3)',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'transform 0.15s ease'
              }}
            >
              <span>Show Workspace Pane 👁️</span>
            </button>
          )}
        </div>

        {/* Conversation Stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '6px',
            marginTop: '20px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', marginBottom: '4px' }}>
                {msg.sender === 'user' ? 'You' : 'Mark Zap AI'}
              </span>

              {msg.sender === 'user' ? (
                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    color: '#000000',
                    padding: '14px 18px',
                    borderRadius: '16px 16px 2px 16px',
                    fontSize: '15px',
                    lineHeight: '1.45',
                    maxWidth: isPaneVisible ? (isMobileMode ? '90%' : '600px') : '728px'
                  }}
                >
                  {msg.text}
                </div>
              ) : (
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '15px',
                    lineHeight: '1.55',
                    maxWidth: isPaneVisible ? (isMobileMode ? '95%' : '700px') : '780px'
                  }}
                >
                  {msg.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Typing Bar */}
        <div style={{ width: '100%', maxWidth: isPaneVisible ? (isMobileMode ? '728px' : '100%') : '728px', margin: isPaneVisible ? '0' : '0 auto' }}>
          <SearchInputBox 
            onSubmit={handleSendFollowUp} 
            placeholder="Write code command..." 
          />
        </div>
      </div>

      {/* Right Column: Code Studio & Phone/Desktop Workspace */}
      <div
        style={{
          flex: isPaneVisible ? (panelTabMode === 'code' ? 1 : (isMobileMode ? 'none' : 1)) : 0,
          width: isPaneVisible ? (panelTabMode === 'code' ? 'auto' : (isMobileMode ? '480px' : 'auto')) : '0px',
          height: '100vh',
          backgroundColor: 'rgba(4, 6, 5, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          opacity: isPaneVisible ? 1 : 0,
          transform: isPaneVisible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Control Header Bar */}
        <div
          style={{
            height: '52px',
            backgroundColor: 'rgba(10, 14, 12, 0.75)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Main Tab Switchers */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
            <button
              onClick={() => setPanelTabMode('code')}
              style={{
                backgroundColor: panelTabMode === 'code' ? '#ffffff' : 'transparent',
                color: panelTabMode === 'code' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              💻 Code Workspace
            </button>
            <button
              onClick={() => setPanelTabMode('preview')}
              style={{
                backgroundColor: panelTabMode === 'preview' ? '#ffffff' : 'transparent',
                color: panelTabMode === 'preview' ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              👁️ Device Showcase
            </button>
          </div>

          {/* Sub-Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {panelTabMode === 'preview' && (
              <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  style={{
                    backgroundColor: isMobileMode ? '#ffffff' : 'transparent',
                    color: isMobileMode ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  📱 Phone
                </button>
                <button
                  onClick={() => setDeviceMode('desktop')}
                  style={{
                    backgroundColor: !isMobileMode ? '#ffffff' : 'transparent',
                    color: !isMobileMode ? '#000000' : 'rgba(255, 255, 255, 0.7)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  🖥️ Desktop
                </button>
              </div>
            )}

            {/* Hide Pane Button */}
            <button
              onClick={() => setIsPaneVisible(false)}
              title="Hide Display Pane"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Panel Main Area: Code View with 📁 Design Folder Tree */}
        {panelTabMode === 'code' ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              width: '100%',
              height: 'calc(100vh - 52px)',
              backgroundColor: '#070908'
            }}
          >
            {/* Explorer Sidebar Tree with 📁 Design Folder */}
            <div
              style={{
                width: '220px',
                backgroundColor: 'rgba(12, 16, 14, 0.95)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: "'SFMono-Regular', Consolas, monospace",
                fontSize: '12.5px',
                userSelect: 'none'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                EXPLORER
              </div>

              {/* 📁 Design Folder Item */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  onClick={() => setIsFolderOpen(!isFolderOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#30D158',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(48, 209, 88, 0.1)'
                  }}
                >
                  <span style={{ fontSize: '11px', transition: 'transform 0.15s ease', transform: isFolderOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
                  <span>📁 Design</span>
                </div>

                {/* Sub-files inside 📁 Design */}
                {isFolderOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '16px', marginTop: '2px' }}>
                    {designFiles.map((f, idx) => {
                      const isSelected = selectedFile === f.name;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedFile(f.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                            color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 400,
                            fontSize: '12px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span style={{ fontSize: '13px', color: '#0A84FF' }}>📄</span>
                          <span>{f.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Code Workspace Editor Area */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#040504',
                padding: '20px 24px',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
            >
              {/* Editor Header Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#0A84FF' }}>📄</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff', fontFamily: 'monospace' }}>
                    {selectedFile}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.15)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    JavaScript React
                  </span>
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(codeSnippets[selectedFile] || '')}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Copy Code
                </button>
              </div>

              {/* Code Canvas Content Area */}
              <div
                style={{
                  flex: 1,
                  marginTop: '16px',
                  backgroundColor: '#070907',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '20px',
                  overflowY: 'auto',
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: '#d4d4d4',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {codeSnippets[selectedFile] || '// Code content loading...'}
              </div>
            </div>
          </div>
        ) : (
          /* PREVIEW SHOWCASE MODE */
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobileMode ? '16px' : '32px 40px',
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isMobileMode ? (
              /* SMARTPHONE FRAME */
              <div
                style={{
                  position: 'relative',
                  width: '420px',
                  height: '100%',
                  maxHeight: 'calc(100vh - 84px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ position: 'absolute', left: '-8px', top: '85px', width: '6px', height: '24px', background: 'linear-gradient(180deg, #48544c 0%, #1e2520 100%)', borderRadius: '4px 0 0 4px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), -4px 2px 8px rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '2px', height: '8px', backgroundColor: '#ff453a', borderRadius: '1px', boxShadow: '0 0 4px #ff453a' }} />
                </div>
                <div style={{ position: 'absolute', left: '-8px', top: '135px', width: '6px', height: '52px', background: 'linear-gradient(180deg, #505d54 0%, #202722 100%)', borderRadius: '4px 0 0 4px', boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.5), -4px 3px 8px rgba(0,0,0,0.95)' }} />
                <div style={{ position: 'absolute', left: '-8px', top: '202px', width: '6px', height: '52px', background: 'linear-gradient(180deg, #505d54 0%, #202722 100%)', borderRadius: '4px 0 0 4px', boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.5), -4px 3px 8px rgba(0,0,0,0.95)' }} />
                <div style={{ position: 'absolute', right: '-8px', top: '150px', width: '6px', height: '74px', background: 'linear-gradient(180deg, #505d54 0%, #202722 100%)', borderRadius: '0 4px 4px 0', boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.5), 4px 3px 8px rgba(0,0,0,0.95)' }} />

                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000000',
                    background: 'linear-gradient(145deg, #2b332d 0%, #151a17 40%, #0a0e0c 100%)',
                    border: '12px solid #1c221e',
                    borderRadius: '52px',
                    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.95), inset 0 0 0 2px rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '12px',
                      transform: 'translateX(-50%)',
                      width: '110px',
                      height: '26px',
                      backgroundColor: '#000000',
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 12px',
                      zIndex: 30
                    }}
                  >
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#090d10', border: '1px solid #1a221d' }} />
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#090d10' }} />
                  </div>

                  <div style={{ flex: 1, backgroundColor: '#000000' }} />

                  <div
                    style={{
                      height: '20px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      bottom: '6px',
                      left: 0,
                      zIndex: 30
                    }}
                  >
                    <div style={{ width: '130px', height: '4.5px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '2.5px' }} />
                  </div>
                </div>
              </div>
            ) : (
              /* MACBOOK PRO FRAME */
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '920px',
                  height: '100%',
                  maxHeight: 'calc(100vh - 110px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    flex: 1,
                    backgroundColor: '#000000',
                    background: 'linear-gradient(180deg, #2b332d 0%, #161c18 100%)',
                    border: '14px solid #1e2420',
                    borderRadius: '24px 24px 4px 4px',
                    boxShadow: '0 35px 90px rgba(0, 0, 0, 0.95), inset 0 0 0 1.5px rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '56px',
                      height: '15px',
                      backgroundColor: '#000000',
                      borderRadius: '0 0 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      zIndex: 35
                    }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0b100d', border: '1px solid #1a221d' }} />
                    <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#30D158' }} />
                  </div>

                  <div style={{ flex: 1, backgroundColor: '#000000' }} />

                  <div
                    style={{
                      height: '24px',
                      backgroundColor: '#090d0a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      zIndex: 30
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.6px' }}>
                      MacBook Pro
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    width: '106%',
                    height: '18px',
                    background: 'linear-gradient(180deg, #242c26 0%, #121714 60%, #0a0d0b 100%)',
                    borderRadius: '2px 2px 14px 14px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.9)',
                    position: 'relative',
                    marginTop: '-2px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{ width: '64px', height: '6px', backgroundColor: '#0c100d', borderRadius: '0 0 6px 6px', border: '0.5px solid rgba(255,255,255,0.1)', borderTop: 'none' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
