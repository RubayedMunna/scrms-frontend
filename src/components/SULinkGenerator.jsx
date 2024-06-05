import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SULinkGenerator = () => {
    const [email, setEmail] = useState('');
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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mt-5">Generate Super User Registration Link</h2>
                    <form onSubmit={handleGenerateLink}>
                        
                        <button type="submit" className="btn btn-primary btn-block mt-3">Generate Link</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SULinkGenerator;
