// src/components/WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const WelcomePage = () => {
    return (
        <div className="container mt-5">
            <div className="text-center">
                <h1 className="mb-4">Welcome to the Smart Class Routine Management System</h1>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center mb-4">
                    <Link to="/login" className="btn btn-primary me-2">User Login</Link>
                    <Link to="/su-generate-link" className="btn btn-primary">Super User Registration</Link>
                </div>
                <h2 className="mb-3">Features of the System</h2>
                <ul className="list-group list-group-flush mb-4">
                    <li className="list-group-item">Automated schedule generation</li>
                    <li className="list-group-item">Conflict-free timetables</li>
                    <li className="list-group-item">Easy updates and changes</li>
                    <li className="list-group-item">User-friendly interface</li>
                </ul>
                <Link to="/about-us" className="btn btn-secondary">About Us</Link>
            </div>
        </div>
    );
};

export default WelcomePage;
