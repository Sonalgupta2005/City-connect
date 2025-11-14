import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockData } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
  updateAvatar: (avatarUrl: string) => Promise<void>;
  addMoney: (amount: number) => void;
  addTrip: (trip: AppState['tripHistory'][0]) => void;
  toggleNotification: (id: string) => void;
  toggle2FA: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: User | null;
  session: Session | null;
  userRole: 'normal' | 'subscribed' | null;
  subscriptionExpiresAt: string | null;
  avatarUrl: string | null;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(mockData);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'normal' | 'subscribed' | null>(null);
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role and profile when logged in
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
            fetchUserProfile(session.user.id);
          }, 0);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (data && !error) {
      setUserRole(data.role as 'normal' | 'subscribed');
    }
  };

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data && !error) {
      setAppState(prev => ({
        ...prev,
        profile: {
          name: data.name || prev.profile.name,
          phone: data.phone || prev.profile.phone,
          email: data.email || prev.profile.email,
          referralCode: data.referral_code || prev.profile.referralCode,
        }
      }));
      
      // Set subscription expiry date
      setSubscriptionExpiresAt((data as any).subscription_expires_at || null);
      
      // Set avatar URL
      setAvatarUrl((data as any).avatar_url || null);
    }
  };

  const updateProfile = async (profile: Partial<AppState['profile']>) => {
    // Update local state
    setAppState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile }
    }));

    // Update database if user is logged in
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
        })
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile');
      } else {
        toast.success('Profile updated successfully!');
      }
    }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (error) {
      toast.error('Failed to update avatar');
      throw error;
    } else {
      setAvatarUrl(avatarUrl);
      toast.success('Avatar updated successfully!');
    }
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

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    toast.success('Logged out successfully!');
  };

  return (
    <AppContext.Provider
      value={{
        appState,
        updateProfile,
        updateAvatar,
        addMoney,
        addTrip,
        toggleNotification,
        toggle2FA,
        darkMode,
        toggleDarkMode,
        user,
        session,
        userRole,
        subscriptionExpiresAt,
        avatarUrl,
        logout
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
