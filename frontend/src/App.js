import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ✅ Add this

import HomeCitizen from './pages/HomeCitizen';
import HomeOfficer from './pages/HomeOfficer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import FileFIR from './pages/FileFIR';
import RequireAuth from './components/RequireAuth';
import FIRConfirmation from './pages/FIRConfirmationPage';

import Header from './components/Header';
import Footer from './components/Footer';
import ViewCrimeDashboard from './pages/ViewCrimeDashboard';
import ManageComplaints from './pages/ManageComplaints';
import Signup from './pages/Signup';
import ViewFIR from './pages/ViewFIR';
import AboutUs from './pages/about_us';

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
        <Route path="/view-crime-dashboard" element={<ViewCrimeDashboard />} />
        <Route path="/manage-complaints" element={<ManageComplaints />} />
        <Route path="/about" element={<AboutUs />} />
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
