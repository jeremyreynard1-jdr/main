// Storage keys
const STORAGE_KEYS = {
  USER: 'mindfulness_user',
  PASSWORD: 'mindfulness_password',
  TASKS_HISTORY: 'mindfulness_tasks_history',
};

// Default user data
const DEFAULT_USER = {
  name: 'Mindful User',
  level: 1,
  totalPoints: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastLoginDate: null,
};

// Get user data
export const getUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : DEFAULT_USER;
};

// Save user data
export const saveUser = (userData) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
};

// Get password
export const getPassword = () => {
  return localStorage.getItem(STORAGE_KEYS.PASSWORD);
};

// Set password
export const setPassword = (password) => {
  localStorage.setItem(STORAGE_KEYS.PASSWORD, password);
};

// Get tasks history
export const getTasksHistory = () => {
  const history = localStorage.getItem(STORAGE_KEYS.TASKS_HISTORY);
  return history ? JSON.parse(history) : [];
};

// Save tasks history
export const saveTasksHistory = (history) => {
  localStorage.setItem(STORAGE_KEYS.TASKS_HISTORY, JSON.stringify(history));
};

// Add completed task to history
export const addCompletedTask = (taskId, taskName, points) => {
  const history = getTasksHistory();
  const newEntry = {
    id: Date.now(),
    taskId,
    taskName,
    points,
    completedAt: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  };
  history.push(newEntry);
  saveTasksHistory(history);
  return newEntry;
};

// Get tasks completed today
export const getTodaysTasks = () => {
  const today = new Date().toISOString().split('T')[0];
  const history = getTasksHistory();
  return history.filter(task => task.date === today);
};

// Check if task was completed today
export const isTaskCompletedToday = (taskId) => {
  const todaysTasks = getTodaysTasks();
  return todaysTasks.some(task => task.taskId === taskId);
};

// Calculate level from points
export const calculateLevel = (points) => {
  // Level up every 100 points
  return Math.floor(points / 100) + 1;
};

// Calculate points needed for next level
export const pointsForNextLevel = (currentPoints) => {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelPoints = currentLevel * 100;
  return nextLevelPoints - currentPoints;
};

// Update streak
export const updateStreak = (user) => {
  const today = new Date().toISOString().split('T')[0];
  const lastLogin = user.lastLoginDate;

  if (!lastLogin) {
    // First time
    return {
      ...user,
      currentStreak: 1,
      longestStreak: 1,
      lastLoginDate: today,
    };
  }

  if (lastLogin === today) {
    // Already logged in today
    return user;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastLogin === yesterdayStr) {
    // Consecutive day
    const newStreak = user.currentStreak + 1;
    return {
      ...user,
      currentStreak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      lastLoginDate: today,
    };
  } else {
    // Streak broken
    return {
      ...user,
      currentStreak: 1,
      lastLoginDate: today,
    };
  }
};

// Clear all data
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TASKS_HISTORY);
};
