import { getItem, setItem, removeItem } from './storage';
import { type AuthSession, type User } from '../types';

export const getSession = (): AuthSession => {
  return getItem<AuthSession>('authSession', { user: null, isAuthenticated: false });
};

export const setSession = (user: User): void => {
  setItem<AuthSession>('authSession', { user, isAuthenticated: true });
};

export const clearSession = (): void => {
  removeItem('authSession');
};

export const getUserByEmail = (email: string): User | null => {
  const users = getItem<User[]>('users', []);
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};
