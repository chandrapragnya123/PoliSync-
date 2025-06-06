// utils/auth.js
export const ROLES = {
    NONE: 'none',
    CITIZEN: 'citizen',
    OFFICER: 'officer',
  };
  
export async function registerUser(name, email, password) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ name, email, password })
  });

  const data = await response.json();
  return data;
}


  export const setRole = role => localStorage.setItem('role', role);
  export const getRole = () => localStorage.getItem('role') || ROLES.NONE;
  export const clearRole = () => localStorage.removeItem('role');
  