# 🌱 Solo Health & Fitness Habit Tracker

A **private, offline-first** React PWA for personal wellness tracking. No accounts, no syncing, no cloud—just you and your goals.

## ✨ Features

### Core Philosophy
- 🔒 **100% Private** — All data stays on your device (IndexedDB)
- ⚡ **Zero Friction** — Open app, track habit, done in seconds
- 👤 **Single User** — No login, no cloud, no sharing
- 📱 **PWA Ready** — Install on any device, works completely offline

### Weekly Focus System
Pick one habit to prioritize for 7 days. Deep focus beats scattered effort.

**Pre-loaded Habits:**
- 🍳 **Nutrition**: Eat more protein, fruit, vegetables, fiber | Reduce sugar | Log meals | Intermittent Fasting | Avoid trigger foods
- 💧 **Hydration**: Drink more water
- 🚶 **Movement**: Get more exercise | Daily walking goals
- 🍸 **Moderation**: Drink less alcohol
- ✨ **Custom**: Create any habit with emoji + name

### Daily Tracking
- ✅ One-tap check-in
- 📝 Quick notes with energy/mood ratings
- 🔥 Streak counter (current + best)
- 📊 Visual progress ring

### Gamification
- 🔥 **Streaks** with flame animations
- 🏆 **11 Achievements**: 7-Day Warrior, 30-Day Master, Perfect Week, Fasting Pro, Step Legend, Sugar-Free Champion, etc.
- ⭐ **XP & Levels**: Beginner → Novice → Adept → Expert → Master
- 🎯 **Daily Medals**: Bronze (3 habits), Silver (5 habits), Gold (all habits)
- 🌱 **Habit Garden**: Visual plants grow with streaks, wilt if neglected

### Data Management
- 💾 Auto-save to IndexedDB
- 📤 Export data as JSON backup
- 📥 Import data for device switches
- 🔐 Encrypted, local-only storage

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to project directory
cd /workspace

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

Production files will be in the `dist/` directory.

## 📁 Project Structure

```
/workspace
├── public/
│   ├── icons/          # PWA icons (SVG)
│   ├── manifest.json   # PWA manifest
│   └── sw.js           # Service Worker
├── src/
│   ├── components/
│   │   ├── HabitTracker.jsx    # Main tracking view
│   │   ├── Stats.jsx           # Progress & achievements
│   │   ├── HabitGarden.jsx     # Visual garden view
│   │   └── Settings.jsx        # App settings
│   ├── data/
│   │   └── database.js         # Dexie.js DB schema & constants
│   ├── hooks/
│   │   └── useApp.js           # Global state management
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── styles.css              # All styles
├── index.html
├── vite.config.js
└── package.json
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **React Router** - Navigation
- **Dexie.js** - IndexedDB wrapper for local storage
- **date-fns** - Date utilities
- **Lucide React** - Icon library
- **Vite** - Build tool & dev server
- **PWA** - Service Worker + Manifest

## 📱 PWA Features

- ✅ Offline-first architecture
- ✅ Add to home screen
- ✅ Standalone app mode
- ✅ Background sync ready
- ✅ Responsive mobile design

To install as PWA:
1. Open app in browser (Chrome/Safari recommended)
2. Look for install prompt or use "Add to Home Screen"
3. App works completely offline after first load

## 🎮 How to Use

### Adding Habits
1. Tap "Add Habit" button
2. Enter habit name
3. Choose category (or Custom)
4. Pick an emoji
5. Save!

### Tracking Daily
1. Tap the check button to complete a habit
2. Optionally add notes, energy, and mood ratings
3. Watch your streak grow!

### Setting Weekly Focus
1. Go to Today tab
2. See the Weekly Focus badge
3. Select which habit to prioritize this week

### Viewing Progress
- **Stats Tab**: XP, levels, streaks, achievements
- **Garden Tab**: Visual representation of your habits as growing plants

### Backup & Restore
1. Go to Settings
2. Tap "Export Data" to download JSON backup
3. To restore: "Import Data" and select your backup file

## 🏆 Achievement System

Unlock these badges by maintaining your habits:

| Achievement | Requirement |
|------------|-------------|
| 🔥 7-Day Warrior | 7-day streak |
| 🏆 30-Day Master | 30-day streak |
| ⭐ Perfect Week | Complete all habits for 7 days |
| ⏱️ Fasting Pro | 10 fasting sessions |
| 👟 Step Legend | 100,000 total steps |
| 🚫🍬 Sugar-Free Champion | 14 sugar-free days |
| 💧 Hydration Hero | 21 hydration days |
| 🌅 Early Bird | 5 early morning completions |
| 👑 Consistency King | 60-day streak |
| ✨ Habit Builder | Create 5 custom habits |
| ⬆️ Level Up | Reach Level 5 |

## 🎯 Level System

Earn XP through:
- Daily check-ins: 10 XP
- Streak bonuses: 5 XP
- Weekly completion: 50 XP
- Achievements: 25 XP
- Daily medals: 10-30 XP

**Levels:**
1. Beginner (0-99 XP)
2. Novice (100-249 XP)
3. Adept (250-499 XP)
4. Expert (500-999 XP)
5. Master (1000+ XP)

## 🔒 Privacy Guarantee

- All data stored locally in browser's IndexedDB
- No external servers
- No analytics or tracking
- No account required
- Data never leaves your device unless you explicitly export it

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 11.3+)
- Any modern browser with IndexedDB support

## 📝 License

MIT License - Feel free to use for personal projects!

---

**Built with ❤️ for solo wellness warriors**

*Remember: Consistency > Perfection. Start small, stay consistent!*
