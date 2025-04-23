import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomeCitizen from './pages/HomeCitizen';
import HomeOfficer from './pages/HomeOfficer';
import Login from './pages/Login';
import FileFIR from './pages/FileFIR';
import Signup from './pages/Signup';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/homeCitizen" element={<HomeCitizen />} />
      <Route path="/homeOfficer" element={<HomeOfficer />} />
      <Route path="/file-fir" element={<FileFIR />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* ...other routes */}
    </Routes>
  </BrowserRouter>
);
export default App;
