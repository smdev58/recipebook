import { useEffect, useState } from 'react';
import * as recipeApi from '../../api/recipe-api';
import RecipeCard from '../recipe-card/RecipeCard';

export default function Catalog() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        recipeApi.getAll(controller.signal)
            .then(setRecipes)
            .catch(err => { if (!controller.signal.aborted) setError(err.message); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, []);

    return (
        <section>
            <h1>Recipe Catalog</h1>
            {loading && <p role="status">Loading recipes...</p>}
            {error && <p role="alert" className="error">{error}</p>}
            {!loading && !error && recipes.length === 0 && <p>No recipes yet. Sign in to add the first one.</p>}
            <div className="recipe-list">{recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
        </section>
    );
}
