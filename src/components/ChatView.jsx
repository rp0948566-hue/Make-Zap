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

          /* AI Response: Dynamic Mark Zap AI Agent-Reach Output */
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
                Mark Zap Agent-Reach AI Engine
              </div>

              {/* AI Response Text */}
              <div 
                style={{
                  width: '100%',
                  color: '#ffffff',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  fontWeight: 400,
                  paddingLeft: '4px',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}
              </div>

              {/* Agent-Reach Interactive Prospect Lead Cards */}
              {msg.leads && msg.leads.length > 0 && (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                  {msg.leads.map((lead, lIdx) => (
                    <div
                      key={lIdx}
                      style={{
                        backgroundColor: 'rgba(14, 18, 16, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '16px',
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff' }}>{lead.name}</div>
                          <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '2px' }}>
                            {lead.type} • {lead.location}
                          </div>
                        </div>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#ff453a', backgroundColor: 'rgba(255, 69, 58, 0.15)', padding: '4px 10px', borderRadius: '8px' }}>
                          {lead.websiteStatus}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div><strong>Phone:</strong> <a href={`tel:${lead.phone}`} style={{ color: '#30D158', textDecoration: 'none' }}>{lead.phone}</a></div>
                        <div><strong>Email:</strong> <a href={`mailto:${lead.email}`} style={{ color: '#0A84FF', textDecoration: 'none' }}>{lead.email}</a></div>
                        <div><strong>Rating:</strong> {lead.rating}</div>
                      </div>

                      <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.65)' }}>
                        <strong>Social Profiles:</strong> {lead.social}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                        <a
                          href={lead.gmapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            backgroundColor: 'rgba(10, 132, 255, 0.18)',
                            color: '#0A84FF',
                            border: '1px solid rgba(10, 132, 255, 0.3)',
                            borderRadius: '8px',
                            padding: '6px 14px',
                            fontSize: '12.5px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          📍 Open in Google Maps
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          placeholder="Search businesses without a website in any location..." 
        />
      </div>
    </div>
  );
};
