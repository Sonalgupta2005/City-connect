import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

export const EcoImpact = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();

  const handleDownloadCertificate = () => {
    toast.success('Certificate download started!');
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen bg-gray-100 dark:bg-gray-900 z-20 overflow-y-auto">
      <header className="p-5 bg-white dark:bg-gray-800 shadow-sm flex items-center">
        <button onClick={() => navigate(-1)} className="dark:text-white">
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center flex-grow">
          My Eco Impact
        </h1>
      </header>
      <div className="p-5 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
          <i className="fas fa-leaf text-5xl text-green-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-300">You've saved</p>
          <p className="text-4xl font-extrabold text-green-600 my-2">25.3 kg</p>
          <p className="text-gray-600 dark:text-gray-300">of CO2 by walking and using public transport!</p>
        </div>

        <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" className="w-full">
            <rect width="400" height="250" className="fill-green-50 dark:fill-gray-700" />
            <rect x="10" y="10" width="380" height="230" fill="none" className="stroke-green-800 dark:stroke-green-400" strokeWidth="2" />
            <path d="M175,40 L225,40 L200,70 Z" className="fill-green-500 dark:fill-green-600" />
            <text x="200" y="100" fontFamily="Inter, sans-serif" fontSize="20" textAnchor="middle" fontWeight="bold" className="fill-green-800 dark:fill-green-300">
              Certificate of Achievement
            </text>
            <text x="200" y="130" fontFamily="Inter, sans-serif" fontSize="12" textAnchor="middle" className="fill-green-700 dark:fill-green-400">
              This certificate is proudly presented to
            </text>
            <text x="200" y="160" fontFamily="Inter, sans-serif" fontSize="24" textAnchor="middle" fontWeight="bold" className="fill-green-900 dark:fill-green-200">
              {appState.profile.name}
            </text>
            <text x="200" y="185" fontFamily="Inter, sans-serif" fontSize="12" textAnchor="middle" className="fill-green-700 dark:fill-green-400">
              for their outstanding contribution to reducing carbon emissions.
            </text>
            <text x="100" y="220" fontFamily="Inter, sans-serif" fontSize="10" textAnchor="middle" className="fill-green-800 dark:fill-green-300">
              Date: 2025-09-13
            </text>
            <text x="300" y="220" fontFamily="Inter, sans-serif" fontSize="10" textAnchor="middle" className="fill-green-800 dark:fill-green-300">
              City Connect
            </text>
          </svg>
        </div>

        <button
          onClick={handleDownloadCertificate}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center"
        >
          <i className="fas fa-download mr-3"></i>Download Certificate
        </button>
      </div>
    </div>
  );
};
