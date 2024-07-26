import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded);
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
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    if (!user) return null;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white text-center">
                            <h2>Welcome to your {user.role} Dashboard</h2>
                        </div>
                        <div className="card-body">
                            <div className="text-center mb-4">
                                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                            </div>
                            <div>
                                {data ? (
                                    <pre className="text-left">{JSON.stringify(data, null, 2)}</pre>
                                ) : (
                                    <div className="text-center">Loading data...</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
