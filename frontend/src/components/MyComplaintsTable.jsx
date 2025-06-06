import React, { useEffect, useState } from 'react';
import '../styles/FIRTable.css'; // Reuses FIRTable styles

export default function MyComplaintsTable() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = () => {
        setLoading(true);
        fetch('/api/firs/my')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch complaints');
                return res.json();
            })
            .then((data) => {
                setComplaints(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    const filteredComplaints = filterStatus === 'All'
        ? complaints
        : complaints.filter(c => c.status === filterStatus);

    if (loading) return <p>Loading complaints...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="fir-table-container">
            <h2>My Complaints</h2>

            <div className="status-filter-container">
                <label htmlFor="statusFilter">Filter by Status:</label>
                <select
                    id="statusFilter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="status-filter-select"
                >
                    <option value="All">All</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Accepted">Accepted</option>

                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Crime Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredComplaints.map((complaint, idx) => (
                        <tr
                            key={complaint._id}
                            onClick={() => setSelectedComplaint(complaint)}
                            className={selectedComplaint?._id === complaint._id ? 'clicked' : ''}
                        >
                            <td>{idx + 1}</td>
                            <td>{complaint.complainant?.fullName}</td>
                            <td>{complaint.incidentDetails?.description}</td>
                            <td>{new Date(complaint.incidentDetails?.date).toLocaleDateString()}</td>
                            <td>{complaint.crimeType?.mainCategory}</td>
                            <td>{complaint.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedComplaint && (
                <div className="fir-modal" style={modalStyle}>
                    <div style={modalBoxStyle}>
                        <h3>Complaint Details</h3>

                        <section>
                            <p><strong>Complainant Name:</strong> {selectedComplaint.complainant?.fullName}</p>
                            <p><strong>Description:</strong> {selectedComplaint.incidentDetails?.description}</p>
                            <p><strong>Category:</strong> {selectedComplaint.crimeType?.mainCategory || '-'}</p>
                            {selectedComplaint.crimeType?.subCategories?.length > 0 && (
                                <p><strong>Sub Categories:</strong> {selectedComplaint.crimeType.subCategories.join(', ')}</p>
                            )}
                            {selectedComplaint.crimeType?.customDescription && (
                                <p><strong>Other Description:</strong> {selectedComplaint.crimeType.customDescription}</p>
                            )}
                            <p><strong>Status:</strong> {selectedComplaint.status}</p>
                            {selectedComplaint.rejectionReason && (
                                <p><strong>Rejection Reason:</strong> {selectedComplaint.rejectionReason}</p>
                            )}
                            <p><strong>Date:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                            {selectedComplaint.response && (
                                <p><strong>Response:</strong> {selectedComplaint.response}</p>
                            )}
                        </section>

                        <section>
                            <h4>Incident Details</h4>
                            <p>
                                <strong>Location:</strong>{' '}
                                {[selectedComplaint.incidentDetails?.location?.address, selectedComplaint.incidentDetails?.location?.landmark]
                                    .filter(Boolean)
                                    .join(', ') || '-'}
                            </p>
                            {selectedComplaint.incidentDetails?.location?.gpsCoordinates && (
                                <p>
                                    <strong>GPS:</strong>{' '}
                                    Lat {selectedComplaint.incidentDetails.location.gpsCoordinates.lat}, 
                                    Lng {selectedComplaint.incidentDetails.location.gpsCoordinates.lng}
                                </p>
                            )}
                        </section>

                        <section>
                            <h4>Evidence</h4>
                            {selectedComplaint.incidentDetails?.evidence?.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {selectedComplaint.incidentDetails.evidence.map((file, i) => {
                                        const isImage = file.type === 'image';
                                        return (
                                            <div key={i} style={{ maxWidth: 150, textAlign: 'center' }}>
                                                {isImage ? (
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={file.url}
                                                            alt={file.description || 'Evidence'}
                                                            style={{ width: '100%', borderRadius: 5 }}
                                                        />
                                                    </a>
                                                ) : (
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        {file.description || 'Download File'}
                                                    </a>
                                                )}
                                                <p style={{ fontSize: 12, color: '#555' }}>{file.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>No evidence uploaded.</p>
                            )}
                        </section>

                        <button onClick={() => setSelectedComplaint(null)} style={closeBtnStyle}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline styles
const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalBoxStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
};

const closeBtnStyle = {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#1B263B',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
};
