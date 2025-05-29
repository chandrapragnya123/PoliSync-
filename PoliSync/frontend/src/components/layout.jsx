// components/Layout.jsx
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import '../styles/common.css';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="page-bg-wrapper">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
