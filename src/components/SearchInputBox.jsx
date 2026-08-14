import React, { useState, useRef } from 'react';
import { AISparkleIcon, UpArrowIcon, PaperclipIcon, SearchIcon, CodeIcon } from './Icons';

export const SearchInputBox = ({ onSubmit, placeholder = "Ask anything or search..." }) => {
  const [text, setText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showCommandsMenu, setShowCommandsMenu] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }

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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      setText((prev) => prev ? `${prev} [Attached PDF: ${file.name}]` : `Analyze PDF Document: ${file.name}`);
    }
  };

  const handleSend = () => {
    if (!text.trim() && !attachedFile) return;
    if (onSubmit) {
      onSubmit(text);
    }
    setText('');
    setAttachedFile(null);
    setShowCommandsMenu(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
        borderRadius: '24px',
        backgroundColor: 'rgba(25, 32, 25, 0.42)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '14px',
        boxSizing: 'border-box',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Hidden File Input for PDF Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".pdf,.doc,.docx,.txt" 
        style={{ display: 'none' }} 
      />

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
          {filteredCommands.map((cmdObj, idx) => (
            <div
              key={idx}
              onClick={() => handleSelectCommand(cmdObj)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              className="glass-panel-item"
            >
              <div style={{ color: '#30D158' }}>{cmdObj.icon}</div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#ffffff' }}>
                  {cmdObj.cmd} — {cmdObj.label}
                </div>
                <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.55)', marginTop: '2px' }}>
                  {cmdObj.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Inner White Card */}
      <div 
        style={{
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          borderRadius: '18px',
          padding: '18px 22px',
          boxSizing: 'border-box',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Attached File Pill Badge if PDF selected */}
        {attachedFile && (
          <div
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'rgba(10, 132, 255, 0.15)',
              border: '1px solid rgba(10, 132, 255, 0.3)',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#0A84FF',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px'
            }}
          >
            <span>📄 {attachedFile.name}</span>
            <button 
              onClick={() => setAttachedFile(null)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0A84FF', fontSize: '11px' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Top portion inside white card: Textarea + Submit Arrow */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '14px' }}>
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: '16px',
              color: '#000000',
              resize: 'none',
              overflow: 'hidden',
              lineHeight: '1.45',
              padding: 0
            }}
          />
          <button 
            onClick={handleSend}
            aria-label="Submit search"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: text.trim() || attachedFile ? '#000000' : 'rgba(0, 0, 0, 0.65)',
              color: '#ffffff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform 0.15s ease, background-color 0.15s ease'
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
            marginTop: '14px',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              className="white-card-action"
            >
              <PaperclipIcon />
              <span>Attach PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
