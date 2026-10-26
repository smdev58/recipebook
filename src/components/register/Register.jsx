import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import AuthContext from '../../contexts/auth-context';

export default function Register() {
    const { register } = useContext(AuthContext);
    const [values, setValues] = useState({ email: '', password: '', repeatPassword: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    function changeHandler(e) {
        setValues({ ...values, [e.target.name]: e.target.value });
    }

    async function submitHandler(e) {
        e.preventDefault();
        setMessage('');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
            setError('Enter a valid email address.');
            return;
        }
        if (values.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (values.password !== values.repeatPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setSaving(true);
        try {
            const signedIn = await register({ email: values.email.trim(), password: values.password });
            if (signedIn) navigate('/');
            else {
                setMessage('Check your email to confirm your account, then log in. If you already have an account, use Login.');
                setValues({ email: '', password: '', repeatPassword: '' });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="form-page">
            <h1>Register</h1>
            <form onSubmit={submitHandler} noValidate>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" value={values.email} onChange={changeHandler} required />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" value={values.password} onChange={changeHandler} required />
                <label htmlFor="repeatPassword">Repeat password</label>
                <input id="repeatPassword" name="repeatPassword" type="password" autoComplete="new-password" value={values.repeatPassword} onChange={changeHandler} required />
                {error && <p role="alert" className="error">{error}</p>}
                {message && <p role="status" className="success">{message}</p>}
                <button disabled={saving}>{saving ? 'Registering...' : 'Register'}</button>
            </form>
            <p>Already registered? <Link to="/login">Login</Link></p>
        </section>
    );
}
