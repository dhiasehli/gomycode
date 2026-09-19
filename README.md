# ChuckleChat 💬✨

> A vibrant, playful, and **100% real-time chat application** built with **React**, featuring real user registration, multi-session management, live cross-tab/cross-window messaging, typing indicators, animated reactions, and zero fake bots.

---

## 🌟 How It Works (Real Users & Friends)

ChuckleChat is designed for real conversations between real accounts:

1. **User A Creates an Account**: Open the app and register as your username (or use the preloaded `alex`).
2. **User B Creates an Account**: Open a second browser tab or window and register as your friend (or use `sam`).
3. **Connect**: Click `+ Add Friend` to search by username or pick from the community directory to connect.
4. **Live Real-Time Chatting**: When User A types, User B sees the live typing indicator in real time. When User A hits send, User B immediately receives the message, notification chime, and can react with live emoji stickers!

---

## 🚀 Key Features

### 1. 🔐 Real User Accounts & Multi-Session Support
- **Sign Up & Log In**: Register custom user accounts with custom avatars, display names, and bios.
- **Multi-Tab Session Isolation**: Test with multiple logged-in accounts on the same machine without them overwriting each other.
- **Persistence**: All registered users, friend networks, and message histories persist across page refreshes.

### 2. ⚡ Live Real-Time Multi-Tab Sync
- **BroadcastChannel & Storage Engine**: Messages, typing signals, and reactions synchronize instantly across open tabs/windows in real time.
- **Live Typing Signals**: Real-time indicator shows when your friend is actively writing a message.
- **Audio Chimes**: Web Audio API sound alerts when new messages arrive.

### 3. 🤝 Friend & Contact Management
- **Search by Username**: Connect directly with any registered username.
- **Community Directory**: Browse registered accounts and send 1-click connect requests.
- **Real-Time Search Bar**: Instant filtering of your active chats and friends.

### 4. 🎨 Playful & Modern UI / UX
- **Vibrant Glassmorphism Design**: Gradient accents, frosted glass cards, responsive layout, and Google Fonts (*Fredoka* & *Outfit*).
- **Emoji Reactions & Stickers**: Quick reaction bar (`😂`, `🚀`, `🍕`, `🎉`, `🔥`, `❤️`, `👏`, `👀`) and expandable sticker drawer.
- **Message Controls**: Delete messages or clear conversation history.

---

## 🛠️ Getting Started & Testing

### 1. Install & Start
```bash
npm install --legacy-peer-deps
npm start
```
*(On Windows PowerShell if scripts are blocked, use `npm.cmd install --legacy-peer-deps` and `npm.cmd start`)*

### 2. Test Real Chat in 2 Windows
1. Open [http://localhost:3000](http://localhost:3000) in **Window 1** (logged in as `Alex Rivers 🎸`).
2. Open [http://localhost:3000](http://localhost:3000) in **Window 2** or an Incognito tab, click the profile in bottom-left & switch to `Sam Taylor 🚀` (or register a brand new account).
3. Type a message from Window 1 — watch Window 2 show the live typing indicator, receive the message instantly with an audio chime, and send emoji reactions!
