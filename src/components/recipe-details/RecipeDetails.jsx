import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import AuthContext from '../../contexts/auth-context';
import * as recipeApi from '../../api/recipe-api';

export default function RecipeDetails() {
    const { recipeId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(false);

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

    async function deleteHandler() {
        if (!window.confirm('Delete this recipe?')) return;
        setDeleting(true);
        setError('');
        try {
            await recipeApi.remove(recipeId);
            navigate('/catalog');
        } catch (err) {
            setError(err.message);
            setDeleting(false);
        }
    }

    if (loading) return <p role="status">Loading recipe...</p>;
    if (!recipe) return error ? <p className="error" role="alert">{error}</p> : <section><h1>Recipe not found</h1><Link to="/catalog">Back to catalog</Link></section>;

    return (
        <section className="details">
            <p><Link to="/catalog">Back to catalog</Link></p>
            <h1>{recipe.title}</h1>
            <img className="details-image" src={recipe.image_url} alt={recipe.title} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/recipe-placeholder.svg'; }} />
            <h2>Ingredients</h2>
            <p className="multiline">{recipe.ingredients}</p>
            <h2>Instructions</h2>
            <p className="multiline">{recipe.instructions}</p>
            {user?.id === recipe.owner_id && <div className="actions">
                <Link className="button" to={`/recipes/${recipeId}/edit`}>Edit</Link>
                <button className="delete-button" onClick={deleteHandler} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>}
            {error && <p className="error" role="alert">{error}</p>}
        </section>
    );
}
