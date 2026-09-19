import React from 'react';
import { FUNNY_STICKERS, QUICK_PROMPTS } from '../../data/initialData';

const StickerPicker = ({ onSelectSticker, onSelectPrompt, onClose }) => {
  return (
    <div className="sticker-picker-popover">
      <div className="picker-header">
        <span className="picker-title">🎭 Quick Funny Prompts</span>
        <button className="picker-close" onClick={onClose}>✕</button>
      </div>
      
      {/* Quick Prompts */}
      <div className="prompts-list">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            className="prompt-chip"
            onClick={() => onSelectPrompt(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="picker-divider"></div>
      
      <div className="picker-section-title">✨ Funny Stickers & Reactions</div>
      <div className="stickers-grid">
        {FUNNY_STICKERS.map((sticker) => (
          <button
            key={sticker.id}
            type="button"
            className="sticker-item-btn"
            onClick={() => onSelectSticker(sticker)}
            title={sticker.label}
          >
            <span className="sticker-emoji">{sticker.emoji}</span>
            <span className="sticker-label">{sticker.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickerPicker;
