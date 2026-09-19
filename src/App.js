import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/Chat/ChatWindow';
import AuthModal from './components/Auth/AuthModal';
import AddFriendModal from './components/Sidebar/AddFriendModal';
import ProfileModal from './components/Profile/ProfileModal';
import HomePage from './components/Home/HomePage';

function MainApp() {
  const { currentUser } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleOpenLogin = () => {
    setAuthInitialTab('login');
    setIsAuthOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthInitialTab('register');
    setIsAuthOpen(true);
  };

  // If no user is logged in, show the Landing / Home Page
  if (!currentUser) {
    return (
      <div className="home-container">
        <HomePage
          onOpenLogin={handleOpenLogin}
          onOpenRegister={handleOpenRegister}
        />

        <AuthModal
          isOpen={isAuthOpen}
          initialTab={authInitialTab}
          onClose={() => setIsAuthOpen(false)}
        />
      </div>
    );
  }

  // If logged in, show full chat application
  return (
    <div className="app-container">
      <div className="chat-app-frame">
        {/* Left Navigation & Contacts Sidebar */}
        <Sidebar
          onOpenAddFriend={() => setIsAddFriendOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuth={handleOpenLogin}
        />

        {/* Right Active Chat Workspace */}
        <ChatWindow />
      </div>

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={isAuthOpen}
        initialTab={authInitialTab}
        onClose={() => setIsAuthOpen(false)}
      />

      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <MainApp />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
