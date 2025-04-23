import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/common.css';

const LandingPage = () => (
  <div className="home-container">
    <Header />
    <section className="hero">
      <h1>Report, Track, Stay Safe – For a Safer Tomorrow</h1>
      <p>Safeguarding Together: Your Bridge to a Secure Environment</p>
    </section>
    <Footer />
  </div>
);
export default LandingPage;
