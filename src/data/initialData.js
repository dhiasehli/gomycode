export const AVATAR_OPTIONS = [
  { id: 'cat', emoji: '😸', name: 'Cool Cat', bg: '#fef08a' },
  { id: 'dog', emoji: '🐶', name: 'Good Boi', bg: '#fed7aa' },
  { id: 'robot', emoji: '🤖', name: 'Beep Boop', bg: '#bae6fd' },
  { id: 'alien', emoji: '👽', name: 'Zorblax', bg: '#bbf7d0' },
  { id: 'ninja', emoji: '🥷', name: 'Sneaky Ninja', bg: '#e2e8f0' },
  { id: 'wizard', emoji: '🧙‍♂️', name: 'Arcane Guy', bg: '#ddd6fe' },
  { id: 'unicorn', emoji: '🦄', name: 'Sparkle Horn', bg: '#fbcfe8' },
  { id: 'potato', emoji: '🥔', name: 'Couch Potato', bg: '#fde68a' },
  { id: 'panda', emoji: '🐼', name: 'Bamboo Muncher', bg: '#f1f5f9' },
  { id: 'pizza', emoji: '🍕', name: 'Sir Crust', bg: '#fed7aa' },
];

export const FUNNY_STICKERS = [
  { id: 's1', emoji: '😹', label: 'Crying Laughing' },
  { id: 's2', emoji: '🚀', label: 'To The Moon' },
  { id: 's3', emoji: '🍕', label: 'Pizza Time' },
  { id: 's4', emoji: '🌮', label: 'Taco Fiesta' },
  { id: 's5', emoji: '🔥', label: 'Lit' },
  { id: 's6', emoji: '👀', label: 'Side Eye' },
  { id: 's7', emoji: '💃', label: 'Boogie Down' },
  { id: 's8', emoji: '🍿', label: 'Drama Popcorn' },
  { id: 's9', emoji: '💀', label: 'I am Deceased' },
  { id: 's10', emoji: '🤯', label: 'Mind Blown' },
  { id: 's11', emoji: '🥑', label: 'Holy Guacamole' },
  { id: 's12', emoji: '👑', label: 'Royalty' },
];

export const QUICK_PROMPTS = [
  "Hey! What are you working on? 💻",
  "Wanna grab some pizza? 🍕",
  "Check out this hilarious meme! 😂",
  "How is your day going? ✨",
  "Let's play some games later! 🎮",
];

export const INITIAL_DEMO_USERS = [
  {
    id: 'user_alex',
    username: 'alex',
    password: 'password123',
    displayName: 'Alex Rivers 🎸',
    avatar: '🎸',
    avatarBg: '#ddd6fe',
    bio: 'Rock & roll, building apps, always online!',
    mood: 'Playing some electric guitar 🎶',
    friends: ['user_sam']
  },
  {
    id: 'user_sam',
    username: 'sam',
    password: 'password123',
    displayName: 'Sam Taylor 🚀',
    avatar: '🦄',
    avatarBg: '#fbcfe8',
    bio: 'Coffee lover and travel enthusiast.',
    mood: 'Planning the next road trip 🗺️',
    friends: ['user_alex']
  }
];

export const INITIAL_MESSAGES = [
  {
    id: 'msg_init_1',
    fromId: 'user_alex',
    toId: 'user_sam',
    text: 'Hey Sam! Did you check out the new chat app?',
    type: 'text',
    timestamp: '10:15 AM',
    reactions: ['🔥']
  },
  {
    id: 'msg_init_2',
    fromId: 'user_sam',
    toId: 'user_alex',
    text: 'Yeah! It supports real-time multi-tab sync, stickers, and reactions! 🚀',
    type: 'text',
    timestamp: '10:16 AM',
    reactions: ['❤️']
  }
];
