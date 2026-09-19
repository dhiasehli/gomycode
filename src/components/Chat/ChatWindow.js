import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import MessageInput from './MessageInput';

const REACTION_PALETTE = ['😂', '❤️', '🔥', '👏', '🎉', '🍕', '💩'];

const ChatWindow = () => {
  const { activeFriend, isTyping, addReaction, deleteMessage, clearChat, soundEnabled, setSoundEnabled } = useChat();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messages = activeFriend?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  if (!activeFriend) {
    return (
      <div className="chat-window-empty">
        <div className="empty-graphic">💬</div>
        <h3>No chat selected</h3>
        <p className="text-muted">
          Add a friend or select a contact from the left sidebar to start chatting!
        </p>
      </div>
    );
  }

  const handleClear = () => {
    clearChat(activeFriend.id);
    setShowClearConfirm(false);
  };

  return (
    <div className="chat-window-container">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div
            className="chat-header-avatar"
            style={{ backgroundColor: activeFriend.avatarBg || '#e2e8f0' }}
          >
            {activeFriend.avatar}
            <span className="status-dot-badge online"></span>
          </div>
          <div className="chat-header-text">
            <div className="header-title-row">
              <h4>{activeFriend.displayName}</h4>
              <span className="username-tag">@{activeFriend.username}</span>
            </div>
            <p className="header-tagline">
              {isTyping ? (
                <span className="typing-header-text">{activeFriend.displayName} is typing... ✍️</span>
              ) : (
                activeFriend.mood || activeFriend.bio || 'Online & Ready to chat!'
              )}
            </p>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            className="header-action-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          >
            {soundEnabled ? '🔔' : '🔕'}
          </button>

          <button
            className="header-action-btn"
            onClick={() => setShowClearConfirm(!showClearConfirm)}
            title="Clear chat history"
          >
            🗑️
          </button>

          {showClearConfirm && (
            <div className="clear-confirm-popover">
              <p>Clear conversation with <strong>{activeFriend.displayName}</strong>?</p>
              <div className="clear-btns">
                <button className="btn-xs btn-secondary" onClick={() => setShowClearConfirm(false)}>
                  Cancel
                </button>
                <button className="btn-xs btn-danger" onClick={handleClear}>
                  Yes, Clear
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="messages-scroll-area">
        {messages.length === 0 ? (
          <div className="chat-empty-thread">
            <div className="empty-thread-emoji">{activeFriend.avatar}</div>
            <h5>Direct conversation with {activeFriend.displayName}</h5>
            <p className="text-muted">@{activeFriend.username} &bull; {activeFriend.bio}</p>
            <div className="starter-hint">Send the first message or a funny sticker below! 👇</div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.fromId === currentUser?.id;
            const isHovered = hoveredMsgId === msg.id;

            return (
              <div
                key={msg.id}
                className={`message-row ${isMe ? 'msg-outgoing' : 'msg-incoming'}`}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                {!isMe && (
                  <div
                    className="msg-avatar-thumb"
                    style={{ backgroundColor: activeFriend.avatarBg || '#e2e8f0' }}
                    title={activeFriend.displayName}
                  >
                    {activeFriend.avatar}
                  </div>
                )}

                <div className="message-content-wrapper">
                  <div className={`message-bubble ${msg.type === 'sticker' ? 'sticker-bubble' : ''}`}>
                    {msg.type === 'sticker' ? (
                      <div className="sticker-content">{msg.text}</div>
                    ) : (
                      <div className="msg-text-content">{msg.text}</div>
                    )}
                    <span className="message-timestamp">
                      {msg.timestamp}
                      {isMe && <span className="read-receipt"> ✓✓</span>}
                    </span>
                  </div>

                  {/* Reactions Pill Display */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="message-reactions-row">
                      {msg.reactions.map((emoji, rIdx) => (
                        <button
                          key={rIdx}
                          className="reaction-pill"
                          onClick={() => addReaction(msg.id, emoji)}
                          title="Click to toggle reaction"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Hover Reaction Toolbar */}
                  {isHovered && (
                    <div className={`message-hover-toolbar ${isMe ? 'left-aligned' : 'right-aligned'}`}>
                      <div className="quick-react-palette">
                        {REACTION_PALETTE.map((emoji, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="btn-tiny-react"
                            onClick={() => addReaction(msg.id, emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-tiny-delete"
                        onClick={() => deleteMessage(msg.id)}
                        title="Delete message"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {isMe && (
                  <div
                    className="msg-avatar-thumb user-thumb"
                    style={{ backgroundColor: currentUser?.avatarBg || '#fef08a' }}
                    title={currentUser?.displayName}
                  >
                    {currentUser?.avatar || '😸'}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Real-time Typing Indicator */}
        {isTyping && (
          <div className="message-row msg-incoming typing-row">
            <div
              className="msg-avatar-thumb"
              style={{ backgroundColor: activeFriend.avatarBg || '#e2e8f0' }}
            >
              {activeFriend.avatar}
            </div>
            <div className="typing-bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="typing-label">{activeFriend.displayName} is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Footer */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
