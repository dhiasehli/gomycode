import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const AddFriendModal = ({ isOpen, onClose }) => {
  const { addFriendByUsername } = useChat();
  const { users, currentUser, addFriendPair } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  // Filter out current user from all registered community members
  const otherUsers = users.filter((u) => u.id !== currentUser?.id);
  const myFriendIds = currentUser?.friends || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = addFriendByUsername(usernameInput);
    if (res.success) {
      setSuccess(`Added @${res.user.username} to your friends list! 🎉`);
      setUsernameInput('');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 700);
    } else {
      setError(res.message);
    }
  };

  const handleQuickAdd = (user) => {
    setError('');
    const added = addFriendPair(user.id);
    if (added) {
      setSuccess(`Connected with ${user.displayName}! 🎉`);
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 700);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Add a Real Friend 🤝</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '14px' }}>
          Connect with another real person! They can register an account, and you can chat live.
        </p>

        {error && <div className="auth-alert error">{error}</div>}
        {success && <div className="auth-alert success">{success}</div>}

        {/* Search by Username */}
        <form onSubmit={handleSearchSubmit} className="modal-form">
          <div className="form-group">
            <label>Search by Friend's Username</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="custom-input"
                placeholder="e.g. sarah_99 or sam"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary-gradient" style={{ whiteSpace: 'nowrap' }}>
                Add Friend 🚀
              </button>
            </div>
          </div>
        </form>

        <div className="picker-divider" style={{ margin: '18px 0' }}></div>

        {/* Registered Community Users Directory */}
        <div className="registered-directory-section">
          <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            REGISTERED ACCOUNTS ({otherUsers.length})
          </label>

          {otherUsers.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '8px' }}>
              No other accounts registered yet. Have your friend create an account!
            </p>
          ) : (
            <div className="registered-users-list" style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
              {otherUsers.map((user) => {
                const isAlreadyFriend = myFriendIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: user.avatarBg || '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px'
                        }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <strong style={{ fontSize: '0.86rem', display: 'block' }}>{user.displayName}</strong>
                        <small style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>@{user.username}</small>
                      </div>
                    </div>

                    {isAlreadyFriend ? (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
                        ✓ Friends
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn-xs btn-primary-gradient"
                        onClick={() => handleQuickAdd(user)}
                      >
                        + Connect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ marginTop: '20px' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
