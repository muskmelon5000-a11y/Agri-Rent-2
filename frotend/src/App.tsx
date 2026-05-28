// import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PhoneFrame } from './components/shared/PhoneFrame';
import { ScreenIndex } from './components/shared/ScreenIndex';
// Auth
import { SplashScreen } from './pages/auth/SplashScreen';
import { RoleSelection } from './pages/auth/RoleSelection';
import { PhoneLogin } from './pages/auth/PhoneLogin';
import { OTPVerification } from './pages/auth/OTPVerification';
// Seeker Discovery
import { SeekerHome } from './pages/seeker/discovery/SeekerHome';
import { CategoryListing } from './pages/seeker/discovery/CategoryListing';
import { SearchResults } from './pages/seeker/discovery/SearchResults';
import { SearchResultsMap } from './pages/seeker/discovery/SearchResultsMap';
import { AdvancedFilters } from './pages/seeker/discovery/AdvancedFilters';
import { MachineDetailTractor } from './pages/seeker/discovery/MachineDetailTractor';
import { MachineDetailRouter } from './pages/seeker/discovery/MachineDetailRouter';
import { OwnerProfile } from './pages/seeker/discovery/OwnerProfile';
import { NearbyHubs } from './pages/seeker/discovery/NearbyHubs';
// Seeker Booking
import { AvailabilityCalendar } from './pages/seeker/booking/AvailabilityCalendar';
import { RentalRequestForm } from './pages/seeker/booking/RentalRequestForm';
import { DealHelperCalculator } from './pages/seeker/booking/DealHelperCalculator';
import { DealHelperResults } from './pages/seeker/booking/DealHelperResults';
import { BookingConfirmation } from './pages/seeker/booking/BookingConfirmation';
import { ActiveRentalTracker } from './pages/seeker/booking/ActiveRentalTracker';
import { DirectConnect } from './pages/seeker/booking/DirectConnect';
import { PaymentReceipt } from './pages/seeker/booking/PaymentReceipt';
import { ExtensionRequest } from './pages/seeker/booking/ExtensionRequest';
import { CancellationFlow } from './pages/seeker/booking/CancellationFlow';
// Provider
import { ProviderDashboard } from './pages/provider/ProviderDashboard';
import { MyEquipmentList } from './pages/provider/MyEquipmentList';
import { AddMachineStep1 } from './pages/provider/AddMachineStep1';
import { AddMachineStep2 } from './pages/provider/AddMachineStep2';
import { AddMachineStep3 } from './pages/provider/AddMachineStep3';
import { AddMachineStep4 } from './pages/provider/AddMachineStep4';
import { EditMachine } from './pages/provider/EditMachine';
import { AvailabilityToggle } from './pages/provider/AvailabilityToggle';
import { IncomingRequests } from './pages/provider/IncomingRequests';
import { RequestDetail } from './pages/provider/RequestDetail';
import { ActiveJobMonitor } from './pages/provider/ActiveJobMonitor';
import { CompletedJobs } from './pages/provider/CompletedJobs';
import { EarningsReport } from './pages/provider/EarningsReport';
import { MaintenanceLogger } from './pages/provider/MaintenanceLogger';
import { EquipmentHealth } from './pages/provider/EquipmentHealth';
// Settings & Profile
import { UserProfile } from './pages/settings/UserProfile';
import { SkillBadges } from './pages/settings/SkillBadges';
import { VillageLeaderboard } from './pages/settings/VillageLeaderboard';
import { NotificationCenter } from './pages/settings/NotificationCenter';
import { HelpSupport } from './pages/settings/HelpSupport';
import { FAQEquipment } from './pages/settings/FAQEquipment';
import { AppSettings } from './pages/settings/AppSettings';
import { LanguageSettings } from './pages/settings/LanguageSettings';
import { LogoutScreen } from './pages/settings/LogoutScreen';
import { FeedbackRating } from './pages/settings/FeedbackRating';
import { AuthProvider } from './context/AuthContext';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PhoneFrame>
          <Routes>
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/splash" replace />} />

          {/* Auth */}
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/role" element={<RoleSelection />} />
          <Route path="/login" element={<PhoneLogin />} />
          <Route path="/otp" element={<OTPVerification />} />

          {/* Seeker Discovery */}
          <Route path="/seeker/home" element={<SeekerHome />} />
          <Route path="/seeker/category/:type" element={<CategoryListing />} />
          <Route path="/seeker/search" element={<SearchResults />} />
          <Route path="/seeker/search-map" element={<SearchResultsMap />} />
          <Route path="/seeker/filters" element={<AdvancedFilters />} />
          <Route path="/seeker/machine/:id" element={<MachineDetailRouter />} />
          <Route path="/seeker/owner/:id" element={<OwnerProfile />} />
          <Route path="/seeker/hubs" element={<NearbyHubs />} />

          {/* Seeker Booking */}
          <Route
            path="/seeker/availability"
            element={<AvailabilityCalendar />} />
          
          <Route path="/seeker/request" element={<RentalRequestForm />} />
          <Route path="/seeker/calculator" element={<DealHelperCalculator />} />
          <Route
            path="/seeker/calculator-results"
            element={<DealHelperResults />} />
          
          <Route
            path="/seeker/confirmation"
            element={<BookingConfirmation />} />
          
          <Route
            path="/seeker/active-rental"
            element={<ActiveRentalTracker />} />
          
          <Route path="/seeker/direct-connect" element={<DirectConnect />} />
          <Route path="/seeker/payment" element={<PaymentReceipt />} />
          <Route path="/seeker/extension" element={<ExtensionRequest />} />
          <Route path="/seeker/cancel" element={<CancellationFlow />} />

          {/* Provider */}
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/equipment" element={<MyEquipmentList />} />
          <Route path="/provider/add-machine/1" element={<AddMachineStep1 />} />
          <Route path="/provider/add-machine/2" element={<AddMachineStep2 />} />
          <Route path="/provider/add-machine/3" element={<AddMachineStep3 />} />
          <Route path="/provider/add-machine/4" element={<AddMachineStep4 />} />
          <Route path="/provider/edit-machine/:id" element={<EditMachine />} />
          <Route
            path="/provider/availability"
            element={<AvailabilityToggle />} />
          
          <Route path="/provider/requests" element={<IncomingRequests />} />
          <Route path="/provider/request/:id" element={<RequestDetail />} />
          <Route path="/provider/active-job" element={<ActiveJobMonitor />} />
          <Route path="/provider/completed" element={<CompletedJobs />} />
          <Route path="/provider/earnings" element={<EarningsReport />} />
          <Route path="/provider/maintenance" element={<MaintenanceLogger />} />
          <Route path="/provider/health" element={<EquipmentHealth />} />

          {/* Settings & Profile */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/badges" element={<SkillBadges />} />
          <Route path="/leaderboard" element={<VillageLeaderboard />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/help" element={<HelpSupport />} />
          <Route path="/faq" element={<FAQEquipment />} />
          <Route path="/settings" element={<AppSettings />} />
          <Route path="/language-settings" element={<LanguageSettings />} />
          <Route path="/logout" element={<LogoutScreen />} />
          <Route path="/feedback" element={<FeedbackRating />} />
        </Routes>
      </PhoneFrame>
      </AuthProvider>
    </BrowserRouter>);

}