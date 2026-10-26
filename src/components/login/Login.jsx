import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import AuthContext from '../../contexts/auth-context';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    function changeHandler(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    async function submitHandler(e) {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || !values.password) {
            setError('Enter a valid email and your password.');
            return;
        }
        setError('');
        setSaving(true);
        try {
            await login({ email: values.email.trim(), password: values.password });
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="form-page">
            <h1>Login</h1>
            <form onSubmit={submitHandler} noValidate>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={changeHandler} required />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={changeHandler} required />
                {error && <p role="alert" className="error">{error}</p>}
                <button disabled={saving}>{saving ? 'Logging in...' : 'Login'}</button>
            </form>
            <p>No account? <Link to="/register">Register</Link></p>
        </section>
    );
}
