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
    address: '',
    crimeType: [],
    incidentDate: '',
    incidentLocation: '',
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

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('incidentDate', formData.incidentDate);
    data.append('incidentLocation', formData.incidentLocation);
    data.append('description', formData.description);
    formData.crimeType.forEach((type) => data.append('crimeTypes', type));
    if (formData.evidence) data.append('evidence', formData.evidence);

    try {
      const response = await fetch('http://localhost:5000/api/complaints/file', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        navigate('/fir-confirmation', { state: { firNumber: result.firNumber || 'N/A' } });
      } else {
        throw new Error(result.message || 'Submission failed.');
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
        <form className="filefir-form" onSubmit={handleSubmit}>
          <h1 className="main-heading">
            <FileText size={28} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            File an FIR
          </h1>

          {error && <div className="error-message">{error}</div>}

          <h2 className="section-heading">Personal Information</h2>
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" />

          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email address" />

          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter your phone number" />

          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Enter your current address"></textarea>

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
          <input type="date" id="incidentDate" name="incidentDate" value={formData.incidentDate} onChange={handleChange} required />

          <label htmlFor="incidentLocation">Location of Incident:</label>
          <input type="text" id="incidentLocation" name="incidentLocation" value={formData.incidentLocation} onChange={handleChange} required placeholder="Enter the location of the incident" />

          <label htmlFor="description">Description of Incident:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} required placeholder="Describe the incident in detail"></textarea>

          <h2 className="section-heading">Upload Evidence</h2>
          <label htmlFor="evidence">Upload Evidence File:</label>
          <input type="file" name="evidence" accept=".png,.jpg,.jpeg,.pdf,.doc,.docx" onChange={handleChange} />

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
