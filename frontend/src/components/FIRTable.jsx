import React, { useEffect, useState } from 'react';
import '../styles/FIRTable.css';

export default function FIRTable() {
    const [firs, setFirs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFir, setSelectedFir] = useState(null);

    useEffect(() => {
        fetch('/api/firs', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((data) => {
                setFirs(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const fetchFirDetail = async (firId) => {
        try {
            const res = await fetch(`/api/firs/${firId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch FIR detail');
            const data = await res.json();
            setSelectedFir(data);
        } catch (err) {
            alert('Error loading FIR detail: ' + err.message);
        }
    };

    if (loading) return <p>Loading FIRs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="fir-table-container">
            <h2>FIR Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Complainant Name</th>
                        <th>Main Complaint</th>
                        <th>Date</th>
                        <th>Crime Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {firs.map((fir, idx) => (
                        <tr
                            key={fir._id}
                            onClick={() => fetchFirDetail(fir._id)}
                            className={selectedFir?._id === fir._id ? 'clicked' : ''}
                        >
                            <td>{idx + 1}</td>
                            <td>{fir.complainant?.fullName}</td>
                            <td>{fir.incidentDetails?.description}</td>
                            <td>{new Date(fir.incidentDetails?.date).toLocaleDateString()}</td>
                            <td>{fir.crimeType?.mainCategory}</td>
                            <td>{fir.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedFir && (
                <div className="fir-modal" style={modalStyle}>
                    <div style={modalBoxStyle}>
                        <h3>FIR Details</h3>
                        <p><strong>Complainant:</strong> {selectedFir.complainant?.fullName}</p>
                        <p><strong>Description:</strong> {selectedFir.incidentDetails?.description}</p>
                        <p><strong>Date:</strong> {new Date(selectedFir.incidentDetails?.date).toLocaleString()}</p>
                        <p><strong>Crime Type:</strong> {selectedFir.crimeType?.mainCategory}</p>
                        <p><strong>Status:</strong> {selectedFir.status}</p>
                        {selectedFir.statusMessage && (
                            <p><strong>{selectedFir.status === 'Rejected' ? 'Rejection Reason' : 'Status Message'}:</strong> {selectedFir.statusMessage}</p>
                        )}
                        {selectedFir.assignedOfficer?.name && (
                            <p><strong>Officer:</strong> {selectedFir.assignedOfficer.name}</p>
                        )}
                        {selectedFir.evidence && selectedFir.evidence.length > 0 && (
                            <>
                                <p><strong>Evidence:</strong></p>
                                <ul>
                                    {selectedFir.evidence.map((file, i) => (
                                        <li key={i}>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename}</a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <button onClick={() => setSelectedFir(null)} style={closeBtnStyle}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Optional inline styles (you can move to CSS later)
const modalStyle = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
};

const modalBoxStyle = {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
    boxShadow: '0 0 15px rgba(0,0,0,0.3)'
};

const closeBtnStyle = {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#1B263B',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};
