import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as recipeApi from '../../api/recipe-api';
import RecipeCard from '../recipe-card/RecipeCard';

export default function Home() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        recipeApi.getLatest(controller.signal)
            .then(setRecipes)
            .catch(err => { if (!controller.signal.aborted) setError(err.message); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, []);

    return (
        <section className="home-page">
            <div className="home-intro">
                <p className="home-eyebrow">Cook · Share · Discover</p>
                <h1>Welcome to <span>RecipeBook</span></h1>
                <p>Find something to cook and share your own recipes.</p>
                <p><Link to="/catalog">View all recipes <span aria-hidden="true">→</span></Link></p>
            </div>
            <h2>Latest recipes</h2>
            {loading && <p role="status">Loading recipes...</p>}
            {error && <p role="alert" className="error">{error}</p>}
            {!loading && !error && recipes.length === 0 && <p>No recipes yet.</p>}
            <div className="recipe-list">{recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
        </section>
    );
}
