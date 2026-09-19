import React, { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import StickerPicker from './StickerPicker';

const QUICK_EMOJIS = ['😂', '🚀', '🍕', '🎉', '🔥', '❤️', '👏', '👀'];

const MessageInput = () => {
  const { sendMessage, sendTypingSignal, activeFriend } = useChat();
  const [text, setText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const inputRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    sendTypingSignal();
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text, 'text');
    setText('');
    setShowStickers(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectSticker = (sticker) => {
    sendMessage(sticker.emoji + ' ' + sticker.label, 'sticker');
    setShowStickers(false);
  };

  const handleSelectPrompt = (prompt) => {
    sendMessage(prompt, 'text');
    setShowStickers(false);
  };

  const handleQuickEmoji = (emoji) => {
    sendMessage(emoji, 'text');
  };

  return (
    <div className="message-input-container">
      {/* Quick Reaction Tap Bar */}
      <div className="quick-reactions-bar">
        <span className="quick-reactions-label">Quick emojis:</span>
        <div className="quick-reactions-list">
          {QUICK_EMOJIS.map((emoji, idx) => (
            <button
              key={idx}
              type="button"
              className="quick-emoji-btn"
              onClick={() => handleQuickEmoji(emoji)}
              title={`Send ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {showStickers && (
        <StickerPicker
          onSelectSticker={handleSelectSticker}
          onSelectPrompt={handleSelectPrompt}
          onClose={() => setShowStickers(false)}
        />
      )}

      <form onSubmit={handleSend} className="message-form">
        <button
          type="button"
          className={`btn-icon-addon ${showStickers ? 'active' : ''}`}
          onClick={() => setShowStickers(!showStickers)}
          title="Pick stickers & conversation starters"
        >
          🎭
        </button>

        <input
          ref={inputRef}
          type="text"
          className="message-text-input"
          placeholder={`Message ${activeFriend ? activeFriend.displayName : 'friend'}... (Press Enter to send)`}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
        />

        <button
          type="submit"
          className="btn-send-message"
          disabled={!text.trim()}
          title="Send message"
        >
          <span>Send</span>
          <span className="send-icon">🚀</span>
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
