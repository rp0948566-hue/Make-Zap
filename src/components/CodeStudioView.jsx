import React, { useState } from 'react';
import { SearchInputBox } from './SearchInputBox';
import { CodeIcon } from './Icons';

export const CodeStudioView = ({ initialQuery }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'user', text: initialQuery },
    { 
      id: 2, 
      sender: 'ai', 
      text: `Code generation session initialized for "${initialQuery.replace('/code', '').trim() || 'Custom Script'}". Phone preview active.` 
    }
  ]);
  const [deviceMode, setDeviceMode] = useState('mobile'); // Default to Mobile Phone Size
  const [panelTabMode, setPanelTabMode] = useState('preview'); // 'preview' | 'code'
  const [isPaneVisible, setIsPaneVisible] = useState(true);

  const handleSendFollowUp = (queryText) => {
    if (!queryText.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: `Updated code configuration for "${queryText}". Panel updated.`
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
                    maxWidth: isPaneVisible ? '90%' : '600px'
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
                    maxWidth: isPaneVisible ? '95%' : '700px'
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

      {/* Right Column: Toggleable Panel (Preview OR Code View) */}
      <div
        style={{
          flex: isPaneVisible ? (panelTabMode === 'code' ? 1 : (isMobileMode ? 'none' : 1)) : 0,
          width: isPaneVisible ? (panelTabMode === 'code' ? 'auto' : (isMobileMode ? '390px' : 'auto')) : '0px',
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
        {/* Right Panel Control Header Bar with Preview & Code Tabs */}
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

          {/* Right Sub-Controls: Device Toggle + Hide Pane */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {panelTabMode === 'preview' && (
              <div style={{ display: 'flex', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', padding: '2px' }}>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  style={{
                    backgroundColor: isMobileMode ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📱 Phone
                </button>
                <button
                  onClick={() => setDeviceMode('desktop')}
                  style={{
                    backgroundColor: !isMobileMode ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🖥️ Desktop
                </button>
              </div>
            )}

            {/* Toggle Pane Hide Button */}
            <button
              onClick={() => setIsPaneVisible(false)}
              title="Hide Pane"
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

        {/* Panel Main Area: Render Code View OR Preview Mode */}
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
          /* REALISTIC SMARTPHONE HARDWARE PREVIEW DISPLAY MODE */
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobileMode ? '14px 10px' : '32px',
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Phone Outer Chassis with Physical Side Hardware Buttons */}
            <div
              style={{
                position: 'relative',
                width: isMobileMode ? '340px' : '100%',
                height: isMobileMode ? '680px' : '100%',
                maxHeight: isMobileMode ? '680px' : '100%',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Left Side Hardware Buttons (Volume Keys) */}
              {isMobileMode && (
                <>
                  <div style={{ position: 'absolute', left: '-15px', top: '110px', width: '4px', height: '42px', backgroundColor: '#2a322c', borderRadius: '3px 0 0 3px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }} />
                  <div style={{ position: 'absolute', left: '-15px', top: '165px', width: '4px', height: '42px', backgroundColor: '#2a322c', borderRadius: '3px 0 0 3px', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }} />
                </>
              )}

              {/* Right Side Hardware Button (Power Lock Key) */}
              {isMobileMode && (
                <div style={{ position: 'absolute', right: '-15px', top: '130px', width: '4px', height: '58px', backgroundColor: '#2a322c', borderRadius: '0 3px 3px 0', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2)' }} />
              )}

              {/* Main Phone Glass Screen Container */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#020302', // True OLED Black screen
                  border: isMobileMode ? '11px solid #1d221f' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: isMobileMode ? '48px' : '16px',
                  boxShadow: isMobileMode 
                    ? '0 25px 70px rgba(0, 0, 0, 0.95), inset 0 0 0 1px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(0,0,0,0.8)' 
                    : '0 30px 80px rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  boxSizing: 'border-box'
                }}
              >
                {/* Top Status Bar (Clock, Camera Notch, WiFi, Battery) */}
                {isMobileMode && (
                  <div
                    style={{
                      height: '44px',
                      width: '100%',
                      padding: '0 20px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 30,
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#ffffff',
                      userSelect: 'none'
                    }}
                  >
                    {/* Left: Clock */}
                    <span style={{ fontFamily: 'sans-serif', letterSpacing: '-0.2px', marginTop: '6px' }}>9:41</span>

                    {/* Center: Dynamic Island Camera Notch */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '10px',
                        transform: 'translateX(-50%)',
                        width: '96px',
                        height: '24px',
                        backgroundColor: '#000000',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 10px',
                        boxShadow: '0 0 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      {/* Camera Lens dot */}
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#090d10', border: '1px solid #1a221d' }} />
                      {/* Speaker mesh dot */}
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#090d10' }} />
                    </div>

                    {/* Right: 5G Signal, WiFi, Battery Icons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px' }}>5G</span>
                      <div style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-end', height: '10px' }}>
                        <div style={{ width: '2px', height: '4px', backgroundColor: '#fff' }} />
                        <div style={{ width: '2px', height: '6px', backgroundColor: '#fff' }} />
                        <div style={{ width: '2px', height: '8px', backgroundColor: '#fff' }} />
                        <div style={{ width: '2px', height: '10px', backgroundColor: '#fff' }} />
                      </div>
                      <div style={{ width: '18px', height: '9px', border: '1px solid #fff', borderRadius: '3px', padding: '1px', display: 'flex' }}>
                        <div style={{ flex: 1, backgroundColor: '#30D158', borderRadius: '1px' }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone Screen Display Content Canvas */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobileMode ? '54px 20px 30px 20px' : '24px',
                    boxSizing: 'border-box',
                    gap: '16px',
                    textAlign: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#30D158',
                      boxShadow: '0 10px 24px rgba(0,0,0,0.5)'
                    }}
                  >
                    <CodeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '6px' }}>
                      {isMobileMode ? 'Smartphone Display Active' : 'Desktop View Active'}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.4)', maxWidth: '240px', lineHeight: '1.4' }}>
                      True OLED Black Screen — Live code execution display ready.
                    </div>
                  </div>
                </div>

                {/* Bottom iOS Swipe Home Bar */}
                {isMobileMode && (
                  <div
                    style={{
                      height: '20px',
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      bottom: '4px',
                      left: 0,
                      zIndex: 30
                    }}
                  >
                    <div
                      style={{
                        width: '115px',
                        height: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        borderRadius: '2px'
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
