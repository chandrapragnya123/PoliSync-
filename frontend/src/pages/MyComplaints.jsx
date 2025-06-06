import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyComplaints.css'; // Ensure you have a CSS file for styling
const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('/api/firs/my', { withCredentials: true });
        setComplaints(response.data);
      } catch (err) {
        console.error('Error fetching complaints:', err);
        alert(err.response?.data?.message || 'Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <p>Loading complaints...</p>;
  if (complaints.length === 0) return <p>No complaints found.</p>;

  return (
    <div className="complaints-container">
      <h2>Your Complaints</h2>
      {complaints.map((complaint) => (
        <div key={complaint._id} className="complaint-card">
          <p><strong>Crime Type:</strong> {complaint.crimeType?.mainCategory}</p>
            <p><strong>Subcategories:</strong> {complaint.crimeType?.subCategories?.join(', ')}</p>
            <p><strong>Date:</strong> {new Date(complaint.incidentDetails?.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {complaint.incidentDetails?.location?.address}</p>
            <p><strong>Description:</strong> {complaint.incidentDetails?.description}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
        </div>
      ))}
    </div>
  );
};

export default MyComplaints;
