// tokenManager.ts
import Store from 'electron-store';

const store = new Store();

export const setTokens = (auth: any) => {
  store.set('auth', auth);
};

export const getAuth = (): any => { 
  return store.get('auth');
};

export const clearTokens = () => {
  store.delete('auth');
};

export const isLoggedIn = (): boolean => {
  return !!store.get('auth');
};
