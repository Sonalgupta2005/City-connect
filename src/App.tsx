import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "@/contexts/AppContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { SplashScreen } from "@/components/layout/SplashScreen";

// Main Pages
import { Home } from "@/pages/Home";
import { Plan } from "@/pages/Plan";
import { Wallet } from "@/pages/Wallet";
import { Profile } from "@/pages/Profile";
import { Auth } from "@/pages/Auth";

// Sub Pages
import { TransactionHistory } from "@/pages/sub/TransactionHistory";
import { TripHistory } from "@/pages/sub/TripHistory";
import { GymOffers } from "@/pages/sub/GymOffers";
import { FoodDining } from "@/pages/sub/FoodDining";
import { SavingsReport } from "@/pages/sub/SavingsReport";
import { TravelSpends } from "@/pages/sub/TravelSpends";
import { FitnessActivity } from "@/pages/sub/FitnessActivity";
import { EcoImpact } from "@/pages/sub/EcoImpact";
import { PersonalDetails } from "@/pages/sub/PersonalDetails";
import { MyPlaces } from "@/pages/sub/MyPlaces";
import { ManageNotifications } from "@/pages/sub/ManageNotifications";
import { PrivacySecurity } from "@/pages/sub/PrivacySecurity";
import { InviteEarn } from "@/pages/sub/InviteEarn";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAppContext();
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <SplashScreen />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* Main Pages with Navigation */}
            <Route path="/" element={<ProtectedRoute><MobileLayout><Home /></MobileLayout></ProtectedRoute>} />
            <Route path="/plan" element={<ProtectedRoute><MobileLayout><Plan /></MobileLayout></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><MobileLayout><Wallet /></MobileLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MobileLayout><Profile /></MobileLayout></ProtectedRoute>} />

            {/* Sub Pages without Bottom Navigation */}
            <Route path="/transaction-history" element={<ProtectedRoute><MobileLayout hideNav><TransactionHistory /></MobileLayout></ProtectedRoute>} />
            <Route path="/trip-history" element={<ProtectedRoute><MobileLayout hideNav><TripHistory /></MobileLayout></ProtectedRoute>} />
            <Route path="/gym-offers" element={<ProtectedRoute><MobileLayout hideNav><GymOffers /></MobileLayout></ProtectedRoute>} />
            <Route path="/food-dining" element={<ProtectedRoute><MobileLayout hideNav><FoodDining /></MobileLayout></ProtectedRoute>} />
            <Route path="/savings-report" element={<ProtectedRoute><MobileLayout hideNav><SavingsReport /></MobileLayout></ProtectedRoute>} />
            <Route path="/travel-spends" element={<ProtectedRoute><MobileLayout hideNav><TravelSpends /></MobileLayout></ProtectedRoute>} />
            <Route path="/fitness-activity" element={<ProtectedRoute><MobileLayout hideNav><FitnessActivity /></MobileLayout></ProtectedRoute>} />
            <Route path="/eco-impact" element={<ProtectedRoute><MobileLayout hideNav><EcoImpact /></MobileLayout></ProtectedRoute>} />
            <Route path="/personal-details" element={<ProtectedRoute><MobileLayout hideNav><PersonalDetails /></MobileLayout></ProtectedRoute>} />
            <Route path="/my-places" element={<ProtectedRoute><MobileLayout hideNav><MyPlaces /></MobileLayout></ProtectedRoute>} />
            <Route path="/manage-notifications" element={<ProtectedRoute><MobileLayout hideNav><ManageNotifications /></MobileLayout></ProtectedRoute>} />
            <Route path="/privacy-security" element={<ProtectedRoute><MobileLayout hideNav><PrivacySecurity /></MobileLayout></ProtectedRoute>} />
            <Route path="/invite-earn" element={<ProtectedRoute><MobileLayout hideNav><InviteEarn /></MobileLayout></ProtectedRoute>} />

            {/* Catch-all 404 */}
            <Route path="*" element={<MobileLayout hideNav><NotFound /></MobileLayout>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
