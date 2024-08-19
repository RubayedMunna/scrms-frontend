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
            setUser(response.data.staff); 
            setDepartment(response.data.staff_dept);
            // console.log(department);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     window.location.href = '/login';
    // };

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
                           
                            <div className="mt-4">
                                <p><strong>Name:</strong> {user.Name}</p>
                                <p><strong>Deaprtment:</strong> {department.Dept_Name}</p>
                                <p><strong>Post:</strong> {user.Role}</p>
                                <p><strong>Email:</strong> {user.Email}</p>
                                <p><strong>Phone:</strong> {user.Phone}</p>
                            </div>
                            {/* <div className="text-center mb-4">
                                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
