import React from 'react';
import { Trophy, Flame, Star, TrendingUp } from 'lucide-react';
import { useApp } from '../hooks/useApp.jsx';
import { calculateStreak, getDailyMedal, calculateLevel, getXpProgress } from '../utils/helpers';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export const Stats = () => {
  const { habits, habitLogs, achievements, userStats } = useApp();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  const todayLogs = habitLogs.filter(log => 
    format(new Date(log.date), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );
  
  const weekLogs = habitLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= weekStart && logDate <= weekEnd;
  });

  const completedToday = todayLogs.filter(log => log.completed).length;
  const dailyMedal = getDailyMedal(completedToday);
  
  const weeklyCompletion = habits.length > 0 
    ? Math.round((weekLogs.filter(l => l.completed).length / (habits.length * 7)) * 100)
    : 0;

  const level = calculateLevel(userStats.xp);
  const xpProgress = getXpProgress(userStats.xp);

  // Calculate streaks per habit
  const habitStreaks = habits.map(habit => {
    const habitLogsFiltered = habitLogs.filter(log => log.habitId === habit.id);
    const streak = calculateStreak(habitLogsFiltered.filter(l => l.completed));
    return { ...habit, streak };
  });

  const bestStreak = Math.max(...habitStreaks.map(h => h.streak), 0);

  return (
    <div className="stats-view">
      <h1>Your Progress</h1>

      {/* Level Card */}
      <div className="level-card">
        <div className="level-header">
          <div className="level-info">
            <span className="level-badge">Level {level.level}</span>
            <h2>{level.name}</h2>
          </div>
          <Star className="level-icon" size={48} />
        </div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${xpProgress}%` }}></div>
        </div>
        <p className="xp-text">{userStats.xp} XP</p>
      </div>

      {/* Today's Medal */}
      <div className="daily-medal-card">
        <h3>Today's Achievement</h3>
        {dailyMedal ? (
          <div className="medal-display" style={{ color: dailyMedal.color }}>
            <Trophy size={64} />
            <span className="medal-label">{dailyMedal.label} Medal</span>
            <p>{completedToday} habits completed</p>
          </div>
        ) : (
          <p className="no-medal">Complete habits to earn a medal!</p>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <Flame className="stat-icon flame" />
          <div className="stat-value">{bestStreak}</div>
          <div className="stat-label">Best Streak</div>
        </div>
        
        <div className="stat-card">
          <TrendingUp className="stat-icon trend" />
          <div className="stat-value">{weeklyCompletion}%</div>
          <div className="stat-label">Weekly Completion</div>
        </div>
        
        <div className="stat-card">
          <Star className="stat-icon star" />
          <div className="stat-value">{achievements.filter(a => a.unlocked).length}</div>
          <div className="stat-label">Achievements</div>
        </div>
        
        <div className="stat-card">
          <CheckIcon />
          <div className="stat-value">{userStats.totalCheckIns}</div>
          <div className="stat-label">Total Check-ins</div>
        </div>
      </div>

      {/* Habit Streaks */}
      <div className="streaks-section">
        <h3>Habit Streaks</h3>
        <div className="streaks-list">
          {habitStreaks.sort((a, b) => b.streak - a.streak).slice(0, 5).map(habit => (
            <div key={habit.id} className="streak-item">
              <span className="streak-emoji">{habit.emoji}</span>
              <span className="streak-name">{habit.name}</span>
              <div className="streak-count">
                <Flame size={16} className="flame-icon" />
                {habit.streak} days
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})</h3>
        <div className="achievements-grid">
          {achievements.filter(a => a.unlocked).map(achievement => (
            <div key={achievement.id} className="achievement-badge unlocked">
              <span className="achievement-icon">{achievement.icon}</span>
              <span className="achievement-name">{achievement.name}</span>
            </div>
          ))}
          {achievements.filter(a => !a.unlocked).slice(0, 6).map(achievement => (
            <div key={achievement.id} className="achievement-badge locked">
              <span className="achievement-icon">🔒</span>
              <span className="achievement-name">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg className="stat-icon check" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
