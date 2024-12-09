import React, {useState} from 'react';
import {View, TextInput, Button, Text} from 'react-native';
import {login} from '../services/AuthService';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../navigator/navigation';

const LoginScreen: React.FC<StackScreenProps<RootStackParamList, 'Login'>> = ({
  navigation,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      await login(username, password);
      navigation.navigate('Profile');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
};

export default LoginScreen;
