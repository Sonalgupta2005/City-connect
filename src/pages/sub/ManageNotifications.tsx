import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';

export const ManageNotifications = () => {
  const navigate = useNavigate();
  const { appState, toggleNotification } = useAppContext();

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          Manage Notifications
        </h1>
      </header>
      <div className="p-5 space-y-4">
        {appState.notificationSettings.map((setting) => (
          <div key={setting.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between">
            <span className="dark:text-gray-200 font-semibold">{setting.label}</span>
            <button
              onClick={() => toggleNotification(setting.id)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                setting.checked ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  setting.checked ? 'translate-x-5' : ''
                }`}
              ></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
