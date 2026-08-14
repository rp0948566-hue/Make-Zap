import React from 'react';
import { SearchInputBox } from './SearchInputBox';
import { ChatView } from './ChatView';
import { CodeStudioView } from './CodeStudioView';

export const HeroContent = ({ activeQuery, onInitialSubmit }) => {
  if (activeQuery) {
    const isCodeMode = activeQuery.trim().startsWith('/code');

    if (isCodeMode) {
      return <CodeStudioView initialQuery={activeQuery} />;
    }

    return (
      <>
        {/* Soft Background Blur Overlay for Chat mode readability */}
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 8, 7, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 5,
            transition: 'opacity 0.3s ease'
          }}
        />
        <ChatView initialQuery={activeQuery} />
      </>
    );
  }

  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '740px',
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
        margin: '0 auto'
      }}
    >
      {/* Search Input Box */}
      <SearchInputBox onSubmit={onInitialSubmit} />
    </div>
  );
};
