import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirekcija usera ako je vec logovan
        const isAuthenticated = localStorage.getItem('token');
        if (isAuthenticated) {
            navigate('/dashboard'); // Redirekcija na dashboard ako je logovan user
        }
    }, [navigate]); // Izbegavanje ponovnog pravljenja funkcije

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { email, password });
            console.log(response);
            localStorage.setItem('token', response.data.token); // Cuvanje tokena lokalno
            navigate('/dashboard'); // Navigacija na dashboard posle uspesnog logina
        } catch (err) {
            setError('Invalid credentials, please try again.');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
            <div className="mt-3">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default LoginPage;