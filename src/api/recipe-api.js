import request from '../utils/request';

export const getAll = (signal) => request('/recipes?order=created_at.desc', 'GET', null, signal);

export const getLatest = (signal) => request('/recipes?order=created_at.desc&limit=3', 'GET', null, signal);

export const getMine = (userId, signal) => request(`/recipes?owner_id=eq.${encodeURIComponent(userId)}&order=created_at.desc`, 'GET', null, signal);

export async function getOne(id, signal) {
    const recipes = await request(`/recipes?id=eq.${encodeURIComponent(id)}`, 'GET', null, signal);
    return recipes[0];
}

export async function create(data) {
    const recipes = await request('/recipes', 'POST', data);
    if (!recipes?.length) throw new Error('The recipe could not be created.');
    return recipes[0];
}

export async function update(id, data) {
    const recipes = await request(`/recipes?id=eq.${encodeURIComponent(id)}`, 'PATCH', data);
    if (!recipes?.length) throw new Error('The recipe was not changed. Check that you are its author.');
    return recipes[0];
}

export async function remove(id) {
    const recipes = await request(`/recipes?id=eq.${encodeURIComponent(id)}`, 'DELETE');
    if (!recipes?.length) throw new Error('The recipe was not deleted. Check that you are its author.');
}
