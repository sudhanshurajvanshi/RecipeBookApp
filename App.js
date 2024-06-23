import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { Image } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
    <Stack.Navigator>
        <Stack.Screen options={{headerTitle:'Home'}} name="HomeScreen" component={HomeScreen} />
        <Stack.Screen  name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
);

const FavoritesStack = () => (
    <Stack.Navigator>
        <Stack.Screen options={{headerTitle:'Favorites'}}  name="FavoritesStack" component={FavoritesScreen} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
);


export default function NewApp() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
            <Tab.Navigator screenOptions={{headerShown:false}}>
                <Tab.Screen options={{tabBarIcon:({ color, size })=>(<Image style={{width:size,height:size,tintColor:color}} source={require('./icons/home.png')}  />)} } name="Home" component={HomeStack} />
                <Tab.Screen options={{tabBarIcon:({ color, size })=>(<Image style={{width:size,height:size,tintColor:color}} source={require('./icons/favorite.png')}  />)} } name="Favorites" component={FavoritesStack} />
            </Tab.Navigator>
        </NavigationContainer>
        </GestureHandlerRootView>
    );
}
