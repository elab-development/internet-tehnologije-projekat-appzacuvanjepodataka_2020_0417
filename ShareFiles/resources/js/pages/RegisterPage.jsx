import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            
            const token = localStorage.getItem('token'); // Get token from localStorage
            
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in headers
                    },
                }); // Replace with your endpoint to get logged-in user
                

                if (response.status === 200) {
                    setIsLoggedIn(true);
                    setUserName(response.data.name); // Adjust according to the API response
                }
            } catch (err) {
                setIsLoggedIn(false);
            }
        };
        
        checkAuth();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post('/api/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            });

            if (response.status === 201) {
                setSuccess('Registration successful. You can now log in.');
                setName('');
                setEmail('');
                setPassword('');
                setPasswordConfirmation('');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || 'Registration failed. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    if (isLoggedIn) {
        return (
            <div className="container">
                <h2>You are already logged in as {userName}</h2>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="passwordConfirmation" className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="passwordConfirmation"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;