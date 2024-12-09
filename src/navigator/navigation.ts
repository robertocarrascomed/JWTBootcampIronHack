import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  Profile: undefined;
  Login: undefined;
};

export type StackNavigation = NavigationProp<RootStackParamList>;
