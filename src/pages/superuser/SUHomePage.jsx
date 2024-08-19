import { Navbar, Nav, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faEye } from '@fortawesome/free-solid-svg-icons';
import '../../App.css'
import TeacherNavbar from '../../components/teacher/TeacherNavbar';
import TeacherDashboard from '../../components/teacher/TeacherDashboard';
import SUNavbar from '../../components/superuser/SUNavbar';
import SUDashboard from '../../components/superuser/SUDashboard';

function SUHomePage() {

    const [user, setUser] = useState(null);
    const [data, setData] = useState(null);
    const navigate = useNavigate();

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
            const response = await axios.get('http://localhost:5002/api/auth/su-dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setUser(response.data.user); 
            console.log(response.data.user);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        }
    };
    const handleHome = () => {
        navigate('/su-homepage');
    }
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

  return (
    <div>
        <SUNavbar/>
        <SUDashboard/>
    </div>
  )
}

export default SUHomePage;