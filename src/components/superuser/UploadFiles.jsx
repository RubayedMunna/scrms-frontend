import { Link, useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEye } from '@fortawesome/free-solid-svg-icons';
import '../../App.css'

const UploadFiles = () => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate
    const defaultProfileImage = 'path/to/default-image.jpg'; // Replace with the path to your default image

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            fetchDashboardData(token);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const fetchDashboardData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5002/api/auth/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setUser(response.data.user);
            
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
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
                    {/* <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button> */}
                </div>
            </div>
        </div>
    );
};

export default UploadFiles;
