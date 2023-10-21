import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {TouchableOpacity, Text} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Browser from '../screens/browserPage';

import Search from '../screens/searchPage';
import Home from '../screens/homePage';

import AdminLogin from '../screens/adminLoginPage';
import ContentInput from '../screens/contentInputPage';
import ContentPage from '../screens/contentPage';
import AdminMenu from '../screens/adminMenuPage';
import AdminChangePass from '../screens/adminChangePassPage';
import AdminAddUser from '../screens/adminAddUserPage';

const Stack = createStackNavigator();
const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#009788',
    height: 50,
  },
};

function MainStackNavigator({navigation, route}) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerStyle: screenOptionStyle, // Set the custom header style here
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Browser"
          component={Browser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminMenu"
          component={AdminMenu}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminAddUser"
          component={AdminAddUser}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContentInput"
          component={ContentInput}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContentPage"
          component={ContentPage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainStackNavigator;
