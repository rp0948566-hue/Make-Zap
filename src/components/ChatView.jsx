import React, { useState, useEffect } from 'react';
import { SearchInputBox } from './SearchInputBox';
import { useAuth } from '../AuthContext';
import { saveChatToSupabase } from '../chatService';
import { generateMarkZapAIResponse } from '../aiEngine';

export const ChatView = ({ initialQuery }) => {
  const { user } = useAuth();
  
  const initialAIResponse = generateMarkZapAIResponse(initialQuery || '');

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      text: initialQuery
    },
    {
      id: 2,
      sender: 'ai',
      text: initialQuery ? initialAIResponse.text : '',
      leads: initialAIResponse.leads
    }
  ]);

  // Automatically sync chat to Supabase database when updated
  useEffect(() => {
    if (initialQuery && messages.length > 0) {
      saveChatToSupabase(user?.id, initialQuery, messages);
    }
  }, [messages, user, initialQuery]);

  const handleSendFollowUp = (queryText) => {
    if (!queryText.trim()) return;
    
    const aiResponse = generateMarkZapAIResponse(queryText);

    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    const aiMsg = {
      id: Date.now() + 1,
      sender: 'ai',
      text: aiResponse.text,
      leads: aiResponse.leads
    };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  return (
    <div 
      style={{
        position: 'relative',
        zIndex: 20,
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '60px 20px 140px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#ffffff',
        fontFamily: "'Schibsted Grotesk', 'Inter', sans-serif"
      }}
    >
      {/* Messages Conversation Stream */}
      <div 
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        {messages.map((msg) => {
          if (!msg.text) return null;

          if (msg.sender === 'user') {
            return (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  width: '100%'
                }}
              >
                {/* User Sender Label */}
                <div 
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.55)',
                    marginBottom: '6px',
                    paddingRight: '4px'
                  }}
                >
                  You
                </div>

                {/* User Message inside a sleek white card box */}
                <div 
                  style={{
                    maxWidth: '85%',
                    padding: '16px 22px',
                    borderRadius: '18px 18px 4px 18px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#000000',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    fontWeight: 400
                  }}
                >
                  <p style={{ margin: 0 }}>{msg.text}</p>
                </div>
              </div>
            );
          }

          /* AI Response: Dynamic Mark Zap AI Intelligence Output */
          return (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                marginTop: '4px'
              }}
            >
              {/* AI Sender Label */}
              <div 
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.55)',
                  marginBottom: '6px',
                  paddingLeft: '4px'
                }}
              >
                Mark Zap AI Engine
              </div>

              {/* AI Response Text */}
              <div 
                style={{
                  maxWidth: '90%',
                  color: '#ffffff',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  fontWeight: 400,
                  paddingLeft: '4px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Docked Bottom Typing Bar */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '728px',
          zIndex: 50,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <SearchInputBox 
          onSubmit={handleSendFollowUp} 
          placeholder="Ask a follow-up question..." 
        />
      </div>
    </div>
  );
};
