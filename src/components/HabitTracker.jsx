import React, { useState } from 'react';
import { Check, Plus, Trash2, Edit } from 'lucide-react';
import { useApp } from '../hooks/useApp.jsx';
import { formatDate } from '../utils/helpers';

const CATEGORIES = ['Nutrition', 'Hydration', 'Movement', 'Moderation', 'Custom'];
const EMOJIS = ['🍳', '🍎', '🥬', '🌾', '💧', '🚶', '🏋️', '🍸', '✨', '⏱️', '🚫', '📝', '🌅', '🌙', '💪', '🧘', '🏃', '🚴', '🏊', '😴'];

export const HabitTracker = () => {
  const { habits, habitLogs, logHabit, weeklyFocus } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(null);
  const [notes, setNotes] = useState({ text: '', energy: 5, mood: 5 });

  const today = formatDate(new Date());
  const todayLogs = habitLogs.filter(log => formatDate(new Date(log.date)) === today);

  const filteredHabits = selectedCategory === 'All' 
    ? habits 
    : habits.filter(h => h.category === selectedCategory);

  const getHabitStatus = (habit) => {
    const log = todayLogs.find(l => l.habitId === habit.id);
    return log ? log.completed : false;
  };

  const handleToggle = async (habit) => {
    const completed = !getHabitStatus(habit);
    await logHabit(habit.id, completed, notes.text, parseInt(notes.energy), parseInt(notes.mood));
    if (completed && expandedNotes === habit.id) {
      setExpandedNotes(null);
      setNotes({ text: '', energy: 5, mood: 5 });
    }
  };

  const handleQuickNote = (habitId) => {
    const existingLog = todayLogs.find(l => l.habitId === habitId);
    if (existingLog) {
      setNotes({ 
        text: existingLog.notes || '', 
        energy: existingLog.energy || 5, 
        mood: existingLog.mood || 5 
      });
    } else {
      setNotes({ text: '', energy: 5, mood: 5 });
    }
    setExpandedNotes(habitId);
  };

  const saveNotes = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    const completed = getHabitStatus(habit);
    await logHabit(habitId, completed, notes.text, parseInt(notes.energy), parseInt(notes.mood));
    setExpandedNotes(null);
  };

  return (
    <div className="habit-tracker">
      <div className="header">
        <h1>Today's Habits</h1>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} /> Add Habit
        </button>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button 
          className={selectedCategory === 'All' ? 'active' : ''}
          onClick={() => setSelectedCategory('All')}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={selectedCategory === cat ? 'active' : ''}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Weekly Focus Badge */}
      {weeklyFocus && (
        <div className="weekly-focus-badge">
          <span className="focus-emoji">🎯</span>
          <span>Weekly Focus: {habits.find(h => h.id === weeklyFocus.habitId)?.name}</span>
        </div>
      )}

      {/* Habits List */}
      <div className="habits-list">
        {filteredHabits.map(habit => {
          const completed = getHabitStatus(habit);
          const log = todayLogs.find(l => l.habitId === habit.id);
          
          return (
            <div key={habit.id} className={`habit-card ${completed ? 'completed' : ''}`}>
              <div className="habit-header">
                <div className="habit-info">
                  <span className="habit-emoji">{habit.emoji}</span>
                  <div>
                    <h3>{habit.name}</h3>
                    <span className="habit-category">{habit.category}</span>
                  </div>
                </div>
                <button 
                  className={`check-btn ${completed ? 'checked' : ''}`}
                  onClick={() => handleToggle(habit)}
                >
                  <Check size={24} />
                </button>
              </div>
              
              {log && (log.notes || log.energy || log.mood) && (
                <div className="habit-notes-preview">
                  {log.notes && <p className="note-text">{log.notes}</p>}
                  <div className="ratings">
                    {log.energy && <span>⚡ Energy: {log.energy}/10</span>}
                    {log.mood && <span>😊 Mood: {log.mood}/10</span>}
                  </div>
                </div>
              )}

              <button 
                className="notes-btn"
                onClick={() => handleQuickNote(habit.id)}
              >
                📝 {expandedNotes === habit.id ? 'Close' : 'Add Note'}
              </button>

              {expandedNotes === habit.id && (
                <div className="notes-editor">
                  <textarea
                    placeholder="How did it go? Any context?"
                    value={notes.text}
                    onChange={(e) => setNotes({...notes, text: e.target.value})}
                    rows={3}
                  />
                  <div className="rating-sliders">
                    <div>
                      <label>⚡ Energy: {notes.energy}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={notes.energy}
                        onChange={(e) => setNotes({...notes, energy: e.target.value})}
                      />
                    </div>
                    <div>
                      <label>😊 Mood: {notes.mood}</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={notes.mood}
                        onChange={(e) => setNotes({...notes, mood: e.target.value})}
                      />
                    </div>
                  </div>
                  <button className="btn-primary" onClick={() => saveNotes(habit.id)}>
                    Save Note
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAddModal && <AddHabitModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

const AddHabitModal = ({ onClose }) => {
  const { addHabit } = useApp();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Custom');
  const [emoji, setEmoji] = useState('✨');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await addHabit({ name, category, emoji });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Add New Habit</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Habit Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning meditation"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Emoji</label>
            <div className="emoji-picker">
              <button type="button" className="selected-emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                {emoji}
              </button>
              {showEmojiPicker && (
                <div className="emoji-grid">
                  {EMOJIS.map(e => (
                    <button
                      key={e}
                      type="button"
                      className={emoji === e ? 'selected' : ''}
                      onClick={() => { setEmoji(e); setShowEmojiPicker(false); }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Add Habit</button>
          </div>
        </form>
      </div>
    </div>
  );
};
