import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { uploadFile, removeFile, fetchCompanyFiles, downloadFile } from '../components/ApiService';
import Papa from 'papaparse';

const CompanyPage = () => {
    const { companyName } = useParams();  // Get the company name from the URL
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');
    const [userToRemove, setUserToRemove] = useState(null);
    const [files, setFiles] = useState([]);
    const [selectedFile,setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null); // State to track upload status
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isSorted, setIsSorted] = useState(false);

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
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {

            const token = localStorage.getItem('token'); // Get token from localStorage

            try {
                // API call to fetch users for the company using companyName
                const response = await axios.get(`/api/companies/${companyName}/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in headers
                    },
                });

                setUsers(response.data.members); // Assuming 'members' contains the list of users

                if(response.data.admin_id===currentUserId){
                    setIsAdmin(true);
                }
                else{
                    setIsAdmin(false);
                }
                //console.log(isAdmin);

            } catch (err) {
                setError('Failed to fetch users');
                console.error(err);
            }
        };

        if(currentUserId){
            fetchUsers();
        }
    }, [currentUserId,companyName]); // Re-fetch if the company name changes

    useEffect(() => {
        const fetchFiles = async () => {

            const token = localStorage.getItem('token'); // Get token from localStorage

            try {
                // API call to fetch users for the company using companyName
                const response = await axios.get(`/api/companies/${companyName}/files`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in headers
                    },
                });

                setFiles(response.data[0]); // Assuming 'members' contains the list of users
                
            } catch (err) {
                setError('Failed to fetch users');
                console.error(err);
            }
        };

        fetchFiles();
    }, [companyName, uploadStatus]); // Re-fetch if the company name changes

    const handleAddUser = async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            await axios.post(`/api/companies/${companyName}/add-user`, { email: newUserEmail }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });
            // Refresh the user list after adding a new user
            setNewUserEmail('');
            setShowAddUserModal(false);
            await fetchUsers();
            
        } catch (err) {
            setError('Failed to add user');
            console.error(err);
        }
    };

    const handleRemoveUser = async (userId) => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            await axios.delete(`/api/companies/${companyName}/remove-user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });
            // Refresh the user list after removing a user
            await fetchUsers();
        } catch (err) {
            setError('Failed to remove user');
            console.error(err);
        }
    };

    const handleDownloadFile = async (fileName) => {
        try {
            const response = await fetch(`/api/companies/${companyName}/files/${fileName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                setError('Failed to download file');
            }
        } catch (err) {
            setError('An error occurred');
        }
    };

    // Function to handle file removal
    const handleRemoveFile = async (fileName) => {
        try {
            const response = await fetch(`/api/companies/${companyName}/files/${fileName}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Remove file from state after successful deletion
            setFiles(files.filter((file) => file.name !== fileName));
        } catch (err) {
            setError('Failed to remove file');
        }
    };

    // Function to handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Function to handle file upload
    const handleUploadFile = async () => {
        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }
        try {
            setUploadStatus('Uploading...');  // Set upload status
            await uploadFile(companyName, selectedFile);  // Call API to upload the file
            setUploadStatus('File uploaded successfully!');  // Update status on success

            // Refresh the file list after upload
            //const updatedFiles = await fetchFiles();
            //setFiles(updatedFiles);
            //console.log(files);

           

            setSelectedFile(null);  // Clear selected file after upload
        } catch (err) {
            setError('Failed to upload file');
            setUploadStatus(null);
        }
    };

    const handleExportUsers = () => {
        if (users.length === 0) {
            setError('No users to export');
            return;
        }


        // Convert JSON to CSV
        const csv = convertJsonToCsv(users.map(user => ({
            ID: user.id,
            Name: user.name,
            Email: user.email,
            Role: user.is_admin ? 'Admin' : 'Member',
        })));

        // Create a Blob from the CSV data and trigger download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Function to handle sorting
    const handleSortUsers = () => {
        const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
        setUsers(sortedUsers);
        setIsSorted(true); // Update sorting state
    };

    const convertJsonToCsv = (jsonData) => {
        // Convert JSON to CSV format using PapaParse
        return Papa.unparse(jsonData, {
            header: true,
            quotes: true,
            delimiter: ',',
            skipEmptyLines: true,
        });
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.get(`/api/companies/${companyName}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });
            
            setUsers(response.data.members); // Assuming 'members' contains the list of users

            if(response.data.admin_id===1){
                setIsAdmin(true);
                //console.log('Usao u drugi if, admin je 1');
            }
            else{
                setIsAdmin(false);
                //console.log('Usao u drugi else, admin je 0');
            }
            console.log(isAdmin);
            
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        }
    };

    const fetchFiles = async () => {
        const token = localStorage.getItem('token'); // Get token from localStorage

        try {
            const response = await axios.get(`/api/companies/${companyName}/files`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            });
            setFiles(response.data.members); // Assuming 'members' contains the list of users
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        }
    };


    return (
    <div>
        <div>
            <h1 className="text-center mt-5">Company: {companyName}</h1>
            {/* You can add more logic here to fetch and display data related to the company */}
        </div>
        <div>
            <h1 className="mt-5">Company Users</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {isAdmin && (
                <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>Add User</button>
            )}

            <button className="btn btn-primary" onClick={handleSortUsers}>
                {isSorted ? 'Sorted Alphabetically' : 'Sort Alphabetically'}
            </button>

            {users.length === 0 ? (
                <p>No users found for this company.</p>
            ) : (
                <ul className="list-group">
                    {users.map(user => (
                        <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {user.name} ({user.email})
                            {isAdmin && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleRemoveUser(user.id)}>Remove</button>
                            )}
                        </li>
                    ))}
                </ul>
                
            )}

            <button onClick={handleExportUsers} className="btn btn-primary">
                Export Users to CSV
            </button>

            {/* Add User Modal */} 
            {showAddUserModal  && (
                <div className="modal show" style={{ display: 'block' }} aria-labelledby="exampleModalLabel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add User</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                />
                            </div>
                            
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddUser}>Add User</button>
                            </div>
                          
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div>    
            {/* Listirani fajlovi u firmi */}
            
                <h2>Files:</h2>
                {files.length === 0 ? (
                <p>No files found for this company.</p>
                ) : (
                <ul className="list-group">
                    {
                    files.map(file => (
                        <li key={file.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {file.name}
                            <div className="d-flex ml-auto">
                                <button className="btn btn-info btn-sm mr-4 " onClick={() => handleDownloadFile(file.name)}>Download</button>
                                {isAdmin && (
                                <button onClick={() => handleRemoveFile(file.name)} className="btn btn-danger btn-sm "> Remove</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                )}
        </div>
            {/* Upload file section */}
        <div className="mt-4">
            <h3>Upload a new file</h3>
            <input type="file" onChange={handleFileChange} className="form-control" />
            <button type="submit" onClick={handleUploadFile} className="btn btn-success mt-2">
                Upload File
            </button>
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>    
    </div>        
    );
};

export default CompanyPage;