import { FileText, Send } from 'lucide-react';
import React, { useState } from 'react';
import "../styles/FileFIR.css"; // Import your CSS file for styling

const FileFIR = () => {
  const [showCrimeInfo, setShowCrimeInfo] = useState(false);

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="filefir-form">
          <h1 className="main-heading">
            <FileText size={28} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            File an FIR
          </h1>

          <h2 className="section-heading">Personal Information</h2>
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" placeholder="Enter your full name" required />

          <label htmlFor="email">Email Address:</label>
          <input type="email" id="email" name="email" placeholder="Enter your email address" required />

          <label htmlFor="phone">Phone Number:</label>
          <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />

          <label htmlFor="address">Address:</label>
          <textarea id="address" name="address" placeholder="Enter your current address" required></textarea>

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
              <input type="checkbox" name="crimeType" value="theft" /> Theft
            </label>
            <label>
              <input type="checkbox" name="crimeType" value="assault" /> Assault
            </label>
            <label>
              <input type="checkbox" name="crimeType" value="fraud" /> Fraud
            </label>
            <label>
              <input type="checkbox" name="crimeType" value="cybercrime" /> Cybercrime
            </label>
          </div>

          <h2 className="section-heading">Incident Details</h2>
          <label htmlFor="incidentDate">Date of Incident:</label>
          <input type="date" id="incidentDate" name="incidentDate" required />

          <label htmlFor="incidentLocation">Location of Incident:</label>
          <input type="text" id="incidentLocation" name="incidentLocation" placeholder="Enter the location of the incident" required />

          <label htmlFor="description">Description of Incident:</label>
          <textarea id="description" name="description" placeholder="Describe the incident in detail" required></textarea>

          <button type="submit" className="submit-btn">
            <Send size={18} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Submit FIR
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileFIR;
