// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const SUDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        navigate('/su-login');
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    <h2 className="mt-5">Super User Dashboard</h2>
                    <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default SUDashboard;
