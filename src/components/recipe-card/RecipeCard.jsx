import { Link } from 'react-router';

export default function RecipeCard({ recipe }) {
    return (
        <article className="recipe-card">
            <img src={recipe.image_url} alt={recipe.title} loading="lazy" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/recipe-placeholder.svg'; }} />
            <div className="card-content">
                <h2>{recipe.title}</h2>
                <Link className="button" to={`/recipes/${recipe.id}`}>Details</Link>
            </div>
        </article>
    );
}
