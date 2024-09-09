// apiService.js

import axios from "axios";

const API_BASE_URL = '/api'; // Slanje na api stranicu u zavisnosti od tvog urla


// Funkcija za kreiranje kompanije
export const createCompany = async (companyData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Token za login
            },
            body: JSON.stringify(companyData)
        });

        if (!response.ok) {
            throw new Error('Failed to create company');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error creating company:', error);
        throw error;
    }
};

// src/components/ApiService.js

export const removeCompany = async (companyId) => {
    const token = localStorage.getItem('token'); // Uzimanje tokena
    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await fetch(`/api/companies/${companyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,  // Prosledjivanje tokena
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete company');
        }

        return await response.json(); // Vracanje odgovora ukoliko je potrebno
    } catch (error) {
        console.error('Error removing company:', error);
        throw error;
    }
};

export const fetchCompanyFiles = async (companyName) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/companies/${companyName}/files`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch company files');
    }

    return await response.json();
};

export const downloadFile = async (companyName, fileName) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/companies/${companyName}/files/${fileName}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to download file');
    }

    return response.blob(); 
};

export const fetchCompanyUsers = async (companyName) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/companies/${companyName}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch company users');
    }

    return await response.json();
};

// Funkcija za brisanje fajlova
export const removeFile = async (companyName, fileName) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const response = await axios.delete(`/api/companies/${companyName}/files/${fileName}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }, 
    });
    return response.data;
};

// Upload fajla
export const uploadFile = async (companyName, file) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`/api/companies/${companyName}/upload`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Add other API functions here...