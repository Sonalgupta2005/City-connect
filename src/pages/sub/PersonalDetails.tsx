import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

export const PersonalDetails = () => {
  const navigate = useNavigate();
  const { appState, updateProfile } = useAppContext();
  const [name, setName] = useState(appState.profile.name);
  const [phone, setPhone] = useState(appState.profile.phone);
  const [email, setEmail] = useState(appState.profile.email);

  const handleSave = () => {
    updateProfile({ name, phone, email });
    toast.success('Details saved successfully!');
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          Personal Details
        </h1>
      </header>
      <div className="p-5 space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="https://placehold.co/100x100/E2E8F0/4A5568?text=A"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
            />
            <button className="absolute bottom-0 right-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
              <i className="fas fa-camera"></i>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full gradient-bg text-white font-bold py-3 rounded-lg shadow-lg"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
