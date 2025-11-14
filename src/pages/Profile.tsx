import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Profile = () => {
  const navigate = useNavigate();
  const { appState, darkMode, toggleDarkMode, logout, userRole, subscriptionExpiresAt, avatarUrl, updateAvatar, user } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const isSubscriptionActive = () => {
    if (!subscriptionExpiresAt) return false;
    return new Date(subscriptionExpiresAt) > new Date();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateAvatar(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <header className="p-5 gradient-bg text-white shadow-lg rounded-b-3xl relative">
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg cursor-pointer" onClick={handleAvatarClick}>
              <AvatarImage src={avatarUrl || undefined} alt={appState.profile.name} />
              <AvatarFallback className="bg-primary text-white text-2xl">
                {getInitials(appState.profile.name)}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute bottom-0 right-0 bg-white text-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-primary disabled:opacity-50"
            >
              {isUploading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-camera"></i>
              )}
            </button>
          </div>
          <h1 className="text-2xl font-bold">{appState.profile.name}</h1>
          <p className="text-sm opacity-90">{appState.profile.phone}</p>
          {userRole === 'subscribed' && isSubscriptionActive() && (
            <div className="mt-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-primary font-bold">⭐ Smart Commuter Pass</span>
              </div>
              <p className="text-xs text-gray-600">
                Active until {formatExpiryDate(subscriptionExpiresAt)}
              </p>
            </div>
          )}
          {userRole === 'subscribed' && !isSubscriptionActive() && (
            <span className="inline-block mt-2 px-3 py-1 text-sm font-semibold bg-red-100 text-red-600 rounded-full">
              ⏰ Subscription Expired
            </span>
          )}
        </div>
      </header>

      <div className="p-5 space-y-4">
        {/* Activity Cards */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/trip-history')}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center"
          >
            <p className="text-2xl font-bold text-primary mb-1">{appState.tripHistory.length}</p>
            <p className="text-xs dark:text-gray-200">Trips</p>
          </button>
          <button
            onClick={() => navigate('/savings-report')}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center"
          >
            <p className="text-2xl font-bold text-green-600 mb-1">₹{appState.savingsReport.reduce((acc, item) => acc + item.saved, 0)}</p>
            <p className="text-xs dark:text-gray-200">Saved</p>
          </button>
          <button
            onClick={() => navigate('/fitness-activity')}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center"
          >
            <p className="text-2xl font-bold text-orange-600 mb-1">{appState.fitness.today.steps}</p>
            <p className="text-xs dark:text-gray-200">Steps</p>
          </button>
        </div>

        {/* My Activity */}
        <div>
          <h2 className="font-bold text-lg mb-3 dark:text-white">My Activity</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/trip-history')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-route mr-3 text-blue-500"></i>
                <span className="dark:text-gray-200 font-semibold">My Trip History</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/savings-report')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-piggy-bank mr-3 text-green-500"></i>
                <span className="dark:text-gray-200 font-semibold">My Savings Report</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/travel-spends')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-chart-line mr-3 text-orange-500"></i>
                <span className="dark:text-gray-200 font-semibold">My Travel Spends</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/fitness-activity')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-running mr-3 text-red-500"></i>
                <span className="dark:text-gray-200 font-semibold">My Fitness Activity</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/eco-impact')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-leaf mr-3 text-teal-500"></i>
                <span className="dark:text-gray-200 font-semibold">My Eco Impact</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <h2 className="font-bold text-lg mb-3 dark:text-white">Account Settings</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/personal-details')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-user mr-3 text-blue-500"></i>
                <span className="dark:text-gray-200 font-semibold">Personal Details</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/my-places')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-map-marker-alt mr-3 text-red-500"></i>
                <span className="dark:text-gray-200 font-semibold">My Places</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/manage-notifications')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-bell mr-3 text-yellow-500"></i>
                <span className="dark:text-gray-200 font-semibold">Manage Notifications</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/privacy-security')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-shield-alt mr-3 text-green-500"></i>
                <span className="dark:text-gray-200 font-semibold">Privacy & Security</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div>
                <i className="fas fa-question-circle mr-3 text-indigo-500"></i>
                <span className="dark:text-gray-200 font-semibold">Help & Support</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <button
              onClick={() => navigate('/invite-earn')}
              className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <div>
                <i className="fas fa-gift mr-3 text-pink-500"></i>
                <span className="dark:text-gray-200 font-semibold">Invite & Earn</span>
              </div>
              <i className="fas fa-chevron-right text-gray-400"></i>
            </button>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div>
                <i className="fas fa-moon mr-3 text-purple-500"></i>
                <span className="dark:text-gray-200 font-semibold">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  darkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    darkMode ? 'translate-x-5' : ''
                  }`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};
