import React, { useState, useRef } from 'react';
import { AISparkleIcon, UpArrowIcon, PaperclipIcon, SearchIcon, CodeIcon } from './Icons';

export const SearchInputBox = ({ onSubmit, placeholder = "Ask anything..." }) => {
  const [text, setText] = useState('');
  const [showCommandsMenu, setShowCommandsMenu] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const textareaRef = useRef(null);

  const commandOptions = [
    { cmd: '/code', label: 'Write Code', desc: 'Generate & format production-ready code', icon: <CodeIcon className="w-4 h-4" /> },
    { cmd: '/search', label: 'Web Search', desc: 'Search live web data & insights', icon: <SearchIcon className="w-4 h-4" /> },
    { cmd: '/prompts', label: 'AI Prompts', desc: 'Browse curated prompt templates', icon: <AISparkleIcon className="w-4 h-4" /> },
  ];

  const filteredCommands = commandOptions.filter(c => 
    c.cmd.toLowerCase().includes(commandFilter.toLowerCase()) || 
    c.label.toLowerCase().includes(commandFilter.toLowerCase())
  );

  const handleTextChange = (e) => {
    const val = e.target.value.slice(0, 3000);
    setText(val);

    // Detect slash / triggers
    const lastSlashIndex = val.lastIndexOf('/');
    if (lastSlashIndex !== -1 && (lastSlashIndex === 0 || val[lastSlashIndex - 1] === ' ')) {
      const query = val.slice(lastSlashIndex);
      setCommandFilter(query);
      setShowCommandsMenu(true);
    } else {
      setShowCommandsMenu(false);
    }
  };

  const handleSelectCommand = (cmdObj) => {
    setText(cmdObj.cmd + ' ');
    setShowCommandsMenu(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    if (onSubmit) {
      onSubmit(text);
    }
    setText('');
    setShowCommandsMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setShowCommandsMenu(false);
    }
  };

  return (
    <div 
      style={{
        maxWidth: '728px',
        width: '100%',
        borderRadius: '22px',
        backgroundColor: 'rgba(25, 32, 25, 0.42)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '14px 14px 14px 14px',
        boxSizing: 'border-box',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Slash Commands Dropdown Menu Popup */}
      {showCommandsMenu && filteredCommands.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '14px',
            right: '14px',
            marginBottom: '12px',
            backgroundColor: 'rgba(14, 18, 16, 0.96)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '16px',
            padding: '8px',
            boxShadow: '0 -15px 40px rgba(0, 0, 0, 0.5)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif"
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', padding: '6px 12px 4px 12px', letterSpacing: '0.8px' }}>
            Commands
          </div>
          {filteredCommands.map((c, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectCommand(c)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              className="glass-panel-item"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#30D158' }}>{c.icon}</span>
                <span style={{ fontSize: '14.5px', fontWeight: 600 }}>{c.cmd}</span>
                <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.65)' }}>— {c.label}</span>
              </div>
              <span style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.4)' }}>{c.desc}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Single White Card Container */}
      <div 
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '18px 18px 14px 18px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '120px'
        }}
      >
        {/* Top portion inside white card: Input + Submit Button */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <textarea 
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={2}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '16px',
              color: '#000000',
              resize: 'none',
              lineHeight: '1.4',
              padding: 0
            }}
          />
          <button 
            onClick={handleSend}
            aria-label="Submit search"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: text.trim() ? '#000000' : 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.15s ease, opacity 0.15s ease, background-color 0.15s ease'
            }}
            className="btn-submit"
          >
            <UpArrowIcon />
          </button>
        </div>

        {/* Bottom portion inside white card: Attach Action Button */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '16px',
            userSelect: 'none'
          }}
        >
          {/* Left Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <button className="white-card-action">
              <PaperclipIcon />
              <span>Attach</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
