import request from '../utils/request';

const userFilter = userId => `/favorites?user_id=eq.${encodeURIComponent(userId)}`;
const recipeFilter = (userId, recipeId) => `${userFilter(userId)}&recipe_id=eq.${encodeURIComponent(recipeId)}`;

export async function getAll(userId, signal) {
    const favorites = await request(`${userFilter(userId)}&select=recipes!inner(id,title,image_url)&order=created_at.desc,recipe_id.desc`, 'GET', null, signal);
    return favorites.map(favorite => favorite.recipes);
}

export async function isSaved(userId, recipeId, signal) {
    const favorites = await request(recipeFilter(userId, recipeId), 'GET', null, signal);
    return favorites.length > 0;
}

export function save(userId, recipeId) {
    return request('/favorites?on_conflict=user_id,recipe_id', 'POST', {
        user_id: userId,
        recipe_id: recipeId,
    }, undefined, 'resolution=ignore-duplicates,return=minimal');
}

export function remove(userId, recipeId) {
    return request(recipeFilter(userId, recipeId), 'DELETE');
}
