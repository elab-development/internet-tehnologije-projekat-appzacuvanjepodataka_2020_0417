import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { createCompany } from '../components/ApiService';
import { removeCompany } from '../components/ApiService';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const [data, setData] = useState([]);  // For storing fetched data
    const [dataRemovable, setDataRemovable] = useState([]);  // For storing removable fetched data
    const [error, setError] = useState(null);  // For storing any errors
    const [success, setSuccess] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [selectedCompany, setSelectedCompany] = useState('');
    const navigate = useNavigate();
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token'); // Get token from localStorage
            try {
                const response = await axios.get('/api/user', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in headers
                    },
                });
                setCurrentUserId(response.data.id); // Assuming the response has an 'id' field
            } catch (err) {
                console.error('Failed to fetch current user', err);
                setError('Failed to fetch current user');
            }
        };

        fetchCurrentUser();
    }, [currentUserId]);

    // Create the async function inside useEffect
    const fetchData = async () => {
        const token = localStorage.getItem('token');  // Get token from localStorage
        if (!token) {
            navigate('/login');  // Redirect to login if no token is found
            return;
        }

        try {
            const response = await fetch('/api/companies', {
                headers: {
                    Authorization: `Bearer ${token}`,  // Pass the token in the headers
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }


            const result = await response.json();
            console.log(result);
            const filterData=result.filter(kompanija=>kompanija.admin_id==currentUserId);
            console.log(filterData);
            console.log(currentUserId);
            setDataRemovable(filterData);
            setData(result);  // Set fetched data to state
        } catch (err) {
            setError(err.message);  // Set error message
        }
    };

    const handleCreateCompany = async () => {
        // Logic to create a company
        try {
            const companyData = {
                name: companyName,
                // Add other company data here
            };

            const result = await createCompany(companyData);
            console.log('Company created:', result);
            setSuccess('Company created successfully!');
            setError(null);
            setCompanyName('');
            fetchData();
        } catch (error) {
            setSuccess(null);
            setError('Failed to create company');
        }
    };

    const handleRemoveCompany = async () => {
        // Logic to remove a company
        try {
            if (!selectedCompany) {
                setError('Please select a company to remove.');
                return;
            }
            await removeCompany(selectedCompany);
            console.log('Company removed');
            setSuccess('Company removed successfully!');
            setError(null);  // Clear any previous errors
            await fetchData();  // Refresh the list of companies
            setSelectedCompany('');  // Clear the selected company
        } catch (error) {
            setSuccess(null);  // Clear any previous success messages
            setError('Failed to remove company');
        }
    };

    const handleAddUser = () => {
        // Logic to add a user to a company
    };

    const handleUploadFile = () => {
        // Logic to upload a file
    };

    const handleRemoveFile = () => {
        // Logic to remove a file
    };

    const handleInputChange=(event) =>{
        setCompanyName(event.target.value);
    }

    const handleSelectChange = (event) => {
        setSelectedCompany(event.target.value);  // Update the selected company ID
    };

    useEffect(() => {
        fetchData();  // Call the async function
    }, [navigate, currentUserId]);  // Dependency array

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Dashboard</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : data ? (
                <div>
                    <h2>Companies List:</h2>
                    <ul>
                        {data.map(company => (
                            <li key={company.id}>
                                <Link to={`/dashboard/${company.name}`}>
                                    {company.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading...</p>
            )}
            <div className="container mt-5 mr-10">
                <h1 className="mt-4">Company Actions</h1>

                
                <div className="mb-3 row">
                    <div className="col-md-4">
                        <input
                            type="text"
                            value={companyName}
                            onChange={handleInputChange}
                            placeholder="Enter company name"
                        />
                    </div>
                    <div className="col-md-4">
                        <Button text="Create Company" onClick={handleCreateCompany} variant="primary" />
                    </div>
                </div>

                <div className="mb-3 row">
                    <div className="col-md-4">
                        <select value={selectedCompany} onChange={handleSelectChange}>
                            <option value="">Select a company to remove</option>
                            {dataRemovable.map(company => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4">
                        <Button text="Remove Company" onClick={handleRemoveCompany} variant="danger" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;