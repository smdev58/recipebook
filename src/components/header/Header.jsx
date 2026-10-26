import { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import AuthContext from '../../contexts/auth-context';

export default function Header() {
    const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const navigate = useNavigate();

    async function logoutHandler() {
        setBusy(true);
        setError('');
        try {
            await logout();
            navigate('/');
        } catch {
            setError('Signed out on this device. The server logout failed.');
            navigate('/');
        } finally {
            setBusy(false);
        }
    }

    return (
        <header>
            <div className="header-content">
                <Link to="/" className="site-name">
                    <span className="logo-symbol" aria-hidden="true">
                        <img className="site-logo" src="/recipebook-logo.png" alt="" width="120" height="120" />
                    </span>
                    <span className="brand-word">Recipe<span>Book</span></span>
                </Link>
                <nav aria-label="Main navigation">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/catalog">Catalog</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {!loading && (isAuthenticated ? <>
                        <NavLink to="/create">Add Recipe</NavLink>
                        <NavLink to="/my-recipes">My Recipes</NavLink>
                        <NavLink to="/account">My Account</NavLink>
                        <button className="nav-button" onClick={logoutHandler} disabled={busy}>{busy ? 'Signing out...' : 'Logout'}</button>
                    </> : <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>)}
                </nav>
            </div>
            {user && <p className="user-email">{user.email}</p>}
            {error && <p className="error" role="alert">{error}</p>}
        </header>
    );
}
