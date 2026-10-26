import { Link } from 'react-router';

export default function Home() {
    return (
        <section>
            <h1>Welcome to RecipeBook</h1>
            <p>A place for recipes and cooking ideas.</p>
            <Link to="/about">About RecipeBook</Link>
        </section>
    );
}
