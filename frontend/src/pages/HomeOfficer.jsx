import { useEffect, useState } from 'react';
import { FaRobot } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { clearRole } from '../utils/auth';
import '../styles/common.css';

const HomeOfficer = () => {
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => setUser(localStorage.getItem('loggedInUser') || 'Officer'), []);

  const handleLogout = () => {
    clearRole();
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <Header />

      {/* Hero */}
      <section className="hero">
        <h1>Report, Track, Stay Safe – For a Safer Tomorrow</h1>
        <p>Safeguarding Together: Your Bridge to a Secure Environment</p>

        <div className="features">
          <Link to="/view-dashboard"><button>View Dashboard</button></Link>
          <Link to="/view-fir"><button>View FIR</button></Link>
          <Link to="/manage-complaints"><button>Manage Complaints</button></Link>
          <Link to="/respond-to-reports"><button>Respond to Reports</button></Link>
        </div>
      </section>

      {/* Chatbot FAB */}
      <div className="chatbot-fab"><FaRobot size={24} /></div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default HomeOfficer;
