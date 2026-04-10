import React, { useState } from 'react';
import { Sprout, Droplets, Flower, Trees, Leaf } from 'lucide-react';
import { useApp } from '../hooks/useApp.jsx';
import { calculateStreak } from '../utils/helpers';

export const HabitGarden = () => {
  const { habits, habitLogs } = useApp();
  
  const gardenPlants = habits.map(habit => {
    const habitLogsFiltered = habitLogs.filter(log => log.habitId === habit.id);
    const streak = calculateStreak(habitLogsFiltered.filter(l => l.completed));
    const totalCompletions = habitLogsFiltered.filter(l => l.completed).length;
    
    // Determine plant growth stage based on streak
    let growthStage = 'seed';
    if (streak >= 30) growthStage = 'tree';
    else if (streak >= 14) growthStage = 'flower';
    else if (streak >= 7) growthStage = 'plant';
    else if (streak >= 3) growthStage = 'sprout';
    else if (totalCompletions > 0) growthStage = 'seed';
    
    // Plant is wilting if no completion in last 2 days
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const recentLog = habitLogsFiltered.find(log => {
      const logDate = new Date(log.date);
      return logDate >= twoDaysAgo && log.completed;
    });
    
    const isWilting = !recentLog && totalCompletions > 0;
    
    return { ...habit, streak, totalCompletions, growthStage, isWilting };
  });

  const getPlantIcon = (growthStage, isWilting) => {
    if (isWilting) {
      return <Leaf className="plant-icon wilting" size={48} />;
    }
    switch (growthStage) {
      case 'tree':
        return <Trees className="plant-icon tree" size={48} />;
      case 'flower':
        return <Flower className="plant-icon flower" size={48} />;
      case 'plant':
        return <Sprout className="plant-icon plant" size={48} />;
      case 'sprout':
        return <Sprout className="plant-icon sprout" size={32} />;
      default:
        return <Droplets className="plant-icon seed" size={24} />;
    }
  };

  const getPlantColor = (growthStage, isWilting) => {
    if (isWilting) return '#ef4444';
    switch (growthStage) {
      case 'tree': return '#10b981';
      case 'flower': return '#f472b6';
      case 'plant': return '#34d399';
      case 'sprout': return '#6ee7b7';
      default: return '#9ca3af';
    }
  };

  return (
    <div className="garden-view">
      <h1>Your Habit Garden 🌱</h1>
      <p className="garden-description">
        Each habit grows as you maintain your streak. Miss days and plants may wilt!
      </p>

      <div className="garden-grid">
        {gardenPlants.map(plant => (
          <div 
            key={plant.id} 
            className={`garden-plot ${plant.isWilting ? 'wilting' : ''}`}
            style={{ borderColor: getPlantColor(plant.growthStage, plant.isWilting) }}
          >
            <div className="plant-display">
              {getPlantIcon(plant.growthStage, plant.isWilting)}
            </div>
            <div className="plant-info">
              <span className="plant-emoji">{plant.emoji}</span>
              <h3>{plant.name}</h3>
              <p className="growth-stage">{plant.growthStage}</p>
              <div className="streak-badge">
                🔥 {plant.streak} day streak
              </div>
              {plant.isWilting && (
                <p className="wilting-warning">Needs attention!</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {gardenPlants.length === 0 && (
        <div className="empty-garden">
          <Sprout size={64} className="empty-icon" />
          <p>No habits yet. Start planting by adding your first habit!</p>
        </div>
      )}
    </div>
  );
};
