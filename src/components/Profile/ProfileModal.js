import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AVATAR_OPTIONS } from '../../data/initialData';

const ProfileModal = ({ isOpen, onClose }) => {
  const { currentUser, updateProfile, logout } = useAuth();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [mood, setMood] = useState(currentUser?.mood || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [selectedAvatar, setSelectedAvatar] = useState(
    AVATAR_OPTIONS.find((a) => a.emoji === currentUser?.avatar) || AVATAR_OPTIONS[0]
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim() || currentUser.username,
      mood: mood.trim(),
      bio: bio.trim(),
      avatar: selectedAvatar.emoji,
      avatarBg: selectedAvatar.bg
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Your Funny Profile 🪞</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {savedSuccess && <div className="auth-alert success">Profile updated! ✨</div>}

        <form onSubmit={handleSave} className="modal-form">
          <div className="form-group">
            <label>Pick Avatar</label>
            <div className="avatar-selection-grid compact">
              {AVATAR_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`avatar-option-btn ${selectedAvatar.id === item.id ? 'selected' : ''}`}
                  style={{ backgroundColor: item.bg }}
                  onClick={() => setSelectedAvatar(item)}
                  title={item.name}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              className="custom-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Current Mood / Status</label>
            <input
              type="text"
              className="custom-input"
              placeholder="e.g. In search of more cookies 🍪"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <input
              type="text"
              className="custom-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="profile-footer-actions">
            <button
              type="button"
              className="btn-danger-soft"
              onClick={() => {
                onClose();
                logout();
              }}
            >
              Log Out 🚪
            </button>
            <div className="right-btns">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-gradient">
                Save Changes ✨
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
