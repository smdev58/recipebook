import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import AuthContext from '../../contexts/auth-context';

export function PrivateGuard() {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) return <p role="status">Loading...</p>;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestGuard() {
    const { isAuthenticated, loading } = useContext(AuthContext);
    if (loading) return <p role="status">Loading...</p>;
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
