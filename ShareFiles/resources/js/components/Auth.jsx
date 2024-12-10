// auth.js
export const getUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const response = await fetch('/api/user', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error('Not authenticated');
        }
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

export const logout = async () => {
    const token = localStorage.getItem('token');
    try {
        await fetch('/api/logout', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        localStorage.removeItem('token'); // Brisanje tokena pri logout-u 
    } catch (error) {
        console.error('Error logging out:', error);
    }
};