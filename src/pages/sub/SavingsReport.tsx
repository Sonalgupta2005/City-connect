import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

export const SavingsReport = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  const totalSavings = appState.savingsReport.reduce((acc, item) => acc + item.saved, 0);

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center sticky top-0">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          My Savings Report
        </h1>
      </header>
      <div className="p-5">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-xl shadow-lg text-white text-center mb-5">
          <p className="text-sm opacity-90 mb-1">Total Savings</p>
          <p className="text-4xl font-extrabold">₹{totalSavings}</p>
          <p className="text-xs opacity-75 mt-2">By choosing eco-friendly transport</p>
        </div>
        <div className="space-y-3">
          {appState.savingsReport.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                  <i className="fas fa-piggy-bank text-green-600 text-lg"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm dark:text-gray-300">{item.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.date}</p>
                </div>
                <p className="font-bold text-green-600 text-lg">+₹{item.saved}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
