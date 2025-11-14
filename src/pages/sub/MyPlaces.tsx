import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

export const MyPlaces = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  const handleAddPlace = () => {
    toast.info('Add place feature coming soon!');
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          My Places
        </h1>
      </header>
      <div className="p-5 space-y-4">
        <div className="space-y-3">
          {appState.myPlaces.map((place) => (
            <div key={place.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <i className={`fas ${place.icon} text-primary text-xl`}></i>
              </div>
              <div className="flex-1">
                <p className="font-semibold dark:text-white">{place.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{place.address}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <i className="fas fa-edit"></i>
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddPlace}
          className="w-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold py-3 rounded-lg border-2 border-dashed border-blue-400 dark:border-blue-600 flex items-center justify-center"
        >
          <i className="fas fa-plus mr-2"></i> Add New Place
        </button>
      </div>
    </div>
  );
};
