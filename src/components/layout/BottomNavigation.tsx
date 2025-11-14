import { useLocation, useNavigate } from 'react-router-dom';

export const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: 'fa-home', label: 'Home' },
    { path: '/plan', icon: 'fa-compass', label: 'Plan' },
    { path: '/wallet', icon: 'fa-wallet', label: 'Wallet' },
    { path: '/profile', icon: 'fa-user', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto z-[1000] bg-white dark:bg-gray-800 shadow-lg flex justify-around py-3 border-t border-gray-200 dark:border-gray-700">
      {navItems.map(item => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center space-y-1 flex-1"
        >
          <i className={`fas ${item.icon} text-xl ${isActive(item.path) ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}></i>
          <span className={`text-xs ${isActive(item.path) ? 'text-primary font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
