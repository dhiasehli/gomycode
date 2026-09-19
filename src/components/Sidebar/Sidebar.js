import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onOpenAddFriend, onOpenProfile, onOpenAuth }) => {
  const { friends, activeFriendId, selectFriend, searchTerm, setSearchTerm } = useChat();
  const { currentUser } = useAuth();

  return (
    <aside className="chat-sidebar">
      {/* Sidebar Top Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon-wrap">💬</div>
          <div>
            <h1 className="brand-title">ChuckleChat</h1>
            <span className="brand-sub">Real Friends & Live Chat</span>
          </div>
        </div>

        <button
          className="btn-add-friend"
          onClick={onOpenAddFriend}
          title="Add a real friend by username"
        >
          <span>+ Add Friend</span>
        </button>
      </div>

      {/* Search Friends Input */}
      <div className="sidebar-search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search your friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
            ✕
          </button>
        )}
      </div>

      {/* Friends List */}
      <div className="friends-list-container">
        <div className="friends-list-header">
          <span className="section-label">FRIENDS ({friends.length})</span>
          <span className="online-count">
            🟢 {friends.length} connected
          </span>
        </div>

        {friends.length === 0 ? (
          <div className="no-friends-empty">
            <div className="empty-emoji">👋</div>
            <p>No friends connected yet!</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '4px' }}>
              Click <strong>"+ Add Friend"</strong> to connect with your friend's account.
            </p>
            <button className="btn-primary-gradient" style={{ marginTop: '12px', fontSize: '0.82rem' }} onClick={onOpenAddFriend}>
              + Find & Add Friends
            </button>
          </div>
        ) : (
          <ul className="friends-list">
            {friends.map((friend) => {
              const isActive = friend.id === activeFriendId;
              const lastMsg = friend.lastMsg;

              return (
                <li
                  key={friend.id}
                  className={`friend-item ${isActive ? 'active' : ''}`}
                  onClick={() => selectFriend(friend.id)}
                >
                  <div
                    className="friend-avatar-wrap"
                    style={{ backgroundColor: friend.avatarBg || '#e2e8f0' }}
                  >
                    <span className="friend-emoji">{friend.avatar}</span>
                    <span className="friend-status-dot online"></span>
                  </div>

                  <div className="friend-item-info">
                    <div className="friend-name-row">
                      <span className="friend-display-name">{friend.displayName}</span>
                      {lastMsg && (
                        <span className="last-msg-time">{lastMsg.timestamp}</span>
                      )}
                    </div>
                    <div className="friend-preview-row">
                      <span className="last-msg-preview">
                        {lastMsg ? lastMsg.text : <em>No messages yet</em>}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Current User Profile Footer */}
      <div className="sidebar-user-footer">
        {currentUser ? (
          <div className="current-user-card" onClick={onOpenProfile}>
            <div
              className="current-user-avatar"
              style={{ backgroundColor: currentUser.avatarBg || '#fef08a' }}
            >
              {currentUser.avatar || '😸'}
              <span className="current-user-dot"></span>
            </div>
            <div className="current-user-details">
              <span className="user-name">{currentUser.displayName}</span>
              <span className="user-mood">{currentUser.mood || `@${currentUser.username}`}</span>
            </div>
            <button
              className="btn-settings-icon"
              onClick={(e) => {
                e.stopPropagation();
                onOpenProfile();
              }}
              title="Edit Profile / Switch Account"
            >
              ⚙️
            </button>
          </div>
        ) : (
          <div className="guest-login-banner">
            <button className="btn-primary-gradient w-100" onClick={onOpenAuth}>
              Log In / Register 🚀
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
