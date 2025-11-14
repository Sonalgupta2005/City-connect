import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

export const InviteEarn = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(appState.profile.referralCode);
    toast.success('Referral code copied to clipboard!');
  };

  const handleShareLink = () => {
    toast.success('App link ready to be shared!');
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          Invite & Earn
        </h1>
      </header>
      <div className="p-5 space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl shadow-lg text-white text-center">
          <i className="fas fa-gift text-5xl mb-4"></i>
          <h2 className="text-2xl font-bold mb-2">Earn ₹100</h2>
          <p className="text-sm opacity-90">For every friend you refer who makes their first ride!</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg mb-3 dark:text-white">Your Referral Code</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">{appState.profile.referralCode}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center"
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleShareLink}
            className="w-full bg-primary text-white font-bold py-3 rounded-lg flex items-center justify-center"
          >
            <i className="fas fa-share-alt mr-2"></i>Share Invite Link
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-bold mb-2 dark:text-white">How it works:</h3>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                1
              </span>
              <span>Share your referral code with friends</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                2
              </span>
              <span>They sign up using your code</span>
            </li>
            <li className="flex items-start">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0 text-xs">
                3
              </span>
              <span>Once they complete their first ride, you both earn ₹100!</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
