// tokenManager.ts
import Store from 'electron-store';

const store = new Store();

export const setTokens = (accessToken: string, refreshToken: string) => {
  store.set('accessToken', accessToken);
  store.set('refreshToken', refreshToken);
};

export const getAccessToken = (): string | undefined => {
  return store.get('accessToken') as string | undefined;
};

export const getRefreshToken = (): string | undefined => {
  return store.get('refreshToken') as string | undefined;
};

export const clearTokens = () => {
  store.delete('accessToken');
  store.delete('refreshToken');
};

export const isLoggedIn = (): boolean => {
  return !!store.get('accessToken') && !!store.get('refreshToken');
};
