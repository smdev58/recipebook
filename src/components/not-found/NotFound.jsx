import { Link } from 'react-router';

export default function NotFound() {
    return (
        <section>
            <h1>Page not found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go home</Link>
        </section>
    );
}
