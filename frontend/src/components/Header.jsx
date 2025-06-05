// components/Header.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { clearRole, getRole, ROLES } from '../utils/auth';

const Header = () => {
  const [role, setRole] = useState(getRole());
  const navigate = useNavigate();

  useEffect(() => {
    // re‑render when role changes in another tab
    const onStorage = () => setRole(getRole());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    clearRole();
    setRole(ROLES.NONE);
    navigate('/');
  };

  /* ---------- menus per role ---------- */
  const commonLinks = (
    <>
      <li><button onClick={() => navigate('/')} className="nav-btn">Home</button></li>
      <li><button onClick={() => navigate('/about')} className="nav-btn">About Us</button></li>
    </>
  );

  let extraLinks;
  if (role === ROLES.CITIZEN)
    extraLinks = (
      <>
        <li><Link to="/my-complaints">My Complaints</Link></li>
        <li><Link to="/file-fir">Request FIR</Link></li>
      </>
    );
  else if (role === ROLES.POLICE)
    extraLinks = (
      <>
        <li><Link to="/view-crime-dashboard">Dashboard</Link></li>
        <li><Link to="/view-fir">FIR's</Link></li>
        <li><Link to="/manage-complaints">Complaints</Link></li>
      </>
    );

  /* ---------- auth buttons ---------- */
  const authArea =
    role === ROLES.NONE ? (
      <>
        <Link to="/login"><button className="login-btn">Login</button></Link>
        <Link to="/signup"><button className="register-btn">Register</button></Link>
      </>
    ) : (
      <>
        <span style={{ color: '#fff', marginRight: '1rem' }}>Hi, {role}</span>
        <button className="login-btn" onClick={logout}>Logout</button>
      </>
    );

  return (
    <header className="navbar">
      <div className="logo-section" onClick={() => navigate('/')}>
        <img src={logo} alt="Crime Portal Logo" className="logo-icon" />
        <span className="logo-text">Crime Portal</span>
      </div>

      <nav>
        <ul className="nav-links">
          {commonLinks}
          {extraLinks}
        </ul>
      </nav>

      <div className="auth-buttons">{authArea}</div>
    </header>
  );
};

export default Header;
