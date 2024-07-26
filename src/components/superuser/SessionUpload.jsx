import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SessionUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const csvToXml = (data) => {
        let xml = '<root>';
        data.forEach((row, index) => {
            xml += `<row id="${index + 1}">`;
            for (const [key, value] of Object.entries(row)) {
                xml += `<${key}>${value}</${key}>`;
            }
            xml += '</row>';
        });
        xml += '</root>';
        return xml;
    };

    const handleUpload = () => {
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    const xmlData = csvToXml(results.data);
                    try {

                        const response = await axios.post('http://localhost:5002/api/upload-session', xmlData, {

                            headers: {
                                'Content-Type': 'application/xml'
                            }
                        });
                        setMessage('CSV data converted to XML and sent successfully.');
                    } catch (error) {
                        console.error('Error uploading XML:', error);
                        setMessage('Error uploading XML.');
                    }
                }
            });
        } else {
            setMessage('Please select a file first.');
        }
    };

    const handleBackToHome = () => {
        navigate('/su-dashboard'); // Adjust the route as per your application's home page route
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Upload CSV for Session</h2>
                            <label>Select CSV file:</label>
                            <div className="mb-3">
                                <input className="form-control" type="file" accept=".csv" onChange={handleFileChange} />
                            </div>
                            <div className="d-grid gap-2 justify-content-md">
                                <button className="btn btn-primary me-md-2" type="button" onClick={handleUpload}>Upload</button>
                                <button className="btn btn-secondary" type="button" onClick={handleBackToHome}>Back to Home</button>
                            </div>
                            {message && <p className="mt-3">{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default SessionUpload;
