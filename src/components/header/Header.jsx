import { Link, NavLink } from 'react-router';

export default function Header() {
    return (
        <header>
            <div className="header-content">
                <Link to="/" className="site-name">RecipeBook</Link>
                <nav aria-label="Main navigation">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                </nav>
            </div>
        </header>
    );
}
