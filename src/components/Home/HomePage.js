import React from 'react';
import { useAuth } from '../../context/AuthContext';

const HomePage = ({ onOpenLogin, onOpenRegister }) => {
  const { users, switchAccount } = useAuth();

  return (
    <div className="homepage-wrapper">
      {/* Top Navbar */}
      <header className="home-navbar">
        <div className="home-brand">
          <span className="home-logo-icon">💬</span>
          <span className="home-logo-text">ChuckleChat</span>
        </div>
        <div className="home-nav-actions">
          <button className="btn-secondary-pill" onClick={onOpenLogin}>
            Log In
          </button>
          <button className="btn-primary-pill" onClick={onOpenRegister}>
            Create Account ✨
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="home-hero-section">
        <div className="home-hero-content">
          <div className="home-badge-tag">
            <span className="tag-sparkle">✨</span> 100% Real-Time Multi-User Chat
          </div>

          <h1 className="home-hero-title">
            Chat, Laugh & Connect with Real Friends in Real Time
          </h1>

          <p className="home-hero-subtitle">
            Create an account, invite a friend, and start messaging right away.
            Enjoy live typing indicators, instant cross-window sync, funny stickers, and reactions!
          </p>

          <div className="home-cta-buttons">
            <button className="btn-hero-primary" onClick={onOpenRegister}>
              <span>Create Your Account</span>
              <span className="btn-arrow">🚀</span>
            </button>
            <button className="btn-hero-secondary" onClick={onOpenLogin}>
              Log In to Existing Account
            </button>
          </div>

          {/* Quick 1-Click Demo Logins for Reviewers / Testers */}
          {users.length > 0 && (
            <div className="home-quick-login-card">
              <div className="quick-login-header">
                <span>⚡ Instant 1-Click Login (For quick testing)</span>
              </div>
              <div className="quick-login-grid">
                {users.slice(0, 3).map((user) => (
                  <button
                    key={user.id}
                    className="quick-user-btn"
                    onClick={() => switchAccount(user.id)}
                  >
                    <span className="user-btn-avatar" style={{ backgroundColor: user.avatarBg || '#fef08a' }}>
                      {user.avatar || '👤'}
                    </span>
                    <div className="user-btn-details">
                      <strong>{user.displayName}</strong>
                      <small>@{user.username}</small>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="home-features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#e0e7ff' }}>⚡</div>
            <h3>Real-Time Multi-Window Sync</h3>
            <p>
              Open two browser tabs or windows and chat between different accounts live with instant message delivery.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#fce7f3' }}>🎭</div>
            <h3>Funny Avatars & Stickers</h3>
            <p>
              Choose from hilarious avatars, send express stickers, and react with quick emoji pills.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ backgroundColor: '#fef3c7' }}>🤝</div>
            <h3>Community & Friend Search</h3>
            <p>
              Find your friends by username, browse the community directory, and connect with 1 click.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>Built with ❤️ using React &bull; ChuckleChat</p>
      </footer>
    </div>
  );
};

export default HomePage;
