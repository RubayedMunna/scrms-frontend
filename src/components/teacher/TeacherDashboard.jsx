import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEye } from '@fortawesome/free-solid-svg-icons';
import '../../App.css'
const TeacherDashboard = () => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const [department, setDepartment] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate
    const defaultProfileImage = '/files/images/Default_Profile_Image.png';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            fetchDashboardData(token);
        } else {
            window.location.href = '/login';
        }
    }, []);

    // This effect will run when `department` changes
    useEffect(() => {
        if (department) {
            console.log('Updated department:', department); // Log department only after it updates
        }
    }, [department]);

    const fetchDashboardData = async (token) => {
        try {
            const response = await axios.get('http://localhost:5002/api/auth/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setUser(response.data.teacher);
            setDepartment(response.data.dept);
            // console.log(department);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const handleViewPhoto = () => {
        if (user && user.profileImage) {
            window.open(`http://localhost:5004${user.profileImage}`, '_blank');
        }
    };

    const handleChangePhoto = () => {
        if (user && user.teacher_id) {
            navigate(`/upload-teacher-image/${user.teacher_id}`); // Navigate to UploadTeacherImage with teacher_id
        }
    };

    if (!data) return <div className="text-center">Loading data...</div>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h2>{user.Name}'s Dashboard</h2>
                        </div>
                        <div className="card-body">
                            <div className="text-center">
                                <div className="position-relative">
                                    <img 
                                        src={user?.profileImage ? `http://localhost:5004${user.profileImage}` : defaultProfileImage} 
                                        alt="Profile" 
                                        width="150" 
                                        className="img-thumbnail"
                                    />
                                    <div className="overlay">
                                        <button className="btn btn-info" onClick={handleViewPhoto}>
                                            <FontAwesomeIcon icon={faEye} /> View Photo
                                        </button>
                                        <button className="btn btn-secondary" onClick={handleChangePhoto}>
                                            <FontAwesomeIcon icon={faCamera} /> Change Photo
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p><strong>Name:</strong> {user.Name}</p>
                                <p><strong>Designation:</strong> {user.Designation}</p>
                                <p><strong>Department:</strong> {department.Dept_Name}</p>
                                <p><strong>Email:</strong> {user.Email}</p>
                                <p><strong>Phone:</strong> {user.Phone}</p>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
