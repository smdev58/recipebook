import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import AuthContext from '../../contexts/auth-context';
import * as recipeApi from '../../api/recipe-api';
import RecipeForm from '../recipe-form/RecipeForm';

export default function RecipeEdit() {
    const { recipeId } = useParams();
    const { user } = useContext(AuthContext);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError('');
        recipeApi.getOne(recipeId, controller.signal)
            .then(setRecipe)
            .catch(err => { if (!controller.signal.aborted) setError(err.message); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [recipeId]);

    async function saveRecipe(data) {
        await recipeApi.update(recipeId, data);
        navigate(`/recipes/${recipeId}`);
    }

    if (loading) return <p role="status">Loading recipe...</p>;
    if (error) return <p className="error" role="alert">{error}</p>;
    if (!recipe) return <p>Recipe not found.</p>;
    if (recipe.owner_id !== user.id) return <p className="error" role="alert">Only the author can edit this recipe.</p>;

    return <section className="form-page"><h1>Edit Recipe</h1><RecipeForm key={recipeId} initialValues={recipe} onSave={saveRecipe} /></section>;
}
