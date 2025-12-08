import { useState } from 'react';
import { getPassword, setPassword } from '../utils/storage';

const Login = ({ onLogin }) => {
  const [password, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const storedPassword = getPassword();
  const isFirstTime = !storedPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (isFirstTime) {
      // First time setup
      setPassword(password);
      onLogin();
    } else {
      // Login
      if (password === storedPassword) {
        onLogin();
      } else {
        setError('Incorrect password');
        setPasswordInput('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🧘</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mindfulness Quest
          </h1>
          <p className="text-gray-600">
            {isFirstTime ? 'Create your password' : 'Welcome back!'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isFirstTime ? 'Create Password' : 'Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Enter password"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-200 shadow-lg"
          >
            {isFirstTime ? 'Get Started' : 'Login'}
          </button>
        </form>

        {isFirstTime && (
          <p className="text-xs text-gray-500 text-center mt-4">
            This password will be used to access your mindfulness data.
            <br />
            Make sure to remember it!
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
