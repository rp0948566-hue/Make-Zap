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
      text: `Code generation & clone session initialized for "${initialQuery.replace('/code', '').trim() || 'Website Clone & Downloader'}". Workspace active.` 
    }
  ]);
  const [deviceMode, setDeviceMode] = useState('desktop'); // 'mobile' | 'desktop'
  const [panelTabMode, setPanelTabMode] = useState('code'); // Auto-select /code mode
  const [isPaneVisible, setIsPaneVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState('index.html');
  const [folder1Open, setFolder1Open] = useState(true);
  const [folder2Open, setFolder2Open] = useState(true);

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
      text: `Updated clone configuration for "${queryText}". Workspace files updated.`
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const isMobileMode = deviceMode === 'mobile';

  const folder1Files = [
    { name: 'index.html', type: 'html' },
    { name: 'App.jsx', type: 'jsx' },
    { name: 'HeroSection.jsx', type: 'jsx' },
    { name: 'LeadCaptureForm.jsx', type: 'jsx' },
    { name: 'styles.css', type: 'css' }
  ];

  const folder2Files = [
    { name: 'downloader.py', type: 'py' },
    { name: 'site_cloner.js', type: 'js' },
    { name: 'asset_extractor.js', type: 'js' },
    { name: 'README.md', type: 'md' }
  ];

  const codeSnippets = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mark Zap Cloned Site Showcase</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="bg-black text-white font-sans">
  <div id="root"></div>
  <script type="module" src="/App.jsx"></script>
</body>
</html>`,
    'App.jsx': `import React from 'react';
import { HeroSection } from './HeroSection';
import { LeadCaptureForm } from './LeadCaptureForm';

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center">
      <HeroSection />
      <LeadCaptureForm />
    </main>
  );
}`,
    'HeroSection.jsx': `import React from 'react';

export const HeroSection = () => {
  return (
    <section className="py-20 px-8 max-w-5xl mx-auto text-center">
      <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
        High-Converting Cloned Website Engine
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto">
        Automated website downloader & clone showcase with real-time lead capture integration.
      </p>
    </section>
  );
};`,
    'LeadCaptureForm.jsx': `import React, { useState } from 'react';

export const LeadCaptureForm = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Lead captured successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
      <input 
        type="email" 
        placeholder="Enter business email..." 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white flex-1"
      />
      <button type="submit" className="px-6 py-3 rounded-lg bg-green-500 text-black font-semibold">
        Submit Lead
      </button>
    </form>
  );
};`,
    'styles.css': `/* Website Cloner Custom CSS Rules */
body {
  margin: 0;
  padding: 0;
  background-color: #040605;
  color: #ffffff;
  font-family: 'Schibsted Grotesk', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.hero-gradient {
  background: linear-gradient(135deg, rgba(48,209,88,0.15) 0%, rgba(10,132,255,0.15) 100%);
}`,
    'downloader.py': `# Complete Website Downloader Engine
import urllib.request
import os

def download_site_assets(url, output_dir):
    print(f"[*] Downloading website structure from {url} to {output_dir}...")
    os.makedirs(output_dir, exist_ok=True)
    # Asset extraction & local mirror saving logic
    print("[✓] Website assets successfully mirrored.")

if __name__ == "__main__":
    download_site_assets("https://example-lead-target.com", "./downloads")`,
    'site_cloner.js': `// Site Cloner Module — Complete Asset Extractor
import fs from 'fs';
import path from 'path';

export async function cloneWebsiteStructure(targetUrl) {
  console.log(\`[Cloner] Processing \${targetUrl}...\`);
  // Mirror DOM, CSS styles, and asset images
  return { status: 200, assetsExtracted: 48 };
}`,
    'asset_extractor.js': `// Asset Extractor Script
export function extractImagesAndFonts(htmlString) {
  const imageRegex = /<img[^>]+src="([^">]+)"/g;
  const matches = [...htmlString.matchAll(imageRegex)];
  return matches.map(m => m[1]);
}`,
    'README.md': `# Complete Website Downloader & Cloner Workspace

This workspace contains automated website downloading, asset extraction, and JSX clone rendering modules.

## Features Included
- HTML5 / React JSX Clone Mirror
- Automated CSS & Media Asset Extractor
- Deep Python & Node.js Downloader Scripts
`
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
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#30D158' }}>Code Studio (/code)</span>
          </div>

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
            placeholder="Write code or clone command..." 
          />
        </div>
      </div>

      {/* Right Column: Code Studio & Website Cloner Workspace */}
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
          {/* Main Tab Switchers - Auto Select /code Mode */}
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
              💻 Code Workspace (/code)
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
                    cursor: 'pointer'
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
                    cursor: 'pointer'
                  }}
                >
                  🖥️ Desktop
                </button>
              </div>
            )}

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

        {/* Panel Main Area: Code View with 2 Integrated Folders */}
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
            {/* Explorer Sidebar Tree */}
            <div
              style={{
                width: '260px',
                backgroundColor: 'rgba(12, 16, 14, 0.95)',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '16px 10px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                fontFamily: "'SFMono-Regular', Consolas, monospace",
                fontSize: '12px',
                userSelect: 'none',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                EXPLORER
              </div>

              {/* FOLDER 1: clone_of_the_website_shown_in_the_image_otmtyq */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  onClick={() => setFolder1Open(!folder1Open)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#30D158',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(48, 209, 88, 0.1)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title="clone_of_the_website_shown_in_the_image_otmtyq"
                >
                  <span style={{ fontSize: '10px', transition: 'transform 0.15s ease', transform: folder1Open ? 'rotate(90deg)' : 'none' }}>▶</span>
                  <span>📁 website_clone_otmtyq</span>
                </div>

                {folder1Open && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '14px', marginTop: '2px' }}>
                    {folder1Files.map((f, idx) => {
                      const isSelected = selectedFile === f.name;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedFile(f.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                            color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 400,
                            fontSize: '11.5px'
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#0A84FF' }}>📄</span>
                          <span>{f.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* FOLDER 2: Complete-Website-Downloader-main */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div
                  onClick={() => setFolder2Open(!folder2Open)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#0A84FF',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(10, 132, 255, 0.1)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title="Complete-Website-Downloader-main"
                >
                  <span style={{ fontSize: '10px', transition: 'transform 0.15s ease', transform: folder2Open ? 'rotate(90deg)' : 'none' }}>▶</span>
                  <span>📁 Website-Downloader</span>
                </div>

                {folder2Open && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingLeft: '14px', marginTop: '2px' }}>
                    {folder2Files.map((f, idx) => {
                      const isSelected = selectedFile === f.name;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedFile(f.name)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '5px 8px',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                            color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 400,
                            fontSize: '11.5px'
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#FF9F0A' }}>📄</span>
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
                    Active Clone Module
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
