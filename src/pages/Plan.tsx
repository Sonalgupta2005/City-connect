import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LocationAutocomplete } from '@/components/LocationAutocomplete';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader } from '@googlemaps/js-api-loader';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  rides: RideOption[];
  pickup: string;
  drop: string;
  sortBy: 'cost' | 'time';
  onSortChange: (sortBy: 'cost' | 'time') => void;
  preferredType?: string;
}

interface RideOption {
  provider: string;
  type: string;
  cost: number;
  time: number;
  discount: number;
  available: boolean;
  unavailableReason?: string;
}

// Base prices and rates per km for each provider and ride type (realistic Indian pricing)
const PRICING_CONFIG = {
  Uber: {
    Car: { base: 60, perKm: 15, avgSpeed: 30 },
    Auto: { base: 35, perKm: 12, avgSpeed: 25 },
  },
  Ola: {
    Car: { base: 55, perKm: 13, avgSpeed: 30 },
    Auto: { base: 32, perKm: 11, avgSpeed: 25 },
  },
  Rapido: {
    Bike: { base: 25, perKm: 10, avgSpeed: 40 },
  },
  inDrive: {
    Car: { base: 50, perKm: 12, avgSpeed: 30 },
    Auto: { base: 30, perKm: 10, avgSpeed: 25 },
  },
};

// Distance limits for each ride type (in km)
const DISTANCE_LIMITS = {
  Bike: 15,
  Auto: 40,
  Car: Infinity,
};

// Check if ride type is available for the distance
const isRideAvailable = (type: string, distance: number) => {
  const limit = DISTANCE_LIMITS[type as keyof typeof DISTANCE_LIMITS];
  return distance <= limit;
};

// Get unavailability reason
const getUnavailableReason = (type: string, distance: number) => {
  const limit = DISTANCE_LIMITS[type as keyof typeof DISTANCE_LIMITS];
  if (distance > limit) {
    return `Not available for distances over ${limit}km`;
  }
  return '';
};

// Calculate fare based on distance
const calculateFare = (provider: keyof typeof PRICING_CONFIG, type: string, distance: number) => {
  const providerConfig = PRICING_CONFIG[provider];
  const config = (providerConfig as any)[type];
  if (!config) return { cost: 0, time: 0, available: false, unavailableReason: 'Not available' };
  
  const available = isRideAvailable(type, distance);
  const unavailableReason = available ? '' : getUnavailableReason(type, distance);
  
  const cost = config.base + (distance * config.perKm);
  const time = Math.round((distance / config.avgSpeed) * 60); // Convert to minutes
  
  return { cost, time, available, unavailableReason };
};

const CompareModal = ({ isOpen, onClose, rides, pickup, drop, sortBy, onSortChange, preferredType }: CompareModalProps) => {
  const { addTrip } = useAppContext();
  
  // Filter and sort rides - available rides first, then by selected criteria
  const availableRides = rides.filter(r => r.available);
  const unavailableRides = rides.filter(r => !r.available);
  
  const sortedAvailableRides = [...availableRides].sort((a, b) => {
    // Prioritize preferred type
    if (preferredType) {
      if (a.type === preferredType && b.type !== preferredType) return -1;
      if (b.type === preferredType && a.type !== preferredType) return 1;
    }
    
    // Sort by primary criterion, with secondary criterion as tiebreaker
    if (sortBy === 'cost') {
      // Sort by cost first, then by time if costs are equal
      if (a.cost !== b.cost) return a.cost - b.cost;
      return a.time - b.time;
    } else {
      // Sort by time first, then by cost if times are equal
      if (a.time !== b.time) return a.time - b.time;
      return a.cost - b.cost;
    }
  });
  
  const allRides = [...sortedAvailableRides, ...unavailableRides];

  const handleBook = (provider: string, type: string, cost: number) => {
    addTrip({
      from: pickup || 'Current Location',
      to: drop || 'Destination',
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
          <h2 className="text-xl font-bold dark:text-white">Smart Comparison</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => onSortChange('cost')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              sortBy === 'cost'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <i className="fas fa-rupee-sign mr-2"></i>Best Price
          </button>
          <button
            onClick={() => onSortChange('time')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
              sortBy === 'time'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <i className="fas fa-clock mr-2"></i>Fastest
          </button>
        </div>
        
        {rides.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Please enter pickup and drop locations to compare prices
          </p>
        ) : (
          <div className="space-y-3">
            {/* Best Option Highlight */}
            {sortedAvailableRides.length > 0 && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-2 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-500 mr-2"></i>
                    <p className="font-bold text-gray-800 dark:text-gray-200">
                      Most Efficient: {sortedAvailableRides[0].provider} - {sortedAvailableRides[0].type}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {sortBy === 'cost' 
                    ? `Lowest fare at ₹${Math.round(sortedAvailableRides[0].cost)} • ${sortedAvailableRides[0].time} mins`
                    : `Fastest option at ${sortedAvailableRides[0].time} mins • ₹${Math.round(sortedAvailableRides[0].cost)}`
                  }
                  {preferredType && sortedAvailableRides[0].type === preferredType && (
                    <span className="ml-2 text-primary font-semibold">• Your preferred type</span>
                  )}
                </p>
              </div>
            )}
            
            {allRides.map((ride, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-2 border-transparent hover:border-primary transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold dark:text-white">{ride.provider} - {ride.type}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <i className="fas fa-clock mr-1"></i>~{ride.time} mins
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{Math.round(ride.cost)}</p>
                    {ride.discount > 0 && (
                      <p className="text-xs text-gray-500">{ride.discount}% off</p>
                    )}
                  </div>
                </div>
                {index === 0 && (
                  <div className="mb-2">
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                      {sortBy === 'cost' ? 'Best Price' : 'Fastest'}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => handleBook(ride.provider, ride.type, ride.cost)}
                  className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Plan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addTrip, userRole, subscriptionExpiresAt, appState } = useAppContext();
  const [showCompare, setShowCompare] = useState(false);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [newStop, setNewStop] = useState('');
  const [comparisonRides, setComparisonRides] = useState<RideOption[]>([]);
  const [sortBy, setSortBy] = useState<'cost' | 'time'>('cost');
  const [calculatedPrices, setCalculatedPrices] = useState<Record<string, { cost: number; time: number; available: boolean; unavailableReason?: string }>>({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const [preferredRideType, setPreferredRideType] = useState<string>('Car');
  const isQuickRouteRef = useRef(false);
  
  // Check if subscription is active (role is subscribed AND not expired)
  const isSubscribed = userRole === 'subscribed' && subscriptionExpiresAt && new Date(subscriptionExpiresAt) > new Date();
  const hasLocations = pickup.trim() && drop.trim();
  
  // Calculate step-based discount for subscribed users
  const getStepDiscount = () => {
    if (!isSubscribed) return 0;
    const steps = appState.fitness.today.steps;
    if (steps >= 15000) return 0.20; // 20% off
    if (steps >= 10000) return 0.10; // 10% off
    if (steps >= 5000) return 0.05;  // 5% off
    return 0;
  };
  
  const stepDiscount = getStepDiscount();

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          console.error('Google Maps API key not found');
          toast.error('Google Maps API key not configured');
          return;
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        // The loader itself can be awaited
        await loader;
        console.log('Google Maps API loaded successfully');
        setIsGoogleMapsLoaded(true);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        toast.error('Failed to load Google Maps');
      }
    };

    loadGoogleMaps();
  }, []);

  // Handle quick route from home/work buttons
  useEffect(() => {
    const state = location.state as { quickDestination?: string; destinationType?: string } | null;
    if (state?.quickDestination) {
      setDrop(state.quickDestination);
      isQuickRouteRef.current = true;
      // Clear the state so it doesn't trigger again
      navigate(location.pathname, { replace: true, state: {} });
      
      // Get current location for pickup
      getCurrentLocation();
    }
  }, [location.state]);

  // Auto-trigger comparison or price calculation when both locations are set from quick route
  useEffect(() => {
    if (isQuickRouteRef.current && pickup.trim() && drop.trim()) {
      isQuickRouteRef.current = false; // Reset flag
      
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        if (isSubscribed) {
          // For subscribed users, show smart comparison
          handleCompare();
        } else {
          // For normal users, calculate prices
          calculateAllPrices();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [pickup, drop]);

  const handleAddStop = () => {
    if (newStop.trim()) {
      setStops([...stops, newStop.trim()]);
      setNewStop('');
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  // Get current location and reverse geocode to address
  const getCurrentLocation = async () => {
    console.log('getCurrentLocation called');
    
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    // Check if Google Maps is loaded
    if (!isGoogleMapsLoaded || !window.google || !window.google.maps) {
      console.error('Google Maps not loaded yet');
      toast.error('Google Maps is still loading. Please wait a moment and try again.');
      return;
    }

    setIsGettingLocation(true);
    const loadingToast = toast.loading('Getting your location...');
    console.log('Requesting geolocation...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Geolocation success:', position.coords);
        const { latitude, longitude } = position.coords;
        
        try {
          console.log('Starting geocoding for:', latitude, longitude);
          const geocoder = new google.maps.Geocoder();
          
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results, status) => {
              console.log('Geocoding response:', status, results);
              toast.dismiss(loadingToast);
              
              if (status === 'OK' && results && results[0]) {
                const address = results[0].formatted_address;
                console.log('Address found:', address);
                setPickup(address);
                toast.success('Current location detected!');
              } else {
                console.error('Geocoding failed:', status);
                toast.error(`Could not determine address: ${status}`);
              }
              setIsGettingLocation(false);
            }
          );
        } catch (error) {
          console.error('Geocoding error:', error);
          toast.dismiss(loadingToast);
          toast.error('Failed to get address from location');
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.dismiss(loadingToast);
        setIsGettingLocation(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('Location permission denied by user');
            toast.error('Location permission denied. Please allow location access in your browser.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('Location information unavailable');
            toast.error('Location information unavailable');
            break;
          case error.TIMEOUT:
            console.error('Location request timed out');
            toast.error('Location request timed out');
            break;
          default:
            console.error('Unknown geolocation error:', error);
            toast.error('Failed to get location');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // Calculate prices when locations change
  const calculateAllPrices = async () => {
    if (!pickup.trim() || !drop.trim()) {
      setCalculatedPrices({});
      toast.error('Please enter both pickup and drop locations');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('calculate-distance', {
        body: { pickup, drop, stops }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const distance = data.distance;
      const prices: Record<string, { cost: number; time: number; available: boolean; unavailableReason?: string }> = {};

      Object.keys(PRICING_CONFIG).forEach((provider) => {
        Object.keys(PRICING_CONFIG[provider as keyof typeof PRICING_CONFIG]).forEach((type) => {
          let { cost, time, available, unavailableReason } = calculateFare(provider as keyof typeof PRICING_CONFIG, type, distance);
          // Apply step-based discount for subscribed users
          if (stepDiscount > 0) {
            cost = cost * (1 - stepDiscount);
          }
          prices[`${provider}-${type}`] = { cost, time, available, unavailableReason };
        });
      });

      setCalculatedPrices(prices);
      toast.success(`Prices calculated for ${distance.toFixed(1)}km journey (${data.durationText})`);
    } catch (error) {
      console.error('Error calculating prices:', error);
      toast.error('Failed to calculate distances. Please check the locations and try again.');
    }
  };

  const handleCompare = async () => {
    if (!isSubscribed) {
      toast.error('Smart Comparison is exclusive to subscribed users!', {
        description: 'Upgrade to access advanced comparison features'
      });
      return;
    }

    if (!pickup.trim() || !drop.trim()) {
      toast.error('Please enter pickup and drop locations');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('calculate-distance', {
        body: { pickup, drop, stops }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const distance = data.distance;
      const rides: RideOption[] = [];

      // Calculate fares for all providers and types
      Object.keys(PRICING_CONFIG).forEach((provider) => {
        Object.keys(PRICING_CONFIG[provider as keyof typeof PRICING_CONFIG]).forEach((type) => {
          let { cost, time, available, unavailableReason } = calculateFare(provider as keyof typeof PRICING_CONFIG, type, distance);
          // Apply step-based discount for subscribed users
          if (stepDiscount > 0) {
            cost = cost * (1 - stepDiscount);
          }
          const discount = type === 'Car' ? 5 : type === 'Auto' ? 3 : 2;
          rides.push({
            provider,
            type,
            cost,
            time,
            discount,
            available,
            unavailableReason,
          });
        });
      });

      setComparisonRides(rides);
      setShowCompare(true);
      toast.success(`Smart comparison ready for ${distance.toFixed(1)}km journey (${data.durationText})`);
    } catch (error) {
      console.error('Error in smart comparison:', error);
      toast.error('Failed to calculate distances. Please check the locations and try again.');
    }
  };

  const handleBooking = (provider: string, type: string, cost: number, time: number, available: boolean) => {
    if (!available) {
      toast.error(`${type} is not available for this distance`);
      return;
    }
    addTrip({
      from: pickup || 'Current Location',
      to: drop || 'Destination',
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
        {/* Step Discount Banner for Subscribed Users */}
        {isSubscribed && stepDiscount > 0 && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <i className="fas fa-walking text-green-600 dark:text-green-400 text-2xl"></i>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  {stepDiscount * 100}% Move-to-Earn Discount Active!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  {appState.fitness.today.steps.toLocaleString()} steps today • All prices reduced
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Book a Private Ride Section */}
        <div>
          <h2 className="font-bold text-lg mb-4 dark:text-white">Book a Private Ride</h2>

          {/* Location Input Section */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-4 space-y-3">
            {/* Preferred Ride Type Selector */}
            <div className="mb-4">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                Preferred Ride Type
              </Label>
              <RadioGroup value={preferredRideType} onValueChange={setPreferredRideType} className="flex gap-3">
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="Car" id="car" />
                  <Label htmlFor="car" className="flex items-center gap-2 cursor-pointer text-sm">
                    <i className="fas fa-car text-primary"></i>
                    <span>Car</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="Auto" id="auto" />
                  <Label htmlFor="auto" className="flex items-center gap-2 cursor-pointer text-sm">
                    <i className="fas fa-taxi text-primary"></i>
                    <span>Auto</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <RadioGroupItem value="Bike" id="bike" />
                  <Label htmlFor="bike" className="flex items-center gap-2 cursor-pointer text-sm">
                    <i className="fas fa-motorcycle text-primary"></i>
                    <span>Bike</span>
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <i className="fas fa-info-circle mr-1"></i>
                Bikes: up to 15km • Autos: up to 40km • Cars: all distances
              </p>
            </div>

            <div className="relative">
              <LocationAutocomplete
                value={pickup}
                onChange={setPickup}
                placeholder="Enter pickup location"
                label="Pickup Location"
                icon="fa-map-marker-alt"
                iconColor="text-green-600"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="absolute right-2 top-[34px] p-2 rounded-lg bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Use current location"
              >
                <i className={`fas fa-location-crosshairs text-primary ${isGettingLocation ? 'animate-pulse' : ''}`}></i>
              </button>
            </div>

            {/* Stops Section */}
            {stops.length > 0 && (
              <div className="space-y-2">
                {stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <i className="fas fa-circle text-xs text-blue-500"></i>
                    <Input
                      type="text"
                      value={stop}
                      disabled
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveStop(index)}
                      className="text-red-500"
                    >
                      <i className="fas fa-times"></i>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Stop */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add a stop (optional)"
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddStop()}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleAddStop}
                disabled={!newStop.trim()}
              >
                <i className="fas fa-plus mr-2"></i>Add
              </Button>
            </div>

            <LocationAutocomplete
              value={drop}
              onChange={setDrop}
              placeholder="Enter drop location"
              label="Drop Location"
              icon="fa-map-marker-alt"
              iconColor="text-red-600"
            />
          </div>

          {isSubscribed ? (
            <button
              onClick={handleCompare}
              className="w-full gradient-bg text-white font-bold py-4 rounded-lg shadow-lg mb-6 flex items-center justify-center text-lg transition-transform transform hover:scale-105"
            >
              <i className="fas fa-search-dollar mr-3"></i>Smart Price Comparison
            </button>
          ) : (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border-2 border-amber-300">
              <div className="flex items-start gap-3">
                <i className="fas fa-crown text-amber-500 text-2xl"></i>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">
                    Unlock Smart Comparison
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Compare all ride options by cost & time, get AI recommendations
                  </p>
                  <button 
                    onClick={() => navigate('/wallet')}
                    className="text-sm font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Upgrade to Subscribed →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Calculate button for normal users */}
          {!isSubscribed && (
            <button
              onClick={calculateAllPrices}
              disabled={!pickup.trim() || !drop.trim()}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg mb-4 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <i className="fas fa-calculator mr-2"></i>
              {hasLocations ? 'Calculate Prices' : 'Enter Locations First'}
            </button>
          )}

          {/* Providers */}
          <div className="space-y-4">
            {/* Uber */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-extrabold text-xl text-black dark:text-white mb-3">Uber</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const price = calculatedPrices['Uber-Car'];
                    if (price) handleBooking('Uber', 'Car', price.cost, price.time, price.available);
                    else toast.error('Please calculate prices first');
                  }}
                  disabled={!calculatedPrices['Uber-Car'] || !calculatedPrices['Uber-Car']?.available}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <i className="fas fa-car text-xl text-black dark:text-white mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Car</p>
                      <p className="text-xs text-green-600 font-bold">5% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {calculatedPrices['Uber-Car'] ? (
                      <>
                        <span className="font-semibold text-green-600 text-lg">
                          ~ ₹{Math.round(calculatedPrices['Uber-Car'].cost * 0.95)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-1">
                          ₹{Math.round(calculatedPrices['Uber-Car'].cost)}
                        </span>
                        <p className="text-xs text-gray-500">~{calculatedPrices['Uber-Car'].time} mins</p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Enter locations</span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    const price = calculatedPrices['Uber-Auto'];
                    if (price) handleBooking('Uber', 'Auto', price.cost, price.time, price.available);
                    else toast.error('Please calculate prices first');
                  }}
                  disabled={!calculatedPrices['Uber-Auto'] || !calculatedPrices['Uber-Auto']?.available}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <i className="fas fa-shuttle-van text-xl text-yellow-600 mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Auto</p>
                      <p className="text-xs text-green-600 font-bold">3% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {calculatedPrices['Uber-Auto'] ? (
                      <>
                        <span className="font-semibold text-green-600 text-lg">
                          ~ ₹{Math.round(calculatedPrices['Uber-Auto'].cost * 0.97)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-1">
                          ₹{Math.round(calculatedPrices['Uber-Auto'].cost)}
                        </span>
                        <p className="text-xs text-gray-500">~{calculatedPrices['Uber-Auto'].time} mins</p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Enter locations</span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Ola */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-extrabold text-xl text-black dark:text-white mb-3">Ola</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const price = calculatedPrices['Ola-Car'];
                    if (price) handleBooking('Ola', 'Car', price.cost, price.time, price.available);
                    else toast.error('Please calculate prices first');
                  }}
                  disabled={!calculatedPrices['Ola-Car'] || !calculatedPrices['Ola-Car']?.available}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <i className="fas fa-car text-xl text-black dark:text-white mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Car</p>
                      <p className="text-xs text-green-600 font-bold">5% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {calculatedPrices['Ola-Car'] ? (
                      <>
                        <span className="font-semibold text-green-600 text-lg">
                          ~ ₹{Math.round(calculatedPrices['Ola-Car'].cost * 0.95)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-1">
                          ₹{Math.round(calculatedPrices['Ola-Car'].cost)}
                        </span>
                        <p className="text-xs text-gray-500">~{calculatedPrices['Ola-Car'].time} mins</p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Enter locations</span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    const price = calculatedPrices['Ola-Auto'];
                    if (price) handleBooking('Ola', 'Auto', price.cost, price.time, price.available);
                    else toast.error('Please calculate prices first');
                  }}
                  disabled={!calculatedPrices['Ola-Auto'] || !calculatedPrices['Ola-Auto']?.available}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <i className="fas fa-shuttle-van text-xl text-yellow-600 mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Auto</p>
                      <p className="text-xs text-green-600 font-bold">3% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {calculatedPrices['Ola-Auto'] ? (
                      <>
                        <span className="font-semibold text-green-600 text-lg">
                          ~ ₹{Math.round(calculatedPrices['Ola-Auto'].cost * 0.97)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-1">
                          ₹{Math.round(calculatedPrices['Ola-Auto'].cost)}
                        </span>
                        <p className="text-xs text-gray-500">~{calculatedPrices['Ola-Auto'].time} mins</p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Enter locations</span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Rapido */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl text-red-500 mb-3">Rapido</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const price = calculatedPrices['Rapido-Bike'];
                    if (price) handleBooking('Rapido', 'Bike', price.cost, price.time, price.available);
                    else toast.error('Please calculate prices first');
                  }}
                  disabled={!calculatedPrices['Rapido-Bike'] || !calculatedPrices['Rapido-Bike']?.available}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <i className="fas fa-motorcycle text-xl text-orange-500 mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Bike</p>
                      <p className="text-xs text-green-600 font-bold">2% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {calculatedPrices['Rapido-Bike'] ? (
                      <>
                        <span className="font-semibold text-green-600 text-lg">
                          ~ ₹{Math.round(calculatedPrices['Rapido-Bike'].cost * 0.98)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-1">
                          ₹{Math.round(calculatedPrices['Rapido-Bike'].cost)}
                        </span>
                        <p className="text-xs text-gray-500">~{calculatedPrices['Rapido-Bike'].time} mins</p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Enter locations</span>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* inDrive */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl text-green-600 mb-3">inDrive</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const price = calculatedPrices['inDrive-Car'];
                    if (price) handleBooking('inDrive', 'Car', price.cost, price.time, price.available);
                    else toast.error('Please calculate prices first');
                  }}
                  disabled={!calculatedPrices['inDrive-Car'] || !calculatedPrices['inDrive-Car']?.available}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <i className="fas fa-car text-xl text-black dark:text-white mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Car</p>
                      <p className="text-xs text-green-600 font-bold">5% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {calculatedPrices['inDrive-Car'] ? (
                      <>
                        <span className="font-semibold text-green-600 text-lg">
                          ~ ₹{Math.round(calculatedPrices['inDrive-Car'].cost * 0.95)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-1">
                          ₹{Math.round(calculatedPrices['inDrive-Car'].cost)}
                        </span>
                        <p className="text-xs text-gray-500">~{calculatedPrices['inDrive-Car'].time} mins</p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Enter locations</span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    const price = calculatedPrices['inDrive-Auto'];
                    if (price) handleBooking('inDrive', 'Auto', price.cost, price.time, price.available);
                    else toast.error('Please calculate prices first');
                  }}
                  disabled={!calculatedPrices['inDrive-Auto'] || !calculatedPrices['inDrive-Auto']?.available}
                  className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-left disabled:opacity-50"
                >
                  <div className="flex items-center">
                    <i className="fas fa-shuttle-van text-xl text-yellow-600 mr-4"></i>
                    <div>
                      <p className="font-semibold dark:text-gray-200">Book Auto</p>
                      <p className="text-xs text-green-600 font-bold">3% Commuter Pass Discount!</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {calculatedPrices['inDrive-Auto'] ? (
                      <>
                        <span className="font-semibold text-green-600 text-lg">
                          ~ ₹{Math.round(calculatedPrices['inDrive-Auto'].cost * 0.97)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-1">
                          ₹{Math.round(calculatedPrices['inDrive-Auto'].cost)}
                        </span>
                        <p className="text-xs text-gray-500">~{calculatedPrices['inDrive-Auto'].time} mins</p>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Enter locations</span>
                    )}
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

      {isSubscribed && (
        <CompareModal
          isOpen={showCompare}
          onClose={() => setShowCompare(false)}
          rides={comparisonRides}
          pickup={pickup}
          drop={drop}
          sortBy={sortBy}
          preferredType={preferredRideType}
          onSortChange={setSortBy}
        />
      )}
    </div>
  );
};
