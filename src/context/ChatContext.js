import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_MESSAGES } from '../data/initialData';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser, users, addFriendPair } = useAuth();

  // All messages pool shared in localStorage
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chuckle_real_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    }
    return INITIAL_MESSAGES;
  });

  const [activeFriendId, setActiveFriendId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingFriendId, setTypingFriendId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const broadcastChannelRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Sync messages to localStorage
  useEffect(() => {
    localStorage.setItem('chuckle_real_messages', JSON.stringify(messages));
  }, [messages]);

  // Audio Notification
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      // Browser audio restriction safeguard
    }
  }, [soundEnabled]);

  // Initialize Broadcast Channel for multi-tab / real-time messaging
  useEffect(() => {
    try {
      const bc = new BroadcastChannel('chuckle_chat_realtime');
      broadcastChannelRef.current = bc;

      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'NEW_MESSAGE') {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.id)) return prev;
            return [...prev, payload];
          });

          // Play sound if incoming message is addressed to current user
          if (currentUser && payload.toId === currentUser.id) {
            playNotificationSound();
          }
        } else if (type === 'MESSAGES_UPDATED') {
          setMessages(payload);
        } else if (type === 'TYPING') {
          if (currentUser && payload.toId === currentUser.id) {
            setTypingFriendId(payload.fromId);
            setIsTyping(true);
            if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
            typingTimerRef.current = setTimeout(() => {
              setIsTyping(false);
              setTypingFriendId(null);
            }, 2000);
          }
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment', e);
    }

    // Storage listener fallback
    const handleStorage = (e) => {
      if (e.key === 'chuckle_real_messages' && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue);
          setMessages(fresh);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      if (broadcastChannelRef.current) broadcastChannelRef.current.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [currentUser, playNotificationSound]);

  // Derive real friends list for current user
  const friendIds = currentUser?.friends || [];
  const friendsList = useMemo(() => {
    if (!currentUser) return [];
    return friendIds
      .map((id) => users.find((u) => u.id === id))
      .filter(Boolean)
      .map((friend) => {
        // Calculate conversation messages with this friend
        const thread = messages.filter(
          (m) =>
            (m.fromId === currentUser.id && m.toId === friend.id) ||
            (m.fromId === friend.id && m.toId === currentUser.id)
        );
        const lastMsg = thread.length > 0 ? thread[thread.length - 1] : null;

        return {
          ...friend,
          messages: thread,
          lastMsg,
          unreadCount: 0
        };
      });
  }, [currentUser, friendIds, users, messages]);

  // Set default active friend if none selected
  useEffect(() => {
    if (friendsList.length > 0) {
      if (!activeFriendId || !friendsList.some((f) => f.id === activeFriendId)) {
        setActiveFriendId(friendsList[0].id);
      }
    } else {
      setActiveFriendId(null);
    }
  }, [friendsList, activeFriendId]);

  const activeFriend = friendsList.find((f) => f.id === activeFriendId) || null;

  const selectFriend = useCallback((id) => {
    setActiveFriendId(id);
  }, []);

  const sendTypingSignal = () => {
    if (!currentUser || !activeFriendId) return;
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'TYPING',
        payload: { fromId: currentUser.id, toId: activeFriendId }
      });
    } catch (e) {}
  };

  const sendMessage = (text, type = 'text', mediaUrl = null) => {
    if (!text?.trim() && !mediaUrl) return;
    if (!activeFriendId || !currentUser) return;

    const newMsg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      fromId: currentUser.id,
      toId: activeFriendId,
      text: text.trim(),
      type: type, // 'text' | 'sticker'
      mediaUrl: mediaUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem('chuckle_real_messages', JSON.stringify(updated));

    // Broadcast in real-time across tabs/windows
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'NEW_MESSAGE',
        payload: newMsg
      });
    } catch (e) {}
  };

  const addReaction = (messageId, emoji) => {
    const updated = messages.map((m) => {
      if (m.id === messageId) {
        const reactions = m.reactions || [];
        const exists = reactions.includes(emoji);
        const updatedReactions = exists
          ? reactions.filter((r) => r !== emoji)
          : [...reactions, emoji];
        return { ...m, reactions: updatedReactions };
      }
      return m;
    });

    setMessages(updated);
    localStorage.setItem('chuckle_real_messages', JSON.stringify(updated));
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'MESSAGES_UPDATED',
        payload: updated
      });
    } catch (e) {}
  };

  const deleteMessage = (messageId) => {
    const updated = messages.filter((m) => m.id !== messageId);
    setMessages(updated);
    localStorage.setItem('chuckle_real_messages', JSON.stringify(updated));
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'MESSAGES_UPDATED',
        payload: updated
      });
    } catch (e) {}
  };

  const clearChat = (friendId) => {
    if (!currentUser) return;
    const updated = messages.filter(
      (m) =>
        !(
          (m.fromId === currentUser.id && m.toId === friendId) ||
          (m.fromId === friendId && m.toId === currentUser.id)
        )
    );
    setMessages(updated);
    localStorage.setItem('chuckle_real_messages', JSON.stringify(updated));
    try {
      broadcastChannelRef.current?.postMessage({
        type: 'MESSAGES_UPDATED',
        payload: updated
      });
    } catch (e) {}
  };

  const addFriendByUsername = (usernameQuery) => {
    const clean = usernameQuery.trim().toLowerCase().replace('@', '');
    if (!clean) return { success: false, message: 'Please enter a username.' };
    if (currentUser && currentUser.username.toLowerCase() === clean) {
      return { success: false, message: 'You cannot add yourself as a friend!' };
    }

    const targetUser = users.find((u) => u.username.toLowerCase() === clean);
    if (!targetUser) {
      return {
        success: false,
        message: `User "@${clean}" not found. Make sure your friend has registered their account!`
      };
    }

    if (friendIds.includes(targetUser.id)) {
      return { success: false, message: `You are already friends with @${clean}!` };
    }

    addFriendPair(targetUser.id);
    setActiveFriendId(targetUser.id);
    return { success: true, user: targetUser };
  };

  // Filtered friends
  const filteredFriends = friendsList.filter(
    (f) =>
      f.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.bio && f.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <ChatContext.Provider
      value={{
        friends: filteredFriends,
        allFriends: friendsList,
        activeFriend,
        activeFriendId,
        selectFriend,
        sendMessage,
        sendTypingSignal,
        addReaction,
        deleteMessage,
        clearChat,
        addFriendByUsername,
        isTyping: isTyping && typingFriendId === activeFriendId,
        searchTerm,
        setSearchTerm,
        soundEnabled,
        setSoundEnabled
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
