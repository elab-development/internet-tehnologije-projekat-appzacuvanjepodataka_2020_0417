import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from './Auth'; 
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [user, setUser] = useState(null); // State za cuvanje info od usera
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const userData = await getUser(); // Uzimanje podataka
            if (userData) {
                setUser(userData); // Ako je user login
            }
        };
        checkAuth(); 
    }, []);

    const handleLogout = async () => {
        await logout(); // Zvanje logout funkcije
        setUser(null);  // Ciscenje usera ukoliko je logout
        navigate('/login'); // Redirekcija na login page
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">| ShareFiles |</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">About Us</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                    </ul>

                   
                    <ul className="navbar-nav">
                        {user ? (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link">Hello, {user.name}</span> 
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                                        Logout
                                    </button> 
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">Login</Link> {/* Login link ako nije loginovan */}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;