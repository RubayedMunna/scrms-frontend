// src/components/ForgotPassword.js

import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false); // State to track if email has been sent

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage('Recovery email sent. Please check your inbox.');
            setSent(true); // Set sent to true after successful email send
        } catch (error) {
            setMessage('Error sending recovery email. Please try again.');
            console.error('Error:', error);
        }
    };

    // Redirect to login page after email is sent
    if (sent) {
        return (
            <div>
                <p>Recovery email sent. Please check your inbox.</p>
                <a href="/login">Return to Login</a>
            </div>
        );
    }

    return (
        <div>
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
