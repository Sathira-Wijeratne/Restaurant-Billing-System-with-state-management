import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => { // what does this mean?
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setIsAuthenticated(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/verify-token', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('accessToken');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Token validation failed', error);
                setIsAuthenticated(false);
                console.error('Token validation failed');
            }
        };

        validateToken();

    }, [token]);

    if (isAuthenticated === null) {
        return null; // Or your loading component
    }

    if (!isAuthenticated) {
        // localStorage.removeItem('accessToken');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;