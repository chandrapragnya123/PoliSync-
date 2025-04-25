import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import LandingPage from './pages/LandingPage';
import HomeCitizen from './pages/HomeCitizen';
import HomeOfficer from './pages/HomeOfficer';
import Login from './pages/Login';
import FileFIR from './pages/FileFIR';
import Signup from './pages/Signup';
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => (
  <BrowserRouter>
  
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homeCitizen" element={<HomeCitizen />} />
      <Route path="/homeOfficer" element={<HomeOfficer />} />
      <Route path="/file-fir" element={<FileFIR />} />
      <Route path="/signup" element={<Signup />} />
      {/* ...other routes */}
    </Routes>
  </BrowserRouter>
);
export default App;
