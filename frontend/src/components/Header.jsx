import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { clearRole, getRole, ROLES } from '../utils/auth';

const Header = () => {
  const [role, setRole] = useState(getRole());
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setRole(getRole());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    clearRole();
    setRole(ROLES.NONE);
    navigate('/');
  };

  const navButtonStyle = {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '8px 16px',
    marginRight: '12px',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const commonLinks = (
    <>
      <li><button onClick={() => navigate('/')} style={navButtonStyle}>Home</button></li>
      <li><button onClick={() => navigate('/about')} style={navButtonStyle}>About Us</button></li>
    </>
  );

  let extraLinks;
  if (role === ROLES.CITIZEN)
    extraLinks = (
      <>
        <li><Link to="/my-complaints" style={navButtonStyle}>My Complaints</Link></li>
        <li><Link to="/file-fir" style={navButtonStyle}>Request FIR</Link></li>
      </>
    );
  else if (role === ROLES.OFFICER)
    extraLinks = (
      <>
        <li><Link to="/view-crime-dashboard" style={navButtonStyle}>Dashboard</Link></li>
        <li><Link to="/view-fir" style={navButtonStyle}>FIR's</Link></li>
        <li><Link to="/manage-complaints" style={navButtonStyle}>Complaints</Link></li>
      </>
    );

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
