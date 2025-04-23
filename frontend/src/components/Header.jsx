// components/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { getRole, clearRole, ROLES } from '../utils/auth';
import logo from '../assets/logo.png';
import { useEffect, useState } from 'react';

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
      <li><a href="/">Home</a></li>
      <li><a href="/">About Us</a></li>
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
  else if (role === ROLES.OFFICER)
    extraLinks = (
      <>
        <li><Link to="/view-dashboard">Dashboard</Link></li>
        <li><Link to="/view-fir">Complaints</Link></li>
        <li><Link to="/respond-to-reports">Respond</Link></li>
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
      <div className="logo-section">
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
