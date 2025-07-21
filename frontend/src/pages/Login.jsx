import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import logo from '../assets/logo.png';
import '../styles/Login.css';
import { handleError, handleSuccess } from '../utils';

const roles = { citizen: 'Citizen', officer: 'officer' };

const Login = () => {
  const [role, setRole] = useState('citizen'); // toggle state
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const { email, password } = form;
    if (!email || !password) return handleError('Email and password are required');

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await res.json();
      const token = data.token;

      // Store token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('loggedInUser', roles[role]);

      handleSuccess(`${roles[role]} logged in successfully!`);

      setTimeout(() => navigate(role === 'citizen' ? '/homeCitizen' : '/homeOfficer'), 800);

    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="image-side" />
      <div className="form-side">
        <img className="logo" src={logo} alt="Crime Portal Logo" />

        {/* role switcher */}
        <div className="role-switch">
          {Object.entries(roles).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={role === key ? 'active' : ''}
              onClick={() => setRole(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit}>
          <h1>{roles[role]} Login</h1>

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email..."
            value={form.email}
            onChange={onChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password..."
            value={form.password}
            onChange={onChange}
            required
          />

          <button type="submit">Login</button>

          <span>
            Don&apos;t have an account? <Link to="/signup">Signup</Link>
          </span>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
