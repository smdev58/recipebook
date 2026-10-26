import { useContext } from 'react';
import AuthContext from '../../contexts/auth-context';

export default function Account() {
    const { user } = useContext(AuthContext);

    return (
        <section>
            <h1>My Account</h1>
            <p>Email: {user.email}</p>
        </section>
    );
}
