// src/pages/Signup.jsx
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

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;
    if (!name || !email || !password)
      return handleError('All fields are required');

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Signup failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('loggedInUser', form.name);

      handleSuccess(`${roles[role]} account created!`);
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
          <input type="text" name="name" value={form.name} onChange={onChange} required />
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} required />
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={onChange} required />
          <button type="submit">Signup</button>
          <span>Already have an account? <Link to="/login">Login</Link></span>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
