import { calculateLevel, pointsForNextLevel } from '../utils/storage';

const Dashboard = ({ user }) => {
  const currentLevel = calculateLevel(user.totalPoints);
  const pointsNeeded = pointsForNextLevel(user.totalPoints);
  const progressPercentage = ((user.totalPoints % 100) / 100) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Level Card */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Level</span>
          <span className="text-3xl">⭐</span>
        </div>
        <div className="text-4xl font-bold mb-1">{currentLevel}</div>
        <div className="text-sm opacity-90">
          {pointsNeeded} pts to next level
        </div>
        <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Total Points Card */}
      <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Total Points</span>
          <span className="text-3xl">💎</span>
        </div>
        <div className="text-4xl font-bold">{user.totalPoints}</div>
        <div className="text-sm opacity-90">Points earned</div>
      </div>

      {/* Current Streak Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Current Streak</span>
          <span className="text-3xl">🔥</span>
        </div>
        <div className="text-4xl font-bold">{user.currentStreak}</div>
        <div className="text-sm opacity-90">
          {user.currentStreak === 1 ? 'day' : 'days'}
        </div>
      </div>

      {/* Longest Streak Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Best Streak</span>
          <span className="text-3xl">🏆</span>
        </div>
        <div className="text-4xl font-bold">{user.longestStreak}</div>
        <div className="text-sm opacity-90">
          {user.longestStreak === 1 ? 'day' : 'days'}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
