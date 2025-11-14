import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockData } from '@/data/mockData';

export interface AppState {
  profile: {
    name: string;
    phone: string;
    email: string;
    referralCode: string;
  };
  liveStatus: Array<{
    type: string;
    name: string;
    status: string;
    location: string;
  }>;
  badges: Array<{
    icon: string;
    color: string;
    title: string;
  }>;
  coupons: Array<{
    title: string;
    subtitle: string;
    provider: string;
  }>;
  wallet: {
    balance: number;
    history: Array<{
      type: string;
      amount: number;
      date: string;
      details: string;
    }>;
  };
  tripHistory: Array<{
    from: string;
    to: string;
    mode: string;
    cost: number;
    date: string;
  }>;
  restaurants: Array<{
    name: string;
    cuisine: string;
    website: string;
  }>;
  gyms: Array<{
    name: string;
    offer: string;
    website: string;
  }>;
  savingsReport: Array<{
    date: string;
    saved: number;
    text: string;
  }>;
  travelSpends: Array<{
    date: string;
    mode: string;
    amount: number;
  }>;
  fitness: {
    today: {
      steps: number;
      distance: number;
      calories: number;
      goal: number;
      co2Saved: number;
    };
    month1: { steps: number; distance: number; calories: number; goal: number };
    month2: { steps: number; distance: number; calories: number; goal: number };
    month3: { steps: number; distance: number; calories: number; goal: number };
  };
  myPlaces: Array<{
    id: string;
    label: string;
    address: string;
    icon: string;
  }>;
  notificationSettings: Array<{
    id: string;
    label: string;
    checked: boolean;
  }>;
  security: {
    twoFactorEnabled: boolean;
    loggedInDevices: Array<{
      device: string;
      location: string;
      time: string;
      icon: string;
    }>;
  };
}

interface AppContextType {
  appState: AppState;
  updateProfile: (profile: Partial<AppState['profile']>) => void;
  addMoney: (amount: number) => void;
  addTrip: (trip: AppState['tripHistory'][0]) => void;
  toggleNotification: (id: string) => void;
  toggle2FA: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(mockData);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const updateProfile = (profile: Partial<AppState['profile']>) => {
    setAppState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));
  };

  const addMoney = (amount: number) => {
    setAppState(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance + amount,
        history: [
          {
            type: 'Added',
            amount,
            date: new Date().toISOString().split('T')[0],
            details: 'Added to Wallet'
          },
          ...prev.wallet.history
        ]
      }
    }));
  };

  const addTrip = (trip: AppState['tripHistory'][0]) => {
    setAppState(prev => ({
      ...prev,
      tripHistory: [trip, ...prev.tripHistory],
      wallet: {
        ...prev.wallet,
        balance: prev.wallet.balance - trip.cost,
        history: [
          {
            type: 'Ride',
            amount: -trip.cost,
            date: trip.date,
            details: `${trip.mode} to ${trip.to}`
          },
          ...prev.wallet.history
        ]
      }
    }));
  };

  const toggleNotification = (id: string) => {
    setAppState(prev => ({
      ...prev,
      notificationSettings: prev.notificationSettings.map(setting =>
        setting.id === id ? { ...setting, checked: !setting.checked } : setting
      )
    }));
  };

  const toggle2FA = () => {
    setAppState(prev => ({
      ...prev,
      security: {
        ...prev.security,
        twoFactorEnabled: !prev.security.twoFactorEnabled
      }
    }));
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        updateProfile,
        addMoney,
        addTrip,
        toggleNotification,
        toggle2FA,
        darkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
