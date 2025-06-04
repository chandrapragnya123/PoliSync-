import React, { useEffect, useState } from 'react';
import '../styles/FIRTable.css';

export default function FIRTable() {
    const [firs, setFirs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

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

    if (loading) return <p>Loading FIRs...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="fir-table-container">
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
                        className={selectedRow === idx ? 'clicked' : ''}
                        onClick={() => setSelectedRow(idx)}
                    >
                        <td>{idx + 1}</td>
                        <td>{fir.complainant.fullName}</td>
                        <td>{fir.incidentDetails.description}</td>
                        <td>{new Date(fir.incidentDetails.date).toLocaleDateString()}</td>
                        <td>{fir.crimeType.mainCategory}</td>
                        <td>{fir.status}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}
