import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

export const TransactionHistory = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          Transaction History
        </h1>
      </header>
      <div className="p-5 space-y-3">
        {appState.wallet.history.map((transaction, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    transaction.amount > 0
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}
                >
                  <i
                    className={`fas ${
                      transaction.amount > 0 ? 'fa-arrow-down text-green-600' : 'fa-arrow-up text-red-600'
                    }`}
                  ></i>
                </div>
                <div>
                  <p className="font-semibold dark:text-white">{transaction.details}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                </div>
              </div>
              <p
                className={`font-bold ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
