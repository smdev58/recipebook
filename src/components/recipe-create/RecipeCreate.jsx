import { useNavigate } from 'react-router';
import * as recipeApi from '../../api/recipe-api';
import RecipeForm from '../recipe-form/RecipeForm';

export default function RecipeCreate() {
    const navigate = useNavigate();

    async function saveRecipe(data) {
        const recipe = await recipeApi.create(data);
        navigate(`/recipes/${recipe.id}`);
    }

    return <section className="form-page"><h1>Add Recipe</h1><RecipeForm onSave={saveRecipe} /></section>;
}
