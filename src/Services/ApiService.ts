import axios from 'axios';
import * as Keychain from 'react-native-keychain';

axios.interceptors.request.use(async config => {
  const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    const {token, expiresAt} = JSON.parse(credentials.password);

    if (Date.now() > expiresAt) {
      console.log('Token expired');
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

const api = axios.create({
  baseURL: 'https://example.com/api',
});

export default api;
