import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send } from 'lucide-react';
import '../styles/FileFIR.css';

const FileFIR = () => {
  const navigate = useNavigate();
  const [showCrimeInfo, setShowCrimeInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    crimeType: [],
    incidentDate: '',
    incidentLocation: {
      address: '',
      landmark: '',
      gpsCoordinates: { lat: '', lng: '' },
    },
    description: '',
    evidence: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        crimeType: checked
          ? [...prev.crimeType, value]
          : prev.crimeType.filter((item) => item !== value),
      }));
    } else if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        evidence: files[0],
      }));
    } else if (name.includes('.')) {
      // Handle nested object keys like address.street or incidentLocation.address
      const keys = name.split('.');
      setFormData((prev) => {
        let obj = { ...prev };
        let temp = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          temp[keys[i]] = { ...temp[keys[i]] };
          temp = temp[keys[i]];
        }
        temp[keys[keys.length - 1]] = value;
        return obj;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = new FormData();

      const complainant = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address,
      };

      const crimeType = {
        mainCategory: formData.crimeType.length
          ? formData.crimeType[0].charAt(0).toUpperCase() + formData.crimeType[0].slice(1)
          : '',
      };

      const incidentDetails = {
        date: formData.incidentDate,
        location: formData.incidentLocation,
        description: formData.description,
      };

      data.append('complainant', JSON.stringify(complainant));
      data.append('crimeType', JSON.stringify(crimeType));
      data.append('incidentDetails', JSON.stringify(incidentDetails));

      if (formData.evidence) {
        data.append('evidenceFiles', formData.evidence);
      }

      const token = localStorage.getItem('token');
      if (!token) throw new Error('User not authenticated');

      const response = await fetch('http://localhost:5000/api/firs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/fir-confirmation', { state: { firNumber: result.firNumber || 'N/A' } });
      } else {
        throw new Error(result.error || 'Submission failed.');
      }
    } catch (err) {
      console.error('Error submitting FIR:', err);
      setError(err.message || 'Failed to submit FIR. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <form className="filefir-form" onSubmit={handleSubmit} encType="multipart/form-data">
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
            required
            placeholder="Enter your full name"
          />

          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
          />

          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your phone number"
          />

          <h3>Address Details</h3>
          <label>Street:</label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            required
            placeholder="Street address"
          />

          <label>City:</label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            required
            placeholder="City"
          />

          <label>State:</label>
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            required
            placeholder="State"
          />

          <label>Postal Code:</label>
          <input
            type="text"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChange={handleChange}
            required
            placeholder="Postal Code"
          />

          <label>Country:</label>
          <input
            type="text"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            required
            placeholder="Country"
          />

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

          <label>Incident Location Address:</label>
          <input
            type="text"
            name="incidentLocation.address"
            value={formData.incidentLocation.address}
            onChange={handleChange}
            required
            placeholder="Location of the incident"
          />

          <label>Landmark:</label>
          <input
            type="text"
            name="incidentLocation.landmark"
            value={formData.incidentLocation.landmark}
            onChange={handleChange}
            placeholder="Landmark near incident location"
          />

          <h3>GPS Coordinates (Optional)</h3>
          <label>Latitude:</label>
          <input
            type="text"
            name="incidentLocation.gpsCoordinates.lat"
            value={formData.incidentLocation.gpsCoordinates.lat}
            onChange={handleChange}
            placeholder="Latitude"
          />

          <label>Longitude:</label>
          <input
            type="text"
            name="incidentLocation.gpsCoordinates.lng"
            value={formData.incidentLocation.gpsCoordinates.lng}
            onChange={handleChange}
            placeholder="Longitude"
          />

          <label htmlFor="description">Description of Incident:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe the incident in detail"
          ></textarea>

          <h2 className="section-heading">Upload Evidence</h2>
          <label htmlFor="evidence">Upload Evidence File:</label>
          <input
            type="file"
            name="evidence"
            accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            <Send size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            {isSubmitting ? 'Submitting...' : 'Submit FIR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FileFIR;
