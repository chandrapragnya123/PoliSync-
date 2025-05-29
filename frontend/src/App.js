import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FileFIR from './pages/FileFIR';
import HomeCitizen from './pages/HomeCitizen';
import HomeOfficer from './pages/HomeOfficer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
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
      <Route path="/view-crime-dashboard" element={<ViewCrimeDashboard />} />
      <Route path="/manage-complaints" element={<ManageComplaints />} />
      <Route path="/about" element={<AboutUs />} /> {/* ✅ Added AboutUs route */}
    </Routes>
  </BrowserRouter>
);

export default App;
