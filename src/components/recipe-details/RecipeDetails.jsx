import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import * as recipeApi from '../../api/recipe-api';

export default function RecipeDetails() {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        recipeApi.getOne(recipeId, controller.signal)
            .then(setRecipe)
            .catch(err => {
                if (!controller.signal.aborted) setError(err.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [recipeId]);

    if (loading) return <p role="status">Loading recipe...</p>;
    if (error) return <p className="error" role="alert">{error}</p>;
    if (!recipe) return <section><h1>Recipe not found</h1><Link to="/catalog">Back to catalog</Link></section>;

    return (
        <section className="details">
            <p><Link to="/catalog">Back to catalog</Link></p>
            <h1>{recipe.title}</h1>
            <img className="details-image" src={recipe.image_url} alt={recipe.title} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/recipe-placeholder.svg'; }} />
            <h2>Ingredients</h2>
            <p className="multiline">{recipe.ingredients}</p>
            <h2>Instructions</h2>
            <p className="multiline">{recipe.instructions}</p>
        </section>
    );
}
