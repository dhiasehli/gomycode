import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DEMO_USERS } from '../data/initialData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Global registered users pool (shared across all tabs via localStorage)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('chuckle_real_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved users', e);
      }
    }
    return INITIAL_DEMO_USERS;
  });

  // Current session per tab (stored in sessionStorage so multiple tabs can be different logged-in users)
  const [currentUser, setCurrentUser] = useState(() => {
    // 1. Check current tab session first
    const tabSession = sessionStorage.getItem('chuckle_session_user');
    if (tabSession) {
      try {
        return JSON.parse(tabSession);
      } catch (e) {
        console.error(e);
      }
    }
    // 2. Check global saved session
    const globalSession = localStorage.getItem('chuckle_auth_user');
    if (globalSession) {
      try {
        return JSON.parse(globalSession);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to null (shows Landing / Home Page when logged out or fresh)
    return null;
  });

  // Sync users to localStorage
  useEffect(() => {
    localStorage.setItem('chuckle_real_users', JSON.stringify(users));
  }, [users]);

  // Sync session
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('chuckle_session_user', JSON.stringify(currentUser));
      localStorage.setItem('chuckle_auth_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('chuckle_session_user');
      localStorage.removeItem('chuckle_auth_user');
    }
  }, [currentUser]);

  // Listen to cross-tab updates for users list
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'chuckle_real_users' && e.newValue) {
        try {
          const updatedUsers = JSON.parse(e.newValue);
          setUsers(updatedUsers);
          if (currentUser) {
            const freshMe = updatedUsers.find((u) => u.id === currentUser.id);
            if (freshMe) {
              setCurrentUser(freshMe);
            }
          }
        } catch (err) {
          console.error('Error syncing cross-tab users', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentUser]);

  const login = (username, password) => {
    const cleanUsername = username.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.password === password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      return { success: true };
    }
    return {
      success: false,
      message: 'Invalid username or password. If you do not have an account, click "Create New Account"!'
    };
  };

  const register = ({ username, password, displayName, avatar, avatarBg, bio }) => {
    const cleanUsername = username.trim().toLowerCase().replace('@', '');
    if (!cleanUsername || !password) {
      return { success: false, message: 'Username and password are required.' };
    }

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: `Username "${cleanUsername}" is already taken! Try another one.` };
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      username: cleanUsername,
      password,
      displayName: displayName?.trim() || cleanUsername,
      avatar: avatar || '😸',
      avatarBg: avatarBg || '#fef08a',
      bio: bio?.trim() || 'Ready to chat in real time! ✨',
      status: 'online',
      mood: 'Active now 🟢',
      friends: [] // Array of friend user IDs
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    localStorage.setItem('chuckle_real_users', JSON.stringify(updatedUsers));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('chuckle_session_user');
    localStorage.removeItem('chuckle_auth_user');
  };

  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    const updatedUsers = users.map((u) => (u.id === updated.id ? updated : u));
    setUsers(updatedUsers);
    localStorage.setItem('chuckle_real_users', JSON.stringify(updatedUsers));
  };

  const addFriendPair = (friendUserId) => {
    if (!currentUser || currentUser.id === friendUserId) return false;

    // Add friend mutually to both accounts
    const myFriends = currentUser.friends || [];
    if (myFriends.includes(friendUserId)) return false;

    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, friends: [...(u.friends || []), friendUserId] };
      }
      if (u.id === friendUserId) {
        return { ...u, friends: [...(u.friends || []), currentUser.id] };
      }
      return u;
    });

    setUsers(updatedUsers);
    const updatedMe = updatedUsers.find((u) => u.id === currentUser.id);
    if (updatedMe) setCurrentUser(updatedMe);
    localStorage.setItem('chuckle_real_users', JSON.stringify(updatedUsers));
    return true;
  };

  const switchAccount = (userId) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        updateProfile,
        addFriendPair,
        switchAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
