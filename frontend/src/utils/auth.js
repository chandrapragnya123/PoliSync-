// utils/auth.js
export const ROLES = {
    NONE: 'none',
    CITIZEN: 'citizen',
    OFFICER: 'officer',
  };
  
  export const setRole = role => localStorage.setItem('role', role);
  export const getRole = () => localStorage.getItem('role') || ROLES.NONE;
  export const clearRole = () => localStorage.removeItem('role');
  