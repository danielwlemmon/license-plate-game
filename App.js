import React from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import HomeScreen from './screens/HomeScreen';
import PlatesScreen from './screens/PlatesScreen';
import History from './screens/History';
import InfoScreen from './screens/InfoScreen';
import ScavengerScreen from './screens/ScavengerScreen';
import CustomScreen from './screens/CustomScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="PlatesScreen" component={PlatesScreen} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="InfoScreen" component={InfoScreen} />
          <Stack.Screen name="ScavengerScreen" component={ScavengerScreen} />
          <Stack.Screen name="CustomScreen" component={CustomScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}