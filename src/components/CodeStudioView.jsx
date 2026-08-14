import React, { useState } from 'react';
import { SearchInputBox } from './SearchInputBox';
import { CodeIcon } from './Icons';

export const CodeStudioView = ({ initialQuery }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: initialQuery },
    { 
      id: 2, 
      sender: 'ai', 
      text: `Code generation session initialized for "${initialQuery.replace('/code', '').trim() || 'Custom Script'}". Display active.` 
    }
  ]);
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile' | 'desktop'
  const [panelTabMode, setPanelTabMode] = useState('preview'); // 'preview' | 'code'
  const [isPaneVisible, setIsPaneVisible] = useState(true);

  const handleSendFollowUp = (queryText) => {
    if (!queryText.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: `Updated code configuration for "${queryText}". Display updated.`
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const isMobileMode = deviceMode === 'mobile';

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
              <span>Show Preview Pane 👁️</span>
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

      {/* Right Column: Increased Phone Panel Width (480px in Phone Mode) */}
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
        {/* Right Panel Control Header Bar with Preview/Code Tabs + Device Switcher */}
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
          {/* Main Tab Switchers: Preview vs Code */}
          <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
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
              👁️ Preview
            </button>
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
              💻 Code
            </button>
          </div>

          {/* Right Sub-Controls: Phone & Desktop Device Toggle + Hide Pane */}
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

        {/* Panel Main Area: Code View OR Pure OLED Display Mode */}
        {panelTabMode === 'code' ? (
          /* CLEAN EMPTY CODE VIEW STRUCTURE */
          <div
            style={{
              flex: 1,
              display: 'flex',
              width: '100%',
              height: 'calc(100vh - 52px)',
              backgroundColor: '#070908'
            }}
          >
            {/* File Explorer Tree Sidebar */}
            <div
              style={{
                width: '180px',
                backgroundColor: 'rgba(12, 16, 14, 0.95)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 12px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: "'SFMono-Regular', Consolas, monospace",
                fontSize: '12.5px'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                EXPLORER
              </div>
            </div>

            {/* Clean Empty Code Canvas Structure */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#040504',
                padding: '24px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)', fontFamily: 'monospace' }}>
                  Code Workspace — Empty Structure
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  marginTop: '16px',
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.25)',
                  fontSize: '13.5px'
                }}
              >
                Clean Empty Workspace Area
              </div>
            </div>
          </div>
        ) : (
          /* PREVIEW DISPLAY MODE: ULTRA-REALISTIC HARDWARE CHASSIS BODY (PURE BLACK INSIDE) */
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
              /* HYPER-REALISTIC 3D PHYSICAL SMARTPHONE HARDWARE CHASSIS */
              <div
                style={{
                  position: 'relative',
                  width: '420px',
                  height: '100%',
                  maxHeight: 'calc(100vh - 84px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* 3D Extruded Mute / Ring Switch */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: '-8px', 
                    top: '85px', 
                    width: '6px', 
                    height: '24px', 
                    background: 'linear-gradient(180deg, #48544c 0%, #1e2520 100%)', 
                    borderRadius: '4px 0 0 4px',
                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), -4px 2px 8px rgba(0,0,0,0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} 
                >
                  <div style={{ width: '2px', height: '8px', backgroundColor: '#ff453a', borderRadius: '1px', boxShadow: '0 0 4px #ff453a' }} />
                </div>

                {/* 3D Extruded Volume Up Button */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: '-8px', 
                    top: '135px', 
                    width: '6px', 
                    height: '52px', 
                    background: 'linear-gradient(180deg, #505d54 0%, #202722 100%)', 
                    borderRadius: '4px 0 0 4px',
                    boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.5), -4px 3px 8px rgba(0,0,0,0.95)' 
                  }} 
                />

                {/* 3D Extruded Volume Down Button */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    left: '-8px', 
                    top: '202px', 
                    width: '6px', 
                    height: '52px', 
                    background: 'linear-gradient(180deg, #505d54 0%, #202722 100%)', 
                    borderRadius: '4px 0 0 4px',
                    boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.5), -4px 3px 8px rgba(0,0,0,0.95)' 
                  }} 
                />

                {/* 3D Extruded Power / Lock Key */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    right: '-8px', 
                    top: '150px', 
                    width: '6px', 
                    height: '74px', 
                    background: 'linear-gradient(180deg, #505d54 0%, #202722 100%)', 
                    borderRadius: '0 4px 4px 0',
                    boxShadow: 'inset 0 1.5px 2px rgba(255,255,255,0.5), 4px 3px 8px rgba(0,0,0,0.95)' 
                  }} 
                />

                {/* SIM Card Tray Ejection Slot */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    right: '-2px', 
                    top: '280px', 
                    width: '3px', 
                    height: '32px', 
                    backgroundColor: '#161c18', 
                    borderRadius: '0 2px 2px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }} 
                >
                  <div style={{ width: '1.5px', height: '3px', backgroundColor: '#090d10', borderRadius: '50%' }} />
                </div>

                {/* Antenna Band Cutouts */}
                <div style={{ position: 'absolute', top: '50px', left: '-10px', width: '4px', height: '5px', backgroundColor: '#111613' }} />
                <div style={{ position: 'absolute', top: '50px', right: '-10px', width: '4px', height: '5px', backgroundColor: '#111613' }} />

                {/* Main Physical Phone Outer Frame & Curved OLED Screen Container */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000000',
                    background: 'linear-gradient(145deg, #2b332d 0%, #151a17 40%, #0a0e0c 100%)',
                    border: '12px solid #1c221e',
                    borderRadius: '52px',
                    boxShadow: '0 40px 100px rgba(0, 0, 0, 0.95), inset 0 0 0 2px rgba(255, 255, 255, 0.25), inset 0 0 14px rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Curved Glass Lens Glossy Highlight Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0) 65%)',
                      pointerEvents: 'none',
                      zIndex: 25
                    }}
                  />

                  {/* Top Dynamic Island Camera Notch & Sensors */}
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
                      zIndex: 30,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.9)'
                    }}
                  >
                    <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#090d10', border: '1px solid #1a221d', boxShadow: 'inset 0 0 2px #30D158' }} />
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#090d10' }} />
                  </div>

                  {/* PURE CLEAN OLED BLACK SCREEN CANVAS */}
                  <div style={{ flex: 1, backgroundColor: '#000000' }} />

                  {/* Bottom USB-C Port & Speaker Grill Connectors */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: 0,
                      right: 0,
                      height: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      zIndex: 20
                    }}
                  >
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <div style={{ width: '2px', height: '2px', backgroundColor: '#111613', borderRadius: '50%' }} />
                      <div style={{ width: '2px', height: '2px', backgroundColor: '#111613', borderRadius: '50%' }} />
                      <div style={{ width: '2px', height: '2px', backgroundColor: '#111613', borderRadius: '50%' }} />
                    </div>

                    <div style={{ width: '18px', height: '3.5px', backgroundColor: '#111613', borderRadius: '2px', border: '0.5px solid rgba(255,255,255,0.1)' }} />

                    <div style={{ display: 'flex', gap: '3px' }}>
                      <div style={{ width: '2px', height: '2px', backgroundColor: '#111613', borderRadius: '50%' }} />
                      <div style={{ width: '2px', height: '2px', backgroundColor: '#111613', borderRadius: '50%' }} />
                      <div style={{ width: '2px', height: '2px', backgroundColor: '#111613', borderRadius: '50%' }} />
                    </div>
                  </div>

                  {/* Bottom iOS Swipe Home Bar */}
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
                    <div style={{ width: '130px', height: '4.5px', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '2.5px', boxShadow: '0 1px 3px rgba(0,0,0,0.8)' }} />
                  </div>
                </div>
              </div>
            ) : (
              /* HYPER-REALISTIC MACBOOK PRO 3D HARDWARE SHOWCASE DISPLAY (DESKTOP MODE) */
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
                {/* MacBook Pro Display Lid Frame */}
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
                  {/* Top Camera Notch */}
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
                    <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#30D158', boxShadow: '0 0 4px #30D158' }} />
                  </div>

                  {/* Glass Reflection Glare Highlight */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 35%, rgba(255,255,255,0) 60%)',
                      pointerEvents: 'none',
                      zIndex: 25
                    }}
                  />

                  {/* PURE CLEAN MACBOOK DISPLAY SCREEN CANVAS */}
                  <div style={{ flex: 1, backgroundColor: '#000000' }} />

                  {/* Bottom Screen Bezel */}
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

                {/* Lower Base Deck Lip */}
                <div
                  style={{
                    width: '106%',
                    height: '18px',
                    background: 'linear-gradient(180deg, #242c26 0%, #121714 60%, #0a0d0b 100%)',
                    borderRadius: '2px 2px 14px 14px',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
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
