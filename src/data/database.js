import Dexie from 'dexie';

export const db = new Dexie('SoloHealthDB');

db.version(1).stores({
  habits: '++id, category, name, emoji, isCustom, isWeeklyFocus, createdAt',
  habitLogs: '++id, habitId, date, completed, notes, energy, mood',
  achievements: '++id, name, unlocked, unlockedAt',
  userStats: '++id, xp, level, totalCheckIns, currentStreak, bestStreak',
  settings: 'key, value',
  fastingSessions: '++id, startTime, endTime, duration, completed',
  walkingLogs: '++id, date, steps, distance, completed',
  foodsToAvoid: '++id, name, avoided',
  weeklyFocus: 'weekStart, habitId'
});

// Pre-loaded habits data
export const PRE_LOADED_HABITS = [
  // Nutrition
  { category: 'Nutrition', name: 'Eat more protein', emoji: '🍳', isCustom: false },
  { category: 'Nutrition', name: 'Eat more fruit', emoji: '🍎', isCustom: false },
  { category: 'Nutrition', name: 'Eat more vegetables', emoji: '🥬', isCustom: false },
  { category: 'Nutrition', name: 'Eat more fiber', emoji: '🌾', isCustom: false },
  { category: 'Nutrition', name: 'Reduce added sugar', emoji: '🚫🍬', isCustom: false },
  { category: 'Nutrition', name: 'Log a daily meal', emoji: '📝', isCustom: false },
  { category: 'Nutrition', name: 'Intermittent Fasting', emoji: '⏱️', isCustom: false },
  { category: 'Nutrition', name: 'Avoid Trigger Foods', emoji: '🚫', isCustom: false },
  
  // Hydration
  { category: 'Hydration', name: 'Drink more water', emoji: '💧', isCustom: false },
  
  // Movement
  { category: 'Movement', name: 'Get more exercise', emoji: '🏋️', isCustom: false },
  { category: 'Movement', name: 'Daily Walking Goal', emoji: '🚶', isCustom: false },
  
  // Moderation
  { category: 'Moderation', name: 'Drink less alcohol', emoji: '🍸', isCustom: false },
];

// Achievements data
export const ACHIEVEMENTS = [
  { id: 1, name: '7-Day Warrior', description: 'Complete a habit for 7 consecutive days', icon: '🔥', requirement: { type: 'streak', value: 7 } },
  { id: 2, name: '30-Day Master', description: 'Complete a habit for 30 consecutive days', icon: '🏆', requirement: { type: 'streak', value: 30 } },
  { id: 3, name: 'Perfect Week', description: 'Complete all habits for 7 days', icon: '⭐', requirement: { type: 'perfectWeek', value: 1 } },
  { id: 4, name: 'Fasting Pro', description: 'Complete 10 fasting sessions', icon: '⏱️', requirement: { type: 'fastingSessions', value: 10 } },
  { id: 5, name: 'Step Legend', description: 'Walk 100,000 total steps', icon: '👟', requirement: { type: 'totalSteps', value: 100000 } },
  { id: 6, name: 'Sugar-Free Champion', description: 'Avoid sugar for 14 days', icon: '🚫🍬', requirement: { type: 'sugarFreeDays', value: 14 } },
  { id: 7, name: 'Hydration Hero', description: 'Track water for 21 days', icon: '💧', requirement: { type: 'hydrationDays', value: 21 } },
  { id: 8, name: 'Early Bird', description: 'Complete a habit before 8 AM for 5 days', icon: '🌅', requirement: { type: 'earlyBird', value: 5 } },
  { id: 9, name: 'Consistency King', description: 'Maintain a 60-day streak', icon: '👑', requirement: { type: 'streak', value: 60 } },
  { id: 10, name: 'Habit Builder', description: 'Create and track 5 custom habits', icon: '✨', requirement: { type: 'customHabits', value: 5 } },
  { id: 11, name: 'Level Up', description: 'Reach Level 5', icon: '⬆️', requirement: { type: 'level', value: 5 } },
];

// Level system
export const LEVELS = [
  { level: 1, name: 'Beginner', minXp: 0, maxXp: 99 },
  { level: 2, name: 'Novice', minXp: 100, maxXp: 249 },
  { level: 3, name: 'Adept', minXp: 250, maxXp: 499 },
  { level: 4, name: 'Expert', minXp: 500, maxXp: 999 },
  { level: 5, name: 'Master', minXp: 1000, maxXp: Infinity },
];

export const XP_VALUES = {
  checkIn: 10,
  streakBonus: 5,
  weeklyCompletion: 50,
  achievement: 25,
  dailyGold: 30,
  dailySilver: 20,
  dailyBronze: 10,
};

export default db;
