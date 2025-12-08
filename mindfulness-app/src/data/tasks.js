// Available mindful tasks with points
export const MINDFUL_TASKS = [
  {
    id: 'meditation',
    name: 'Meditation',
    description: '10+ minutes of meditation',
    points: 20,
    icon: '🧘',
    category: 'practice',
  },
  {
    id: 'journaling',
    name: 'Journaling',
    description: 'Write in your journal',
    points: 15,
    icon: '📝',
    category: 'reflection',
  },
  {
    id: 'phone-free-walk',
    name: 'Phone-Free Walk',
    description: 'Take a walk without your phone',
    points: 15,
    icon: '🚶',
    category: 'movement',
  },
  {
    id: 'gratitude',
    name: 'Gratitude Practice',
    description: 'Write 3 things you\'re grateful for',
    points: 10,
    icon: '🙏',
    category: 'reflection',
  },
  {
    id: 'breathing',
    name: 'Breathing Exercise',
    description: '5+ minutes of focused breathing',
    points: 10,
    icon: '💨',
    category: 'practice',
  },
  {
    id: 'mindful-eating',
    name: 'Mindful Eating',
    description: 'One meal without screens',
    points: 15,
    icon: '🍽️',
    category: 'daily',
  },
  {
    id: 'yoga',
    name: 'Yoga/Stretching',
    description: '15+ minutes of movement',
    points: 20,
    icon: '🤸',
    category: 'movement',
  },
  {
    id: 'nature',
    name: 'Nature Time',
    description: 'Spend 20+ minutes outdoors',
    points: 15,
    icon: '🌳',
    category: 'movement',
  },
  {
    id: 'digital-detox',
    name: 'Digital Detox',
    description: '1 hour screen-free time',
    points: 20,
    icon: '📵',
    category: 'daily',
  },
  {
    id: 'creative',
    name: 'Creative Expression',
    description: 'Draw, music, or craft',
    points: 15,
    icon: '🎨',
    category: 'hobbies',
  },
  {
    id: 'kindness',
    name: 'Act of Kindness',
    description: 'Do something nice for someone',
    points: 15,
    icon: '💝',
    category: 'social',
  },
  {
    id: 'reading',
    name: 'Reading',
    description: '20+ minutes of reading',
    points: 10,
    icon: '📚',
    category: 'hobbies',
  },
  {
    id: 'sleep',
    name: 'Quality Sleep',
    description: '7-9 hours of sleep',
    points: 15,
    icon: '😴',
    category: 'daily',
  },
  {
    id: 'hydration',
    name: 'Hydration',
    description: 'Drink 8 glasses of water',
    points: 10,
    icon: '💧',
    category: 'daily',
  },
  {
    id: 'body-scan',
    name: 'Body Scan',
    description: 'Full body awareness check-in',
    points: 15,
    icon: '🧠',
    category: 'practice',
  },
];

// Task categories
export const CATEGORIES = {
  all: 'All Tasks',
  practice: 'Mindfulness Practice',
  reflection: 'Reflection',
  movement: 'Movement',
  daily: 'Daily Habits',
  hobbies: 'Hobbies',
  social: 'Social',
};

// Get tasks by category
export const getTasksByCategory = (category) => {
  if (category === 'all') return MINDFUL_TASKS;
  return MINDFUL_TASKS.filter(task => task.category === category);
};
