import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AVATAR_OPTIONS } from '../../data/initialData';

const AuthModal = ({ isOpen, initialTab = 'login', onClose }) => {
  const { login, register, users, switchAccount } = useAuth();
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'
  
  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Login Form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register Form state
  const [regUsername, setRegUsername] = useState('');
  const [regDisplayName, setRegDisplayName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBio, setRegBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const res = login(loginUsername, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    const res = register({
      username: regUsername,
      password: regPassword,
      displayName: regDisplayName,
      avatar: selectedAvatar.emoji,
      avatarBg: selectedAvatar.bg,
      bio: regBio
    });

    if (res.success) {
      setSuccessMsg('Account created successfully! 🎉');
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      setError(res.message);
    }
  };

  const handleSwitch = (userId) => {
    switchAccount(userId);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="auth-modal-card">
        <div className="modal-header" style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>💬</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>
              {tab === 'login' ? 'Log In to ChuckleChat' : 'Create ChuckleChat Account'}
            </h3>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Existing Registered Accounts Quick Switcher */}
        {users.length > 0 && (
          <div className="demo-box">
            <div className="demo-badge">👥 Quick Switch To Registered Account</div>
            <div className="demo-buttons-grid">
              {users.slice(0, 4).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  className="btn-demo-card"
                  onClick={() => handleSwitch(user.id)}
                  title={`Log in as ${user.displayName}`}
                >
                  <span className="demo-avatar" style={{ backgroundColor: user.avatarBg || '#e2e8f0' }}>
                    {user.avatar || '👤'}
                  </span>
                  <div className="demo-info">
                    <strong>{user.displayName}</strong>
                    <small>@{user.username}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Log In
          </button>
          <button
            className={`tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Create New Account 🌟
          </button>
        </div>

        {error && <div className="auth-alert error">{error}</div>}
        {successMsg && <div className="auth-alert success">{successMsg}</div>}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="custom-input"
                placeholder="e.g. alex or sam"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="custom-input"
                placeholder="e.g. password123"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary-gradient w-100">
              Log In to Chat 🚀
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label>Choose Your Funny Avatar</label>
              <div className="avatar-selection-grid">
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

            <div className="row-2-col">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="e.g. cool_banana"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Sir Banana 🍌"
                  value={regDisplayName}
                  onChange={(e) => setRegDisplayName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="custom-input"
                placeholder="Create a password..."
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Funny Bio / Status</label>
              <input
                type="text"
                className="custom-input"
                placeholder="e.g. Always ready to talk tech and memes ☕"
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary-gradient w-100">
              Create My Account ✨
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
