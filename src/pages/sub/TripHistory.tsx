import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

export const TripHistory = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  const getModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'car':
        return 'fa-car';
      case 'bike':
        return 'fa-motorcycle';
      case 'bus':
        return 'fa-bus';
      case 'metro':
        return 'fa-subway';
      default:
        return 'fa-map-marker-alt';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'car':
        return 'text-blue-600';
      case 'bike':
        return 'text-orange-600';
      case 'bus':
        return 'text-green-600';
      case 'metro':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          My Trip History
        </h1>
      </header>
      <div className="p-5 space-y-3">
        {appState.tripHistory.map((trip, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-start mb-2">
              <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 ${getModeColor(trip.mode)}`}>
                <i className={`fas ${getModeIcon(trip.mode)}`}></i>
              </div>
              <div className="flex-1">
                <div className="flex items-center text-sm mb-1">
                  <i className="fas fa-circle text-green-500 text-xs mr-2"></i>
                  <span className="text-gray-700 dark:text-gray-300">{trip.from}</span>
                </div>
                <div className="flex items-center text-sm">
                  <i className="fas fa-map-marker-alt text-red-500 text-xs mr-2"></i>
                  <span className="text-gray-700 dark:text-gray-300">{trip.to}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800 dark:text-white">₹{trip.cost}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{trip.date}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Mode: {trip.mode}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
