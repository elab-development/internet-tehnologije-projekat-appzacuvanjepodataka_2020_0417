import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="bg-light text-center text-lg-start fixed-bottom">
            <div className="container p-4">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-12 mb-4 mb-md-0 ">
                        <h5 className="text-uppercase">Easy management for your company.</h5>
                        <p>
                            Manage everything your company needs. All in one place!
                        </p>
                    </div>

                    <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                        <h5 className="text-uppercase">Links</h5>
                        <ul className="list-unstyled mb-0">
                            <li>
                                <a href="/" className="text-dark">Home</a>
                            </li>
                            <li>
                                <a href="/about" className="text-dark">About Us</a>
                            </li>
                            <li>
                                <a href="/dashboard" className="text-dark">Dashboard</a>
                            </li>
                            <li>
                                <a href="/login" className="text-dark">Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="text-center p-3 bg-dark text-white">
                © {new Date().getFullYear()} ShareFiles App | by Aleksa & Marko
            </div>
        </footer>
    );
};

export default Footer;