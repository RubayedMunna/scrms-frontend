import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Corrected import
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded.role == 'SuperUser'){
                window.location.href='/su-homepage'
            }
            if (decoded.role=='Teacher') {
                // window.location.href='/teacher-dashboard'
                window.location.href='/teacher-homepage'
            }
            if (decoded.role == 'Student'){
                window.location.href='/student-dashboard'
            }
            if (decoded.role == 'Staff'){
                window.location.href='/staff-dashboard'
            }
            
        } else {
            window.location.href = '/login';
        }
    }, []);

    
    return (
        <div className="container mt-5">
            
        </div>
    );
};

export default Dashboard;
