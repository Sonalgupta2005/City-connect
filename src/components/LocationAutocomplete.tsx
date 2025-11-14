import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon: string;
  iconColor: string;
}

export const LocationAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  icon,
  iconColor
}: LocationAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    // Initialize Google Places Autocomplete Service
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

  const handleInputChange = async (inputValue: string) => {
    onChange(inputValue);

    if (!inputValue.trim() || inputValue.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    if (!autocompleteService.current) {
      return;
    }

    setIsLoading(true);
    try {
      const request = {
        input: inputValue,
        componentRestrictions: { country: 'in' }, // Restrict to India
        types: ['geocode'], // Get places, cities, addresses
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (results, status) => {
          setIsLoading(false);
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setPredictions(results);
            setShowPredictions(true);
          } else {
            setPredictions([]);
            setShowPredictions(false);
          }
        }
      );
    } catch (error) {
      console.error('Autocomplete error:', error);
      setIsLoading(false);
    }
  };

  const handleSelectPrediction = (prediction: google.maps.places.AutocompletePrediction) => {
    onChange(prediction.description);
    setPredictions([]);
    setShowPredictions(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-1 dark:text-gray-200">
        <i className={`fas ${icon} ${iconColor} mr-2`}></i>{label}
      </label>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (predictions.length > 0) setShowPredictions(true);
          }}
          onBlur={() => {
            // Delay to allow click on prediction
            setTimeout(() => setShowPredictions(false), 200);
          }}
          className="w-full pr-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPrediction(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors"
            >
              <i className="fas fa-map-marker-alt text-primary mt-1"></i>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {prediction.structured_formatting.main_text}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
