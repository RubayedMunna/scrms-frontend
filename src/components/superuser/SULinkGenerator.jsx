// src/components/SULinkGenerator.js
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SULinkGenerator = () => {
    const navigate = useNavigate();

    const handleGenerateLink = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/generate-registration-link');
            alert('Registration link sent to your email');
            navigate('/su-login');
        } catch (error) {
            console.error('Failed to send registration link:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-secondary text-white text-center">
                            <h2>Generate Super User Registration Link</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleGenerateLink}>
                                <button type="submit" className="btn btn-primary btn-block">Generate Link</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SULinkGenerator;
