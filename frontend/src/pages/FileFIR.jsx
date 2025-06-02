import { FileText, Send } from 'lucide-react';
import { useState } from 'react';
import "../styles/FileFIR.css";

const FileFIR = () => {
  const [showCrimeInfo, setShowCrimeInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    crimeTypes: [],
    incidentDate: '',
    incidentLocation: '',
    description: '',
    evidence: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newCrimeTypes = checked
        ? [...prev.crimeTypes, value]
        : prev.crimeTypes.filter(type => type !== value);
      return { ...prev, crimeTypes: newCrimeTypes };
    });
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, evidence: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();

  for (const key in formData) {
    if (key === 'crimeTypes') {
      formData.crimeTypes.forEach(type => data.append('crimeTypes', type));
    } else {
      data.append(key, formData[key]);
    }
  }

  try {
    const response = await fetch('http://localhost:5000/api/complaints/file', {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    alert(result.message || "FIR submitted.");
  } catch (err) {
    console.error("Error submitting FIR:", err);
    alert("Submission failed.");
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

          <h2 className="section-heading">Personal Information</h2>
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} required />

          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email address" value={formData.email} onChange={handleInputChange} required />

          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={handleInputChange} required />

          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" placeholder="Enter your current address" value={formData.address} onChange={handleInputChange} required></textarea>

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
            <label>
              <input type="checkbox" name="crimeType" value="theft" onChange={handleCheckboxChange} />
              Theft
            </label>
            <label>
              <input type="checkbox" name="crimeType" value="assault" onChange={handleCheckboxChange} />
              Assault
            </label>
            <label>
              <input type="checkbox" name="crimeType" value="fraud" onChange={handleCheckboxChange} />
              Fraud
            </label>
            <label>
              <input type="checkbox" name="crimeType" value="cybercrime" onChange={handleCheckboxChange} />
              Cybercrime
            </label>
          </div>

          <h2 className="section-heading">Incident Details</h2>
          <label htmlFor="incidentDate">Date of Incident:</label>
          <input type="date" id="incidentDate" name="incidentDate" value={formData.incidentDate} onChange={handleInputChange} required />

          <label htmlFor="incidentLocation">Location of Incident:</label>
          <input type="text" id="incidentLocation" name="incidentLocation" placeholder="Enter the location of the incident" value={formData.incidentLocation} onChange={handleInputChange} required />

          <label htmlFor="description">Description of Incident:</label>
          <textarea id="description" name="description" placeholder="Describe the incident in detail" value={formData.description} onChange={handleInputChange} required></textarea>

          <h2 className="section-heading">Upload Evidence</h2>
          <label>Upload Evidence File:</label>
          <input type="file" name="evidence" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf,.doc,.docx" />

          <button type="submit" className="submit-btn">
            <Send size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Submit FIR
          </button>
        </form>
      </div>
    </div>
  );
};
export default FileFIR;