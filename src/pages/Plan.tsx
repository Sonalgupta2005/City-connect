import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompareModal = ({ isOpen, onClose }: CompareModalProps) => {
  const { addTrip } = useAppContext();

  const rides = [
    { provider: 'Ola', type: 'Car', cost: 175.75, time: 26, discount: 5 },
    { provider: 'Uber', type: 'Car', cost: 185.25, time: 25, discount: 5 },
    { provider: 'Ola', type: 'Auto', cost: 111.55, time: 32, discount: 3 },
    { provider: 'Uber', type: 'Auto', cost: 116.40, time: 30, discount: 3 },
    { provider: 'Rapido', type: 'Bike', cost: 83.30, time: 20, discount: 2 },
  ].sort((a, b) => a.cost - b.cost);

  const handleBook = (provider: string, type: string, cost: number) => {
    addTrip({
      from: 'Current Location',
      to: 'Destination',
      mode: type,
      cost,
      date: new Date().toISOString().split('T')[0]
    });
    toast.success(`${type} booked via ${provider}!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-[420px] bg-white dark:bg-gray-800 rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Compare Prices</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-3">
          {rides.map((ride, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-semibold dark:text-white">{ride.provider} - {ride.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">~{ride.time} mins</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">₹{Math.round(ride.cost)}</p>
                  <p className="text-xs text-gray-500">{ride.discount}% off</p>
                </div>
              </div>
              <button
                onClick={() => handleBook(ride.provider, ride.type, ride.cost)}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Plan = () => {
  const navigate = useNavigate();
  const { addTrip } = useAppContext();
  const [showCompare, setShowCompare] = useState(false);

  const handleBooking = (provider: string, type: string, cost: number, time: number) => {
    addTrip({
      from: 'Current Location',
      to: 'Destination',
      mode: type,
      cost,
      date: new Date().toISOString().split('T')[0]
    });
    toast.success(`${type} booked via ${provider}! Estimated time: ${time} mins`);
  };

  return (
    <div>
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10 flex items-center">
        <button onClick={() => navigate('/')} className="text-gray-600 dark:text-gray-300 w-8">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          Choose Your Ride
        </h1>
        <div className="w-8"></div>
      </header>

      <div className="p-5 space-y-6">
        {/* Book a Private Ride Section */}
        <div>
          <h2 className="font-bold text-lg mb-4 dark:text-white">Book a Private Ride</h2>

          <button
            onClick={() => setShowCompare(true)}
            className="w-full gradient-bg text-white font-bold py-4 rounded-lg shadow-lg mb-6 flex items-center justify-center text-lg transition-transform transform hover:scale-105"
          >
            <i className="fas fa-search-dollar mr-3"></i>Smart Price Comparison
          </button>

          {/* Providers */}
          <div className="space-y-4">
            {/* Uber */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-extrabold text-xl text-black dark:text-white mb-3">Uber</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleBooking('Uber', 'Car', 185.25, 25)}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left"
                >
                  <div className="flex items-center">
                    <i className="fas fa-car text-xl text-black dark:text-white mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Car</p>
                      <p className="text-xs text-green-600 font-bold">5% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600 text-lg">~ ₹185</span>
                    <span className="text-sm text-gray-500 line-through ml-1">₹195</span>
                  </div>
                </button>
                <button
                  onClick={() => handleBooking('Uber', 'Auto', 116.40, 30)}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left"
                >
                  <div className="flex items-center">
                    <i className="fas fa-shuttle-van text-xl text-yellow-600 mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Auto</p>
                      <p className="text-xs text-green-600 font-bold">3% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600 text-lg">~ ₹116</span>
                    <span className="text-sm text-gray-500 line-through ml-1">₹120</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Ola */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-extrabold text-xl text-black dark:text-white mb-3">Ola</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleBooking('Ola', 'Car', 175.75, 26)}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left"
                >
                  <div className="flex items-center">
                    <i className="fas fa-car text-xl text-black dark:text-white mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Car</p>
                      <p className="text-xs text-green-600 font-bold">5% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600 text-lg">~ ₹176</span>
                    <span className="text-sm text-gray-500 line-through ml-1">₹185</span>
                  </div>
                </button>
                <button
                  onClick={() => handleBooking('Ola', 'Auto', 111.55, 32)}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left"
                >
                  <div className="flex items-center">
                    <i className="fas fa-shuttle-van text-xl text-yellow-600 mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Auto</p>
                      <p className="text-xs text-green-600 font-bold">3% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600 text-lg">~ ₹112</span>
                    <span className="text-sm text-gray-500 line-through ml-1">₹115</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Rapido */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl text-red-500 mb-3">Rapido</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleBooking('Rapido', 'Bike', 83.30, 20)}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left"
                >
                  <div className="flex items-center">
                    <i className="fas fa-motorcycle text-xl text-orange-500 mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Bike</p>
                      <p className="text-xs text-green-600 font-bold">2% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-green-600 text-lg">~ ₹83</span>
                    <span className="text-sm text-gray-500 line-through ml-1">₹85</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3 dark:text-white">Use Public Transport</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <i className="fas fa-bus text-2xl text-primary mb-2"></i>
              <p className="dark:text-gray-200">Bus Routes</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <i className="fas fa-map-marked-alt text-2xl text-primary mb-2"></i>
              <p className="dark:text-gray-200">Live Tracker</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <i className="fas fa-subway text-2xl text-primary mb-2"></i>
              <p className="dark:text-gray-200">Metro Guide</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
              <i className="fas fa-wallet text-2xl text-primary mb-2"></i>
              <p className="dark:text-gray-200">Recharge</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-3 dark:text-white">CityPass Deals</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/gym-offers')}
              className="w-full text-left bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center"
            >
              <i className="fas fa-dumbbell text-xl text-red-500 mr-4"></i>
              <p className="dark:text-gray-200">Fitness Offers</p>
            </button>
            <button
              onClick={() => navigate('/food-dining')}
              className="w-full text-left bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center"
            >
              <i className="fas fa-utensils text-xl text-yellow-500 mr-4"></i>
              <p className="dark:text-gray-200">Food & Dining</p>
            </button>
          </div>
        </div>
      </div>

      <CompareModal isOpen={showCompare} onClose={() => setShowCompare(false)} />
    </div>
  );
};
