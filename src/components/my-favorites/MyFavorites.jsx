import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import AuthContext from '../../contexts/auth-context';
import * as favoriteApi from '../../api/favorite-api';
import RecipeCard from '../recipe-card/RecipeCard';
import FavoriteButton from '../favorite-button/FavoriteButton';

export default function MyFavorites() {
    const { user } = useContext(AuthContext);
    return <FavoritesList key={user.id} userId={user.id} />;
}

function FavoritesList({ userId }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        favoriteApi.getAll(userId, controller.signal)
            .then(items => {
                if (!controller.signal.aborted) setRecipes(items);
            })
            .catch(err => {
                if (!controller.signal.aborted) setError(err.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [userId]);

    function removeFavorite(recipeId) {
        setRecipes(items => items.filter(recipe => recipe.id !== recipeId));
    }

    return (
        <section>
            <h1>My Favorites</h1>
            {!loading && !error && <p role="status">{recipes.length} saved {recipes.length === 1 ? 'recipe' : 'recipes'}</p>}
            <p><Link to="/catalog">Browse recipes</Link></p>
            {loading && <p role="status">Loading favorites...</p>}
            {error && <p className="error" role="alert">{error}</p>}
            {!loading && !error && recipes.length === 0 && <p>You have not saved any recipes yet.</p>}
            <div className="recipe-list">
                {recipes.map(recipe => (
                    <RecipeCard key={recipe.id} recipe={recipe}>
                        <FavoriteButton userId={userId} recipeId={recipe.id} onRemove={removeFavorite} />
                    </RecipeCard>
                ))}
            </div>
        </section>
    );
}
