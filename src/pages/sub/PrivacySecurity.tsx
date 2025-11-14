import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

export const PrivacySecurity = () => {
  const navigate = useNavigate();
  const { appState, toggle2FA } = useAppContext();

  const handleLogoutAll = () => {
    toast.success('Logged out from all other devices!');
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          Privacy & Security
        </h1>
      </header>
      <div className="p-5 space-y-6">
        <div>
          <h2 className="font-bold text-lg mb-3 dark:text-white">Security Settings</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm divide-y dark:divide-gray-700">
            <button className="w-full text-left p-4 flex justify-between items-center">
              <span className="dark:text-gray-200">Change Password</span>
              <i className="fas fa-key text-gray-400"></i>
            </button>
            <div className="p-4 flex justify-between items-center">
              <span className="dark:text-gray-200">Two-Factor Authentication</span>
              <button
                onClick={toggle2FA}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  appState.security.twoFactorEnabled ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    appState.security.twoFactorEnabled ? 'translate-x-5' : ''
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3 dark:text-white">Logged In Devices</h2>
          <div className="space-y-3">
            {appState.security.loggedInDevices.map((device, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center">
                <i className={`fas ${device.icon} text-gray-500 dark:text-gray-400 text-2xl w-8 text-center mr-4`}></i>
                <div>
                  <p className="font-semibold dark:text-gray-200">{device.device}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {device.location} &bull;{' '}
                    <span className={device.time === 'Active Now' ? 'text-green-500 font-semibold' : ''}>
                      {device.time}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleLogoutAll}
            className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg mt-4"
          >
            Logout from All Other Devices
          </button>
        </div>
      </div>
    </div>
  );
};
