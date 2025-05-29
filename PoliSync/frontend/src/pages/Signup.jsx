import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import logo from '../assets/logo.png';
import '../styles/Login.css';

const roles = { citizen: 'Citizen', officer: 'Officer' };

const Signup = () => {
  const [role, setRole] = useState('citizen');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    const { name, email, password } = form;
    if (!name || !email || !password) return handleError('All fields are required');

    handleSuccess(`${roles[role]} account created!`);
    /* mimic login right away */
    localStorage.setItem('loggedInUser', name);
    localStorage.setItem('role', role);
    setTimeout(() => navigate(role === 'citizen' ? '/homeCitizen' : '/homeOfficer'), 800);
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
          <h1>{roles[role]} Signup</h1>

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={onChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={form.password}
            onChange={onChange}
            required
          />

          <button type="submit">Signup</button>

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>

      </div>

      <ToastContainer />
    </div>
  );
};

export default Signup;
