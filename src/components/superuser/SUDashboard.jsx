// src/components/Dashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/auth';
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
                    <div className="dropdown mt-3">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="uploadDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            Upload CSV Files
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="uploadDropdown">
                            <li><Link className="dropdown-item" to="/upload-department">Department Upload</Link></li>
                            <li><Link className="dropdown-item" to="/upload-teacher">Teacher Upload</Link></li>
                            
                            <li><Link className="dropdown-item" to="/upload-staff">Staff Upload</Link></li>
                            <li><Link className="dropdown-item" to="/upload-room">Room Upload</Link></li>
                            <li><Link className="dropdown-item" to="/upload-department-chairman">Department Chairman Upload</Link></li>
                            <li><Link className="dropdown-item" to="/upload-session">Session Upload</Link></li>
                            <li><Link className="dropdown-item" to="/upload-exam-year">Exam Year Upload</Link></li>
                            <li><Link className="dropdown-item" to="/upload-student">Student Upload</Link></li>
                        </ul>
                    </div>
                    <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default SUDashboard;
