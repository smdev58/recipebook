import { authRequest } from '../utils/request';

export const login = (data) => authRequest('/token?grant_type=password', data);
export const register = (data) => authRequest('/signup', data);
export const logout = (token) => authRequest('/logout?scope=local', null, token);
