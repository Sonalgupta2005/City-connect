import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

export const TravelSpends = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();
  const [selectedMonths, setSelectedMonths] = useState(1);

  const getFilteredSpends = () => {
    const now = new Date();
    const monthsAgo = new Date(now.setMonth(now.getMonth() - selectedMonths));
    return appState.travelSpends.filter(spend => new Date(spend.date) >= monthsAgo);
  };

  const filteredSpends = getFilteredSpends();
  const totalSpend = filteredSpends.reduce((acc, spend) => acc + spend.amount, 0);

  const handleSendReport = (method: string) => {
    toast.success(`Report sent via ${method}!`);
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center sticky top-0">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          My Travel Spends
        </h1>
      </header>
      <div className="p-4 bg-white dark:bg-gray-800">
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3].map((months) => (
            <button
              key={months}
              onClick={() => setSelectedMonths(months)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedMonths === months
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Last {months} Month{months > 1 ? 's' : ''}
            </button>
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl shadow-lg text-white text-center mb-4">
          <p className="text-sm opacity-90 mb-1">Total Spend</p>
          <p className="text-4xl font-extrabold">₹{totalSpend}</p>
          <p className="text-xs opacity-75 mt-2">in last {selectedMonths} month{selectedMonths > 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-3 mb-5">
          {filteredSpends.map((spend, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold dark:text-white">{spend.mode}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{spend.date}</p>
                </div>
                <p className="font-bold text-red-600">₹{spend.amount}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => handleSendReport('Email')}
            className="flex-1 bg-green-500 text-white font-semibold py-2 rounded-lg"
          >
            <i className="fas fa-envelope mr-2"></i>Send via Email
          </button>
          <button
            onClick={() => handleSendReport('SMS')}
            className="flex-1 bg-primary text-white font-semibold py-2 rounded-lg"
          >
            <i className="fas fa-comment-sms mr-2"></i>Send via SMS
          </button>
        </div>
      </div>
    </div>
  );
};
