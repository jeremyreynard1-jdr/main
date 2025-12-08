import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import History from './components/History';
import {
  getUser,
  saveUser,
  addCompletedTask,
  updateStreak,
  calculateLevel,
} from './utils/storage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      let userData = getUser();
      userData = updateStreak(userData);
      setUser(userData);
      saveUser(userData);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handleCompleteTask = (task) => {
    // Add task to history
    addCompletedTask(task.id, task.name, task.points);

    // Update user points
    const newTotalPoints = user.totalPoints + task.points;
    const oldLevel = calculateLevel(user.totalPoints);
    const newLevel = calculateLevel(newTotalPoints);

    const updatedUser = {
      ...user,
      totalPoints: newTotalPoints,
    };

    setUser(updatedUser);
    saveUser(updatedUser);

    // Show level up animation if leveled up
    if (newLevel > oldLevel) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Confetti effect for level up */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">
            🎉 Level Up! 🎉
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🧘</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Mindfulness Quest
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user.name}!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  showHistory
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showHistory ? 'Hide History' : 'Show History'}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard user={user} />

        <div className="mt-6">
          {showHistory ? (
            <History />
          ) : (
            <TaskList onCompleteTask={handleCompleteTask} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Build mindful habits, one task at a time 🌟
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
