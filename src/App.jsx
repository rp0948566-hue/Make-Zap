import React, { useState } from 'react';
import { VideoBackground } from './components/VideoBackground';
import { NavigationBar } from './components/NavigationBar';
import { HeroContent } from './components/HeroContent';
import { LeftGlassPanel } from './components/LeftGlassPanel';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [activeQuery, setActiveQuery] = useState(null);

  const handleNewChat = () => {
    setActiveQuery(null);
    setIsChatMode(false);
  };

  const handleInitialSubmit = (queryText) => {
    if (!queryText.trim()) return;
    setActiveQuery(queryText);
    setIsChatMode(true);
  };

  return (
    <div 
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Loop Video Background with custom JS rAF fade engine */}
      <VideoBackground />

      {/* Left Blur Glass Side Panel with working + New Lead/Query button */}
      <LeftGlassPanel onNewChat={handleNewChat} />

      {/* Main Container Overlay */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: isChatMode ? '0px' : '60px'
        }}
      >
        {/* Navigation Bar (Hidden during Chat mode) */}
        {!isChatMode && (
          <NavigationBar onLoginClick={() => setShowLoginModal(true)} />
        )}

        {/* Hero Content / Chat View */}
        <HeroContent activeQuery={activeQuery} onInitialSubmit={handleInitialSubmit} />
      </div>

      {/* Signal Log In Modal Overlay */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}
