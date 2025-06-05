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
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!res.ok) throw new Error('Failed to fetch FIR detail');
            const data = await res.json();
            setSelectedFir(data);
        } catch (err) {
            alert('Error loading FIR detail: ' + err.message);
        }
    };

    const handleFIRAction = async (action) => {
        if (!selectedFir) return;

        if (action === 'Rejected') {
            const reason = prompt('Enter reason for rejection:');
            if (!reason) return;
            try {
                const res = await fetch(`/api/firs/${selectedFir._id}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ status: 'Rejected', rejectionReason: reason }),
                });
                console.log('Rejection response status:', res.status);
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Rejection failed: ${res.status} ${errorText}`);
                }
                const data = await res.json();
                alert('FIR rejected: ' + (data.message || 'Success'));
                setSelectedFir(null);
                window.location.reload();
            } catch (err) {
                console.error('Error during rejection:', err);
                alert(err.message);
            }
        } else if (action === 'Accepted') {
            try {
                const res = await fetch(`/api/firs/${selectedFir._id}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ status: 'Accepted' }),
                });
                console.log('Acceptance response status:', res.status);
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Acceptance failed: ${res.status} ${errorText}`);
                }
                const data = await res.json();
                alert('FIR accepted and moved to complaints: ' + (data.message || 'Success'));
                setSelectedFir(null);
                window.location.reload();
            } catch (err) {
                console.error('Error during acceptance:', err);
                alert(err.message);
            }
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

                        <section>
                            <h4>Complainant Details</h4>
                            <p><strong>Name:</strong> {selectedFir.complainant?.fullName}</p>
                            <p><strong>Email:</strong> {selectedFir.complainant?.email}</p>
                            <p><strong>Phone:</strong> {selectedFir.complainant?.phoneNumber}</p>
                            <p>
                                <strong>Address:</strong>{' '}
                                {[selectedFir.complainant?.address?.street, selectedFir.complainant?.address?.city, selectedFir.complainant?.address?.state, selectedFir.complainant?.address?.postalCode, selectedFir.complainant?.address?.country]
                                    .filter(Boolean)
                                    .join(', ')}
                            </p>
                        </section>

                        <section>
                            <h4>Crime Details</h4>
                            <p><strong>Main Category:</strong> {selectedFir.crimeType?.mainCategory}</p>
                            {selectedFir.crimeType?.subCategories && selectedFir.crimeType.subCategories.length > 0 && (
                                <p><strong>Sub Categories:</strong> {selectedFir.crimeType.subCategories.join(', ')}</p>
                            )}
                            {selectedFir.crimeType?.customDescription && (
                                <p><strong>Other Description:</strong> {selectedFir.crimeType.customDescription}</p>
                            )}
                        </section>

                        <section>
                            <h4>Incident Details</h4>
                            <p><strong>Date:</strong> {new Date(selectedFir.incidentDetails?.date).toLocaleString()}</p>
                            <p><strong>Time:</strong> {selectedFir.incidentDetails?.time || '-'}</p>
                            <p>
                                <strong>Location:</strong>{' '}
                                {[selectedFir.incidentDetails?.location?.address, selectedFir.incidentDetails?.location?.landmark]
                                    .filter(Boolean)
                                    .join(', ')}
                            </p>
                            {selectedFir.incidentDetails?.location?.gpsCoordinates && (
                                <p>
                                    <strong>GPS:</strong> Lat {selectedFir.incidentDetails.location.gpsCoordinates.lat}, Lng {selectedFir.incidentDetails.location.gpsCoordinates.lng}
                                </p>
                            )}
                            <p><strong>Description:</strong> {selectedFir.incidentDetails?.description}</p>
                        </section>

                        <section>
                            <h4>Witnesses</h4>
                            {selectedFir.incidentDetails?.witnesses && selectedFir.incidentDetails.witnesses.length > 0 ? (
                                <ul>
                                    {selectedFir.incidentDetails.witnesses.map((w, i) => (
                                        <li key={i}>
                                            <p><strong>Name:</strong> {w.name || '-'}</p>
                                            <p><strong>Contact:</strong> {w.contact || '-'}</p>
                                            <p><strong>Statement:</strong> {w.statement || '-'}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No witnesses reported.</p>
                            )}
                        </section>

                        <section>
                            <h4>Evidence</h4>
                            {selectedFir.incidentDetails?.evidence && selectedFir.incidentDetails.evidence.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                    {selectedFir.incidentDetails.evidence.map((file, i) => {
                                        const isImage = file.type === 'image';
                                        return (
                                            <div key={i} style={{ maxWidth: 150, textAlign: 'center' }}>
                                                {isImage ? (
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        <img
                                                            src={file.url}
                                                            alt={file.description || 'Evidence'}
                                                            style={{ width: '100%', borderRadius: 5, cursor: 'pointer' }}
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

                        <section>
                            <h4>Other Info</h4>
                            <p><strong>Status:</strong> {selectedFir.status}</p>
                            {selectedFir.status === 'Rejected' && (
                                <p><strong>Rejection Reason:</strong> {selectedFir.rejectionReason}</p>
                            )}
                            {selectedFir.assignedOfficer?.name && (
                                <p><strong>Assigned Officer:</strong> {selectedFir.assignedOfficer.name}</p>
                            )}
                        </section>

                        {selectedFir.status === 'Pending' && (
                            <div style={{ marginTop: '20px' }}>
                                <button style={acceptBtnStyle} onClick={() => handleFIRAction('Accepted')}>
                                    Accept
                                </button>
                                <button style={rejectBtnStyle} onClick={() => handleFIRAction('Rejected')}>
                                    Reject
                                </button>
                            </div>
                        )}

                        <button onClick={() => setSelectedFir(null)} style={closeBtnStyle}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inline styles (can move to CSS)
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

const acceptBtnStyle = {
    ...closeBtnStyle,
    backgroundColor: 'green',
    marginRight: '10px',
};

const rejectBtnStyle = {
    ...closeBtnStyle,
    backgroundColor: 'red',
};
