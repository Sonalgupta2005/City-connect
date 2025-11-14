import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const { appState } = useAppContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Location:', latitude, longitude);
        },
        () => {
          alert('Could not get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              <strong className="dark:text-white">Hello,</strong> <span>{appState.profile.name}</span>!
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <i className="fa-solid fa-bell text-gray-600 dark:text-gray-300"></i>
          </div>
        </div>
        <div className="relative mt-4">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Where to, today?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex justify-around text-center mt-4">
          <button className="flex-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <i className="fas fa-home mr-2 text-primary"></i>Go To Home
          </button>
          <button className="flex-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
            <i className="fas fa-briefcase mr-2 text-primary"></i>Go To Work
          </button>
        </div>
      </header>

      <div className="p-5 space-y-5">
        {/* Snapshot Module */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-3 dark:text-white">Today's Snapshot</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">Savings</p>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-100">₹125</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/50 p-3 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">Steps</p>
              <p className="text-xl font-bold text-green-900 dark:text-green-100">{appState.fitness.today.steps}</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/50 p-3 rounded-lg">
              <p className="text-sm text-teal-800 dark:text-teal-200">CO2 Saved</p>
              <p className="text-xl font-bold text-teal-900 dark:text-teal-100">{appState.fitness.today.co2Saved} kg</p>
            </div>
          </div>
        </div>

        {/* Live Status Module */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-3 dark:text-white">Live Status</h2>
          <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
            {appState.liveStatus.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-48 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <i className={`fas ${item.type === 'bus' ? 'fa-bus' : item.type === 'metro' ? 'fa-subway' : 'fa-train'} text-primary mr-2`}></i>
                  <p className="font-semibold text-sm dark:text-white">{item.name}</p>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">{item.status}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coupons & Badges Module */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg mb-4 dark:text-white">Coupons & Badges</h2>
          <div className="space-y-4">
            {/* Badges */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Your Badges</p>
              <div className="flex space-x-2">
                {appState.badges.map((badge, index) => (
                  <div key={index} className="flex-1 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                    <i className={`fas ${badge.icon} text-2xl ${badge.color} mb-1`}></i>
                    <p className="text-xs dark:text-gray-300">{badge.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupons */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-600 dark:text-gray-300">Active Coupons</p>
              <div className="space-y-2">
                {appState.coupons.map((coupon, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold text-green-700 dark:text-green-400">{coupon.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{coupon.subtitle}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{coupon.provider}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Module */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-[220px] w-full">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.15,28.58,77.25,28.65&amp;layer=mapnik"
              style={{ border: 0 }}
            ></iframe>
            <button
              onClick={handleLocationClick}
              className="absolute bottom-3 right-3 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-primary"
            >
              <i className="fas fa-location-arrow"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
