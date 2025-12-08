import { useState, useMemo } from 'react';
import { getTasksHistory } from '../utils/storage';

const History = () => {
  const [view, setView] = useState('recent'); // 'recent' or 'stats'
  const history = getTasksHistory();

  // Get recent tasks (last 20)
  const recentTasks = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 20);
  }, [history]);

  // Calculate stats
  const stats = useMemo(() => {
    const taskCounts = {};
    const pointsByDate = {};
    let totalPoints = 0;

    history.forEach((task) => {
      // Task counts
      taskCounts[task.taskName] = (taskCounts[task.taskName] || 0) + 1;

      // Points by date
      if (!pointsByDate[task.date]) {
        pointsByDate[task.date] = 0;
      }
      pointsByDate[task.date] += task.points;
      totalPoints += task.points;
    });

    // Get top tasks
    const topTasks = Object.entries(taskCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Get last 7 days points
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      last7Days.push({
        date: dayName,
        points: pointsByDate[dateStr] || 0,
      });
    }

    return {
      totalTasks: history.length,
      totalPoints,
      topTasks,
      last7Days,
    };
  }, [history]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">History</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView('recent')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'recent'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setView('stats')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              view === 'stats'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Stats
          </button>
        </div>
      </div>

      {view === 'recent' ? (
        <div>
          {recentTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No tasks completed yet. Start your mindfulness journey!
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {task.taskName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(task.completedAt)} at {formatTime(task.completedAt)}
                    </div>
                  </div>
                  <div className="text-purple-600 font-bold">
                    +{task.points} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No data yet. Complete tasks to see your stats!
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-purple-600 text-sm font-medium mb-1">
                    Total Tasks
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.totalTasks}
                  </div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-pink-600 text-sm font-medium mb-1">
                    Total Points
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stats.totalPoints}
                  </div>
                </div>
              </div>

              {/* Last 7 Days */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Last 7 Days
                </h3>
                <div className="flex items-end justify-between h-32 gap-2">
                  {stats.last7Days.map((day, index) => {
                    const maxPoints = Math.max(...stats.last7Days.map(d => d.points), 1);
                    const height = (day.points / maxPoints) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="flex-1 flex items-end w-full">
                          <div
                            className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-500"
                            style={{ height: `${height}%`, minHeight: day.points > 0 ? '8px' : '0' }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          {day.date}
                        </div>
                        <div className="text-xs font-medium text-purple-600">
                          {day.points}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Tasks */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">
                  Most Completed Tasks
                </h3>
                <div className="space-y-2">
                  {stats.topTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">
                          {task.name}
                        </span>
                      </div>
                      <span className="text-gray-600 font-medium">
                        {task.count}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
