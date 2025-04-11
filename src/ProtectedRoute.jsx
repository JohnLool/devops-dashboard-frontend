import React, {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null — состояние проверки
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = Cookies.get('access_token');
            if (accessToken) {
                setIsAuthenticated(true);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/users/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    const expires = new Date(Date.now() + 30 * 60 * 1000);
                    Cookies.set('access_token', data.token, {
                        path: '/',
                        sameSite: 'Lax',
                        secure: true,
                        expires: expires
                    });
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error with refresh token:', error);
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    return children;
};

export default ProtectedRoute;
