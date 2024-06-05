import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import

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
            const response = await axios.get('http://localhost:5000/api/auth/dashboard', {
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
        <div>
            <h2>Welcome to your {user.role} dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
            <div>{data && JSON.stringify(data)}</div>
        </div>
    );
};

export default Dashboard;
