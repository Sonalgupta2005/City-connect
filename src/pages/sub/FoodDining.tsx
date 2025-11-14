import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

export const FoodDining = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center sticky top-0">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          Food & Dining
        </h1>
      </header>
      <div className="p-5 space-y-3">
        {appState.restaurants.map((restaurant, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg dark:text-white mb-1">{restaurant.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <i className="fas fa-utensils mr-1 text-yellow-500"></i>{restaurant.cuisine}
                </p>
              </div>
              <i className="fas fa-store text-2xl text-yellow-500"></i>
            </div>
            <a
              href={restaurant.website}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-primary text-white text-center py-2 rounded-lg font-semibold mt-3"
            >
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
