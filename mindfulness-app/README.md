# Mindfulness Quest 🧘

A gamified mindfulness web app that helps you build healthy, mindful habits through points, levels, and streak tracking.

## Features

- **Gamification System**: Earn points and level up by completing mindful tasks
- **15 Mindful Activities**: Including meditation, journaling, phone-free walks, gratitude practice, and more
- **Streak Tracking**: Build consistency with daily streak counters
- **Progress History**: Track your journey with detailed stats and charts
- **Beautiful UI**: Clean, modern design with Tailwind CSS
- **Local Storage**: All data persists in your browser (no backend required)
- **Password Protected**: Simple authentication for personal use

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **First Time Setup**: Create a password when you first launch the app
2. **Complete Tasks**: Click on any task card to mark it as complete and earn points
3. **Level Up**: Earn 100 points to level up (levels increase every 100 points)
4. **Build Streaks**: Complete tasks daily to build your streak
5. **Track Progress**: Click "Show History" to view your stats, charts, and completed tasks

## Available Tasks

- 🧘 **Meditation** (20 pts)
- 📝 **Journaling** (15 pts)
- 🚶 **Phone-Free Walk** (15 pts)
- 🙏 **Gratitude Practice** (10 pts)
- 💨 **Breathing Exercise** (10 pts)
- 🍽️ **Mindful Eating** (15 pts)
- 🤸 **Yoga/Stretching** (20 pts)
- 🌳 **Nature Time** (15 pts)
- 📵 **Digital Detox** (20 pts)
- 🎨 **Creative Expression** (15 pts)
- 💝 **Act of Kindness** (15 pts)
- 📚 **Reading** (10 pts)
- 😴 **Quality Sleep** (15 pts)
- 💧 **Hydration** (10 pts)
- 🧠 **Body Scan** (15 pts)

## Tech Stack

- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **localStorage** - Data persistence

## Data Storage

All data is stored locally in your browser using localStorage. This means:
- No server or database required
- Data persists between sessions
- Data is private to your browser
- Clearing browser data will reset the app

## Future Enhancements

- Export data as JSON/CSV
- Custom task creation
- Reminders and notifications
- Dark mode
- Mobile app version
- Cloud sync across devices

## License

Personal use only.
