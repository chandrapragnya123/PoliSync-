import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ✅ Add this

import RequireAuth from './components/RequireAuth';
import FileFIR from './pages/FileFIR';
import FIRConfirmation from './pages/FIRConfirmationPage';
import HomeCitizen from './pages/HomeCitizen';
import HomeOfficer from './pages/HomeOfficer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import MyComplaints from './pages/MyComplaints';

import AboutUs from './pages/about_us';
import Dashboard from './pages/Dashboard';
import ManageComplaints from './pages/ManageComplaints';
import Signup from './pages/Signup';
import ViewComplaints from './pages/ViewComplaints';
import ViewCrimeDashboard from './pages/ViewCrimeDashboard';
import ViewFIR from './pages/ViewFIR';
const App = () => (
  <AuthProvider> {/* ✅ Wrap your entire app with AuthProvider */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homeCitizen" element={<HomeCitizen />} />
        <Route path="/homeOfficer" element={<HomeOfficer />} />
        <Route path="/file-fir" element={<FileFIR />} />
        <Route path="/view-fir" element={<ViewFIR />} />
        <Route path="/my-complaints" element={<ViewComplaints />} />
        <Route path="/view-crime-dashboard" element={<ViewCrimeDashboard />} />
        <Route path="/my-complaints" element={<RequireAuth role="citizen"><MyComplaints /></RequireAuth>} />
        <Route path="/manage-complaints" element={<ManageComplaints />} />
        <Route path="/about" element={<AboutUs />} />
        <Route
    path="/dashboard"
    element={
      
        <Dashboard />
      
    }
  />
        <Route
          path="/fir-confirmation"
          element={
            <RequireAuth role="citizen">
              <FIRConfirmation />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
