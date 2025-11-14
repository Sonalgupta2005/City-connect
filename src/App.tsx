import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { SplashScreen } from "@/components/layout/SplashScreen";

// Main Pages
import { Home } from "@/pages/Home";
import { Plan } from "@/pages/Plan";
import { Wallet } from "@/pages/Wallet";
import { Profile } from "@/pages/Profile";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <SplashScreen />
          <Routes>
            {/* Main Pages with Navigation */}
            <Route path="/" element={<MobileLayout><Home /></MobileLayout>} />
            <Route path="/plan" element={<MobileLayout><Plan /></MobileLayout>} />
            <Route path="/wallet" element={<MobileLayout><Wallet /></MobileLayout>} />
            <Route path="/profile" element={<MobileLayout><Profile /></MobileLayout>} />

            {/* Sub Pages without Bottom Navigation */}
            <Route path="/transaction-history" element={<MobileLayout hideNav><TransactionHistory /></MobileLayout>} />
            <Route path="/trip-history" element={<MobileLayout hideNav><TripHistory /></MobileLayout>} />
            <Route path="/gym-offers" element={<MobileLayout hideNav><GymOffers /></MobileLayout>} />
            <Route path="/food-dining" element={<MobileLayout hideNav><FoodDining /></MobileLayout>} />
            <Route path="/savings-report" element={<MobileLayout hideNav><SavingsReport /></MobileLayout>} />
            <Route path="/travel-spends" element={<MobileLayout hideNav><TravelSpends /></MobileLayout>} />
            <Route path="/fitness-activity" element={<MobileLayout hideNav><FitnessActivity /></MobileLayout>} />
            <Route path="/eco-impact" element={<MobileLayout hideNav><EcoImpact /></MobileLayout>} />
            <Route path="/personal-details" element={<MobileLayout hideNav><PersonalDetails /></MobileLayout>} />
            <Route path="/my-places" element={<MobileLayout hideNav><MyPlaces /></MobileLayout>} />
            <Route path="/manage-notifications" element={<MobileLayout hideNav><ManageNotifications /></MobileLayout>} />
            <Route path="/privacy-security" element={<MobileLayout hideNav><PrivacySecurity /></MobileLayout>} />
            <Route path="/invite-earn" element={<MobileLayout hideNav><InviteEarn /></MobileLayout>} />

            {/* Catch-all 404 */}
            <Route path="*" element={<MobileLayout hideNav><NotFound /></MobileLayout>} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
