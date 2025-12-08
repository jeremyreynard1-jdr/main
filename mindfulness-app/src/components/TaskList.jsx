import { useState } from 'react';
import { MINDFUL_TASKS, CATEGORIES } from '../data/tasks';
import { isTaskCompletedToday } from '../utils/storage';

const TaskList = ({ onCompleteTask }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const filteredTasks = selectedCategory === 'all'
    ? MINDFUL_TASKS
    : MINDFUL_TASKS.filter(task => task.category === selectedCategory);

  const handleCompleteTask = (task) => {
    if (completedTasks.has(task.id) || isTaskCompletedToday(task.id)) {
      return; // Already completed today
    }

    setCompletedTasks(new Set([...completedTasks, task.id]));
    onCompleteTask(task);
  };

  const isCompleted = (taskId) => {
    return completedTasks.has(taskId) || isTaskCompletedToday(taskId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily Tasks</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => {
          const completed = isCompleted(task.id);
          return (
            <div
              key={task.id}
              className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                completed
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-purple-400 hover:shadow-md cursor-pointer'
              }`}
              onClick={() => !completed && handleCompleteTask(task)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{task.icon}</span>
                {completed ? (
                  <span className="text-green-500 text-xl">✓</span>
                ) : (
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                    +{task.points} pts
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {task.name}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No tasks in this category
        </div>
      )}
    </div>
  );
};

export default TaskList;
