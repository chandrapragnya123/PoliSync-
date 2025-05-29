import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeCitizen from './pages/HomeCitizen';
import HomeOfficer from './pages/HomeOfficer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import FileFIR from './pages/FileFIR';
import RequireAuth from './components/RequireAuth'; // or the correct path
import FIRConfirmation from './pages/FIRconfirmationPage'; // Ensure this matches the exact casing of the file: FIRconfirmationPage.jsx

import Header from './components/Header';
import Footer from './components/Footer';
import ViewCrimeDashboard from './pages/ViewCrimeDashboard';
import ManageComplaints from './pages/ManageComplaints';
import Signup from './pages/Signup';
import ViewCrimeDashboard from './pages/ViewCrimeDashboard';
import ViewFIR from './pages/ViewFIR';
import AboutUs from './pages/about_us';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homeCitizen" element={<HomeCitizen />} />
      <Route path="/homeOfficer" element={<HomeOfficer />} />
      <Route path="/file-fir" element={<FileFIR />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/view-fir" element={<ViewFIR />} />
<<<<<<< HEAD
      <Route path="/view-crime-dashboard" element={<ViewCrimeDashboard/>} />
      <Route path="/manage-complaints" element={<ManageComplaints/>} />
      <Route path="/fir-confirmation" element={<RequireAuth role="citizen"><FIRConfirmation /></RequireAuth>} 
/>

      {/* ...other routes */}
=======
      <Route path="/view-crime-dashboard" element={<ViewCrimeDashboard />} />
      <Route path="/manage-complaints" element={<ManageComplaints />} />
      <Route path="/about" element={<AboutUs />} /> {/* ✅ Added AboutUs route */}
>>>>>>> c001cefcb4e11471b584854c49df176f9efd2638
    </Routes>
  </BrowserRouter>
);

export default App;
