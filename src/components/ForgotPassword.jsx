// src/components/ForgotPassword.js

import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
            setMessage('Recovery email sent. Please check your inbox.');
            setSent(true);
        } catch (error) {
            setMessage('Error sending recovery email. Please try again.');
            console.error('Error:', error);
        }
    };

    if (sent) {
        return (
            <div className="container mt-5">
                <div className="alert alert-success text-center">
                    <p>Recovery email sent. Please check your inbox.</p>
                    <a href="/login" className="btn btn-primary">Return to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header bg-secondary text-white">
                            <h2>Forgot Password</h2>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block">Send Reset Link</button>
                            </form>
                            {message && <p className="mt-3 text-danger">{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
