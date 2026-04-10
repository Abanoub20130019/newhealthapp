import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isYesterday } from 'date-fns';

export const formatDate = (date) => format(date, 'yyyy-MM-dd');
export const formatDisplayDate = (date) => format(date, 'MMM d, yyyy');
export const formatTime = (date) => format(date, 'h:mm a');

export const getWeekStart = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday as start
};

export const getWeekEnd = (date = new Date()) => {
  return endOfWeek(date, { weekStartsOn: 1 });
};

export const getDaysInWeek = (date = new Date()) => {
  return eachDayOfInterval({
    start: getWeekStart(date),
    end: getWeekEnd(date)
  });
};

export const getCurrentWeekKey = () => {
  return format(getWeekStart(), 'yyyy-MM-dd');
};

export const calculateStreak = (logs) => {
  if (!logs || logs.length === 0) return 0;
  
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let streak = 0;
  let currentDate = new Date();
  
  // Check if today or yesterday has a log
  const todayLog = sortedLogs.find(log => isToday(new Date(log.date)));
  const yesterdayLog = sortedLogs.find(log => isYesterday(new Date(log.date)));
  
  if (!todayLog && !yesterdayLog) return 0;
  
  // Start counting from today or yesterday
  if (!todayLog) {
    currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
  }
  
  while (true) {
    const dateStr = formatDate(currentDate);
    const log = sortedLogs.find(log => formatDate(new Date(log.date)) === dateStr);
    
    if (log && log.completed) {
      streak++;
      currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
    } else {
      break;
    }
  }
  
  return streak;
};

export const calculateCompletionRate = (logs, totalHabits) => {
  if (!logs || logs.length === 0) return 0;
  const completed = logs.filter(log => log.completed).length;
  return Math.round((completed / (totalHabits * logs.length)) * 100) || 0;
};

export const getDailyMedal = (completedCount) => {
  if (completedCount >= 5) return { type: 'gold', color: '#fbbf24', label: 'Gold' };
  if (completedCount >= 3) return { type: 'silver', color: '#94a3b8', label: 'Silver' };
  if (completedCount >= 1) return { type: 'bronze', color: '#b45309', label: 'Bronze' };
  return null;
};

export const calculateLevel = (xp) => {
  const levels = [
    { level: 1, name: 'Beginner', minXp: 0 },
    { level: 2, name: 'Novice', minXp: 100 },
    { level: 3, name: 'Adept', minXp: 250 },
    { level: 4, name: 'Expert', minXp: 500 },
    { level: 5, name: 'Master', minXp: 1000 },
  ];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].minXp) {
      return levels[i];
    }
  }
  return levels[0];
};

export const getXpProgress = (xp) => {
  const level = calculateLevel(xp);
  const nextLevel = level.level < 5 ? level.level + 1 : 5;
  const nextLevelXp = nextLevel === 5 ? 1000 : [0, 100, 250, 500, 1000][nextLevel - 1];
  const prevLevelXp = level.minXp;
  const range = nextLevelXp - prevLevelXp;
  const progress = ((xp - prevLevelXp) / range) * 100;
  return Math.min(100, Math.max(0, progress));
};
