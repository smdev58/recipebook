import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import AuthContext from '../../contexts/auth-context';
import * as recipeApi from '../../api/recipe-api';
import RecipeCard from '../recipe-card/RecipeCard';

export default function MyRecipes() {
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        recipeApi.getMine(user.id, controller.signal)
            .then(setRecipes)
            .catch(err => { if (!controller.signal.aborted) setError(err.message); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [user.id]);

    return (
        <section>
            <h1>My Recipes</h1>
            <p><Link to="/create">Add a recipe</Link></p>
            {loading && <p role="status">Loading recipes...</p>}
            {error && <p role="alert" className="error">{error}</p>}
            {!loading && !error && recipes.length === 0 && <p>You have not added any recipes yet.</p>}
            <div className="recipe-list">{recipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
        </section>
    );
}
