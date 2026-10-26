import request from '../utils/request';

export const getAll = (signal) => request('/recipes?order=created_at.desc', 'GET', null, signal);

export const getLatest = (signal) => request('/recipes?order=created_at.desc&limit=3', 'GET', null, signal);

export async function getOne(id, signal) {
    const recipes = await request(`/recipes?id=eq.${encodeURIComponent(id)}`, 'GET', null, signal);
    return recipes[0];
}
