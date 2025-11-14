import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

export const FitnessActivity = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();
  const [period, setPeriod] = useState<'today' | 'month1' | 'month2' | 'month3'>('today');

  const data = appState.fitness[period];
  const circumference = 2 * Math.PI * 45;
  const progress = 'goal' in data ? (data.steps / data.goal) * 100 : 100;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          My Fitness Activity
        </h1>
      </header>
      <div className="p-5">
        <div className="flex justify-center space-x-2 mb-6">
          {[
            { key: 'today', label: 'Today' },
            { key: 'month1', label: '1 Month' },
            { key: 'month2', label: '2 Months' },
            { key: 'month3', label: '3 Months' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key as any)}
              className={`px-3 py-1 text-sm rounded-full ${
                period === key
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              className="progress-ring-circle text-green-500"
              strokeWidth="10"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{
                strokeDashoffset: offset,
                strokeDasharray: circumference
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold dark:text-white">{data.steps.toLocaleString()}</span>
            <span className="text-gray-500 dark:text-gray-400">steps</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Distance</p>
            <p className="text-xl font-bold dark:text-white">{data.distance} km</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500 dark:text-gray-400">Calories Burned</p>
            <p className="text-xl font-bold dark:text-white">{data.calories} kcal</p>
          </div>
        </div>

        {'co2Saved' in data && (
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg shadow-sm mt-4 text-center">
            <i className="fas fa-leaf text-3xl text-green-600 mb-2"></i>
            <p className="text-sm text-gray-600 dark:text-gray-300">CO2 Saved Today</p>
            <p className="text-2xl font-bold text-green-600">{data.co2Saved} kg</p>
          </div>
        )}
      </div>
    </div>
  );
};
