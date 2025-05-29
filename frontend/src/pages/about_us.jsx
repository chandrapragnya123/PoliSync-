import AOS from 'aos';
import 'aos/dist/aos.css';
import { AlertTriangle, BarChart2, BellRing, Download, File, Folder, Image, MapPin, MessageCircle, PieChart, Search, TrendingUp, User, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import '../styles/about_us.css'; // Importing the CSS

const AboutUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  const [popupFeature, setPopupFeature] = useState(null);

  const features = [
    {
      title: 'Crime Reporting Form',
      description:
        'Our crime reporting form allows users to quickly and easily submit their complaints with important details like type of crime, time, and location. This ensures that the authorities can respond swiftly and effectively to each situation. After submitting, users can choose to receive copies of their reports for their records.',
      icon: <File size={24} />, // Using imported icons
      color: 'blue',
    },
    {
      title: 'Media Upload',
      description:
        'Users can attach various types of media to their reports, including images, video clips, or audio recordings that may serve as evidence. This feature enhances the credibility of the reported incidents and helps law enforcement agencies in their investigations.',
      icon: <Image size={24} />, // Using imported icons
      color: 'purple',
    },
    {
      title: 'Geolocation Support',
      description:
        'Our platform automatically retrieves and attaches the user\'s current location using geolocation support. This feature allows faster response times from the authorities and ensures accurate data is collected, especially in emergency situations.',
      icon: <MapPin size={24} />, // Using imported icons
      color: 'green',
    },
    {
      title: '24/7 AI Chatbot (PoliSync Assistant)',
      description:
        'The PoliSync Assistant is an AI-powered chatbot available at all hours to help guide users in reporting crimes. Whether through text or voice, it assists users in navigating the reporting process, finding relevant information, and connecting to emergency contacts as needed.',
      icon: <MessageCircle size={24} />, // Using imported icons
      color: 'cyan',
    },
    {
      title: 'Case Tracking',
      description:
        'Users can track the status of their reports, receiving timely updates and alerts regarding their cases. This feature allows for greater transparency and keeps the user informed about the progress surrounding their submitted reports.',
      icon: <Search size={24} />, // Using imported icons
      color: 'orange',
    },
    {
      title: 'Emergency Help Access',
      description:
        'Our app provides quick-access buttons for SOS alerts or emergency hotlines, allowing users to contact authorities instantly in threatening situations. This feature is key to ensuring user safety, offering peace of mind to the public.',
      icon: <AlertTriangle size={24} />, // Using imported icons
      color: 'red',
    },
    {
      title: 'Dashboard for Officers',
      description:
        'The dashboard gives law enforcement officers a real-time overview of incoming reports, allowing for resource allocation and management of cases effectively. This leads to better responsiveness and can greatly enhance community safety.',
      icon: <BarChart2 size={24} />, // Using imported icons
      color: 'blue',
    },
    {
      title: 'Case Assignment and Tracking',
      description:
        'Officers can assign individual cases to specific team members, set statuses such as pending or in progress, and add notes for team coordination. This organizational tool is critical in ensuring every case receives the attention it deserves.',
      icon: <Users size={24} />, // Using imported icons
      color: 'indigo',
    },
    {
      title: 'Evidence Management',
      description:
        'The platform allows officers to view, organize, and manage uploaded media and documents tied to each case. This can facilitate the review process and ensure that all evidence is readily available for investigations.',
      icon: <Folder size={24} />, // Using imported icons
      color: 'amber',
    },
    {
      title: 'Notification System',
      description:
        'We provide a robust notification system that alerts officers for high-priority or emergency cases, ensuring that the critical incidents are addressed immediately and effectively.',
      icon: <BellRing size={24} />, // Using imported icons
      color: 'pink',
    },
    {
      title: 'User Management',
      description:
        'Administrative controls allow for user management where access levels can be adjusted for citizens, officers, and administrators. This ensures that information is adequately protected while being effectively utilized.',
      icon: <User size={24} />, // Using imported icons
      color: 'purple',
    },
    {
      title: 'Analytics Dashboard',
      description:
        'Our analytics dashboard provides charts, trends, and heatmaps for various crime types, locations, and response times, aiding in strategic planning and community safety initiatives.',
      icon: <PieChart size={24} />, // Using imported icons
      color: 'emerald',
    },
    {
      title: 'Predictive Crime Analysis (AI)',
      description:
        'Using AI and machine learning, we highlight high-risk zones based on past crime patterns, assisting law enforcement in prevention strategies, resource allocation, and proactive approaches to policing.',
      icon: <TrendingUp size={24} />, // Using imported icons
      color: 'cyan',
    },
    {
      title: 'Data Export',
      description:
        'Generate comprehensive reports in PDF or CSV format that include cases and relevant statistics, allowing law enforcement and administrative staff to analyze data effectively and make informed decisions.',
      icon: <Download size={24} />, // Using imported icons
      color: 'teal',
    },
  ];

  const openPopup = (title) => {
    setPopupFeature(title);
  };

  const closePopup = () => {
    setPopupFeature(null);
  };

  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content" data-aos="zoom-in">
          <h1>
            About <span className="text-gradient">PoliSync</span>
          </h1>
          <p>
            Empowering citizens and supporting justice with modern crime
            reporting solutions.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <div className="features-intro">
        <h2 data-aos="fade-up">Our Features</h2>
        <p data-aos="fade-up" data-aos-delay="200">
          Discover the powerful tools and capabilities that make PoliSync the
          leading platform for crime reporting and law enforcement coordination.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`feature feature-${feature.color}`}  // Correct dynamic class
            data-aos="fade-up"
            data-aos-delay={100 * (index % 3)}
            onClick={() => openPopup(feature.title)}
          >
            <div className="feature-icon">
              <span className={`icon-bg icon-${feature.color}`}></span>  {/* Correct dynamic class */}
              {feature.icon} {/* Directly render the icon component */}
            </div>
            <h3>{feature.title}</h3>
            <p className="feature-preview">{feature.description.substring(0, 80)}...</p>
            <button className="read-more">Learn More</button>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {popupFeature && (
        <div className="feature-popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-popup" onClick={closePopup}>
              <X size={24} />
            </button>
            {features
              .filter((f) => f.title === popupFeature)
              .map((feature, index) => (
                <div key={index} className="popup-feature">
                  <div className={`popup-icon icon-${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutUs;
