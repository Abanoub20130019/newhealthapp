import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import db, { PRE_LOADED_HABITS, ACHIEVEMENTS, XP_VALUES } from '../data/database';
import { formatDate, calculateStreak, calculateLevel, getXpProgress } from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState({ xp: 0, level: 1, totalCheckIns: 0 });
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [weeklyFocus, setWeeklyFocus] = useState(null);

  // Load all data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedHabits, loadedLogs, loadedAchievements, loadedSettings, loadedWeeklyFocus] = await Promise.all([
        db.habits.toArray(),
        db.habitLogs.toArray(),
        db.achievements.toArray(),
        db.settings.toArray(),
        db.weeklyFocus.toArray()
      ]);

      // Initialize pre-loaded habits if none exist
      if (loadedHabits.length === 0) {
        await initializePreLoadedHabits();
        const freshHabits = await db.habits.toArray();
        setHabits(freshHabits);
      } else {
        setHabits(loadedHabits);
      }

      setHabitLogs(loadedLogs);
      setAchievements(loadedAchievements);
      
      // Convert settings array to object
      const settingsObj = {};
      loadedSettings.forEach(s => {
        settingsObj[s.key] = s.value;
      });
      setSettings(settingsObj);

      // Get user stats or create default
      let stats = await db.userStats.get(1);
      if (!stats) {
        stats = { id: 1, xp: 0, level: 1, totalCheckIns: 0, currentStreak: 0, bestStreak: 0 };
        await db.userStats.put(stats);
      }
      setUserStats(stats);

      if (loadedWeeklyFocus.length > 0) {
        setWeeklyFocus(loadedWeeklyFocus[0]);
      }

      // Check for new achievements
      await checkAchievements(stats, loadedLogs);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializePreLoadedHabits = async () => {
    const existingCount = await db.habits.count();
    if (existingCount === 0) {
      await db.habits.bulkAdd(PRE_LOADED_HABITS.map(h => ({
        ...h,
        isWeeklyFocus: false,
        createdAt: new Date().toISOString()
      })));
    }
  };

  const addHabit = async (habit) => {
    const id = await db.habits.add({
      ...habit,
      isCustom: true,
      isWeeklyFocus: false,
      createdAt: new Date().toISOString()
    });
    await loadData();
    return id;
  };

  const updateHabit = async (id, updates) => {
    await db.habits.update(id, updates);
    await loadData();
  };

  const deleteHabit = async (id) => {
    await db.habits.delete(id);
    await db.habitLogs.where('habitId').equals(id).delete();
    await loadData();
  };

  const setWeeklyFocusHabit = async (habitId) => {
    const weekStart = formatDate(new Date());
    await db.weeklyFocus.clear();
    await db.weeklyFocus.add({ weekStart, habitId });
    await db.habits.update(habitId, { isWeeklyFocus: true });
    // Remove focus from other habits
    await db.habits.where('isWeeklyFocus').equals(true).and(h => h.id !== habitId).modify({ isWeeklyFocus: false });
    setWeeklyFocus({ weekStart, habitId });
    await loadData();
  };

  const logHabit = async (habitId, completed, notes = '', energy = null, mood = null) => {
    const today = formatDate(new Date());
    const existingLog = await db.habitLogs
      .where('habitId')
      .equals(habitId)
      .and(log => formatDate(new Date(log.date)) === today)
      .first();

    let xpGained = 0;

    if (existingLog) {
      await db.habitLogs.update(existingLog.id, { completed, notes, energy, mood });
    } else {
      await db.habitLogs.add({
        habitId,
        date: new Date().toISOString(),
        completed,
        notes,
        energy,
        mood
      });
      
      if (completed) {
        xpGained = XP_VALUES.checkIn;
        
        // Calculate streak bonus
        const habitLogs = await db.habitLogs.where('habitId').equals(habitId).toArray();
        const streak = calculateStreak(habitLogs.filter(l => l.completed));
        if (streak > 1) {
          xpGained += XP_VALUES.streakBonus;
        }
      }
    }

    // Update user stats
    if (completed && !existingLog?.completed) {
      const newStats = { ...userStats, xp: userStats.xp + xpGained, totalCheckIns: userStats.totalCheckIns + 1 };
      const newLevel = calculateLevel(newStats.xp);
      newStats.level = newLevel.level;
      await db.userStats.put({ ...newStats, id: 1 });
      setUserStats(newStats);
    }

    await loadData();
    await checkAchievements(userStats, habitLogs);
    
    return xpGained;
  };

  const getHabitLogs = useCallback((habitId, startDate = null, endDate = null) => {
    let query = db.habitLogs.where('habitId').equals(habitId);
    if (startDate && endDate) {
      return habitLogs.filter(log => 
        log.habitId === habitId && 
        new Date(log.date) >= startDate && 
        new Date(log.date) <= endDate
      );
    }
    return habitLogs.filter(log => log.habitId === habitId);
  }, [habitLogs]);

  const getTodayLogs = useCallback(() => {
    const today = formatDate(new Date());
    return habitLogs.filter(log => formatDate(new Date(log.date)) === today);
  }, [habitLogs]);

  const checkAchievements = async (stats, logs) => {
    const unlockedIds = achievements.filter(a => a.unlocked).map(a => a.id);
    
    for (const achievement of ACHIEVEMENTS) {
      if (unlockedIds.includes(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'streak':
          const habitLogsForStreak = logs.filter(l => l.completed);
          const streak = calculateStreak(habitLogsForStreak);
          shouldUnlock = streak >= achievement.requirement.value;
          break;
        case 'level':
          shouldUnlock = stats.level >= achievement.requirement.value;
          break;
        case 'totalSteps':
          const walkingLogs = await db.walkingLogs.toArray();
          const totalSteps = walkingLogs.reduce((sum, log) => sum + (log.steps || 0), 0);
          shouldUnlock = totalSteps >= achievement.requirement.value;
          break;
        case 'fastingSessions':
          const fastingSessions = await db.fastingSessions.where('completed').equals(true).toArray();
          shouldUnlock = fastingSessions.length >= achievement.requirement.value;
          break;
        default:
          break;
      }

      if (shouldUnlock) {
        await db.achievements.add({
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        });
        // Award XP for achievement
        const newStats = { ...stats, xp: stats.xp + XP_VALUES.achievement };
        await db.userStats.put({ ...newStats, id: 1 });
        setUserStats(newStats);
      }
    }
  };

  const exportData = async () => {
    const data = {
      habits: await db.habits.toArray(),
      habitLogs: await db.habitLogs.toArray(),
      achievements: await db.achievements.toArray(),
      userStats: await db.userStats.toArray(),
      settings: await db.settings.toArray(),
      weeklyFocus: await db.weeklyFocus.toArray(),
      fastingSessions: await db.fastingSessions.toArray(),
      walkingLogs: await db.walkingLogs.toArray(),
      foodsToAvoid: await db.foodsToAvoid.toArray(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = async (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      await db.transaction('rw', db.habits, db.habitLogs, db.achievements, db.userStats, db.settings, db.weeklyFocus, async () => {
        await db.habits.clear();
        await db.habitLogs.clear();
        await db.achievements.clear();
        await db.userStats.clear();
        await db.settings.clear();
        await db.weeklyFocus.clear();
        
        if (data.habits) await db.habits.bulkAdd(data.habits);
        if (data.habitLogs) await db.habitLogs.bulkAdd(data.habitLogs);
        if (data.achievements) await db.achievements.bulkAdd(data.achievements);
        if (data.userStats) await db.userStats.bulkAdd(data.userStats);
        if (data.settings) await db.settings.bulkAdd(data.settings);
        if (data.weeklyFocus) await db.weeklyFocus.bulkAdd(data.weeklyFocus);
      });
      await loadData();
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  };

  const value = {
    habits,
    habitLogs,
    achievements,
    userStats,
    settings,
    weeklyFocus,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    setWeeklyFocusHabit,
    logHabit,
    getHabitLogs,
    getTodayLogs,
    exportData,
    importData,
    refreshData: loadData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
