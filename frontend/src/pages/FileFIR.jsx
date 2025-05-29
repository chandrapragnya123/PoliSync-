import { FileText, Send } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFIR } from '../utils/api'; // Import your API service
import "../styles/FileFIR.css";

const FileFIR = () => {
  const [showCrimeInfo, setShowCrimeInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    crimeType: [],
    incidentDate: '',
    incidentLocation: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        crimeType: checked 
          ? [...prev.crimeType, value]
          : prev.crimeType.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare FIR data for submission
      const firData = {
        complainant: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        crimeType: {
          mainCategory: formData.crimeType[0] || 'Other', // Take first selected or 'Other'
          subCategories: formData.crimeType
        },
        incidentDetails: {
          date: formData.incidentDate,
          location: formData.incidentLocation,
          description: formData.description
        }
      };

      // Call API endpoint
      const response = await createFIR(firData);
      
      // Redirect to success page or show confirmation
      navigate('/fir-confirmation', { 
        state: { firNumber: response.firNumber } 
      });
      
    } catch (err) {
      console.error('FIR submission error:', err);
      setError(err.response?.data?.error || 'Failed to submit FIR. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <form className="filefir-form" onSubmit={handleSubmit}>
          <h1 className="main-heading">
            <FileText size={28} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            File an FIR
          </h1>

          {error && <div className="error-message">{error}</div>}

          <h2 className="section-heading">Personal Information</h2>
          <label htmlFor="name">Full Name:</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name" 
            required 
          />

          <label htmlFor="email">Email Address:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address" 
            required 
          />

          <label htmlFor="phone">Phone Number:</label>
          <input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number" 
            required 
          />

          <label htmlFor="address">Address:</label>
          <textarea 
            id="address" 
            name="address" 
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your current address" 
            required
          ></textarea>

          <h2 className="section-heading">Type of Crime</h2>
          <button
            type="button"
            className="toggle-info-btn"
            onClick={() => setShowCrimeInfo(!showCrimeInfo)}
          >
            {showCrimeInfo ? '❌ Hide Crime Descriptions' : '❓ Not sure? Click to see crime descriptions'}
          </button>

          {showCrimeInfo && (
            <div className="crime-info-box">
              <p><strong>Theft:</strong> Unlawful taking of someone else's property.</p>
              <p><strong>Assault:</strong> Physical attack or threat of attack.</p>
              <p><strong>Fraud:</strong> Deceptive actions for financial gain.</p>
              <p><strong>Cybercrime:</strong> Illegal activities using computers or the internet.</p>
            </div>
          )}

          <div className="crime-type-checkboxes">
            {['theft', 'assault', 'fraud', 'cybercrime'].map((crime) => (
              <label key={crime}>
                <input 
                  type="checkbox" 
                  name="crimeType" 
                  value={crime}
                  checked={formData.crimeType.includes(crime)}
                  onChange={handleChange}
                /> 
                {crime.charAt(0).toUpperCase() + crime.slice(1)}
              </label>
            ))}
          </div>

          <h2 className="section-heading">Incident Details</h2>
          <label htmlFor="incidentDate">Date of Incident:</label>
          <input 
            type="date" 
            id="incidentDate" 
            name="incidentDate" 
            value={formData.incidentDate}
            onChange={handleChange}
            required 
          />

          <label htmlFor="incidentLocation">Location of Incident:</label>
          <input 
            type="text" 
            id="incidentLocation" 
            name="incidentLocation" 
            value={formData.incidentLocation}
            onChange={handleChange}
            placeholder="Enter the location of the incident" 
            required 
          />

          <label htmlFor="description">Description of Incident:</label>
          <textarea 
            id="description" 
            name="description" 
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the incident in detail" 
            required
          ></textarea>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            <Send size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {isSubmitting ? 'Submitting...' : 'Submit FIR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileFIR;