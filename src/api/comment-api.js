import request from '../utils/request';

export const getAll = (recipeId, signal) => request(`/comments?recipe_id=eq.${encodeURIComponent(recipeId)}&order=created_at.asc`, 'GET', null, signal);

export async function create(recipeId, comment) {
    const result = await request('/comments', 'POST', { recipe_id: Number(recipeId), comment });
    if (!result?.length) throw new Error('The comment could not be added.');
    return result[0];
}
