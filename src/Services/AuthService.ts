import * as Keychain from 'react-native-keychain';
import {storeToken} from '../utils/storage';

export const login = async (username: string, password: string) => {
  if (username === 'user' && password === 'password') {
    const result = await storeToken(
      username,
      JSON.stringify({
        token: 'eyJhbGciOiJIUzI',
        expiresAt: Date.now() + 60 * 60 * 1000,
      }),
    );
    return result;
  } else {
    throw new Error('Invalid credentials');
  }
};

export const logout = async () => {
  await Keychain.resetGenericPassword();
};
