import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from 'react-query';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import AvatarScreen from './screens/AvatarScreen';
import AvatarCreatorScreen from './screens/AvatarCreatorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Chat Stack Navigator
function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen}
        options={{ title: 'Chats' }}
      />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen}
        options={({ route }) => ({ 
          title: route.params?.chatName || 'Chat' 
        })}
      />
    </Stack.Navigator>
  );
}

// Avatar Stack Navigator
function AvatarStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AvatarList" 
        component={AvatarScreen}
        options={{ title: 'My Avatars' }}
      />
      <Stack.Screen 
        name="AvatarCreator" 
        component={AvatarCreatorScreen}
        options={{ title: 'Create Avatar' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'ChatStack') {
            iconName = 'chat';
          } else if (route.name === 'AvatarStack') {
            iconName = 'account-circle';
          } else {
            iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="ChatStack" 
        component={ChatStackNavigator}
        options={{ tabBarLabel: 'Chats' }}
      />
      <Tab.Screen 
        name="AvatarStack" 
        component={AvatarStackNavigator}
        options={{ tabBarLabel: 'Avatars' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </QueryClientProvider>
  );
}