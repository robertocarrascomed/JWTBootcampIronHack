import * as Keychain from 'react-native-keychain';
import {useState} from 'react';
import {login} from '../services/AuthService';
import {useNavigation} from '@react-navigation/native';
import {StackNavigation} from '../navigator/navigation';

export const storeToken = async (username: string, token: string) => {
  return await Keychain.setGenericPassword(username, token);
};

export const getToken = async () => {
  const credentials = await Keychain.getGenericPassword();
  return credentials ? credentials.password : null;
};

export const deleteToken = async () => {
  await Keychain.resetGenericPassword();
};

export enum ValidationError {
  NameEmty = 'El nombre no puede estár vacio',
  NameTooShort = 'El nombre es demasiado corto',
  NameTooLong = 'El nombre es demasiado largo',
  NameInvalidCharacters = 'El nombre contiene caracteres inválidos',
  PasswordEmty = 'La contraseña no puede estár vacia',
  PasswordTooShort = 'La contraseña es demasiado corta',
  PasswordTooLong = 'La contraseña es demasiado larga',
  PasswordMissingUppercase = 'La contraseña debe tener al menos una mayúscula',
  PasswordMissingLowercase = 'La contraseña debe tener al menos una minúscula',
  PasswordMissingSpecialChar = 'La contraseña debe tener al menos un carácter especial (*, !, ¡, $, @, %, &, ., ?, ¿)',
  PasswordInvalidCharacter = 'La contraseña contiene caracteres no permitidos\n\nSolo se permiten letras, números y los siguientes caracteres especiales: * ! ¡ $ @ % & . ? ¿',
}

export function validateName(name: string): ValidationError | null {
  if (name.length === 0) {
    return ValidationError.NameEmty;
  }
  if (name.length < 3) {
    return ValidationError.NameTooShort;
  }
  if (name.length > 20) {
    return ValidationError.NameTooLong;
  }
  if (/[^a-zA-Z0-9]/.test(name)) {
    return ValidationError.NameInvalidCharacters;
  }
  return null;
}

export function validatePassword(password: string): ValidationError | null {
  if (password.length === 0) {
    return ValidationError.PasswordEmty;
  }
  if (password.length < 8) {
    return ValidationError.PasswordTooShort;
  }
  if (password.length > 30) {
    return ValidationError.PasswordTooLong;
  }
  if (!/[A-Z]/.test(password)) {
    return ValidationError.PasswordMissingUppercase;
  }
  if (!/[a-z]/.test(password)) {
    return ValidationError.PasswordMissingLowercase;
  }
  if (!/[*!¡$@%&.?¿]/.test(password)) {
    return ValidationError.PasswordMissingSpecialChar;
  }
  if (/[^a-zA-Z0-9*!¡$@%&.?¿]/.test(password)) {
    return ValidationError.PasswordInvalidCharacter;
  }
  return null;
}

export function useLogin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigation = useNavigation<StackNavigation>();

  const onChangeUsername = (text: string): void => {
    setError('');
    setUsername(text);
  };
  const onChangePassword = (text: string): void => {
    setError('');
    setPassword(text);
  };

  const validateData = () => {
    const validationName = validateName(username);
    const validationPassword = validatePassword(password);
    if (validationName !== null) {
      throw new Error(validationName);
    }
    if (validationPassword !== null) {
      throw new Error(validationPassword);
    }

    return true;
  };
  const handleLogin = async (): Promise<void> => {
    try {
      if (validateData()) {
        const result = await login(username, password);
        if (result) {
          navigation.navigate('Profile');
          return;
        }
      }
      throw new Error('Credenciales inválidas');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError('Ocurrió un error');
    }
  };

  return {
    error,
    onChangeUsername,
    onChangePassword,
    handleLogin,
  };
}
