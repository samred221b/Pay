import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Dimensions, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LightsScreen from '../screens/LightsScreen';
import DoorsScreen from '../screens/DoorsScreen';
import ThermostatScreen from '../screens/ThermostatScreen';
import SecurityScreen from '../screens/SecurityScreen';
import ScenesScreen from '../screens/ScenesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

const { width } = Dimensions.get('window');

const drawerItems = [
  { name: 'Home', title: 'Home', icon: '🏠' },
  { name: 'Lights', title: 'Lights', icon: '💡' },
  { name: 'Doors', title: 'Doors', icon: '🚪' },
  { name: 'Climate', title: 'Climate', icon: '🌡️' },
  { name: 'Security', title: 'Security', icon: '🔒' },
  { name: 'Scenes', title: 'Scenes', icon: '⚡' },
  { name: 'Settings', title: 'Settings', icon: '⚙️' },
];

const DrawerItem = ({
  item,
  isActive,
  onPress
}: {
  item: typeof drawerItems[0];
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[
      styles.drawerItem,
      isActive && styles.drawerItemActive,
    ]}
    onPress={onPress}
  >
    <Text style={styles.drawerIcon}>{item.icon}</Text>
    <Text style={[
      styles.drawerText,
      isActive && styles.drawerTextActive,
    ]}>
      {item.title}
    </Text>
  </TouchableOpacity>
);

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { logout, user } = useAuth();

  return (
    <View style={styles.drawerContainer}>
      {/* Drawer Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.userProfile}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={32} color="#ffffff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userName}>{user?.username || 'User'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <MaterialIcons name="logout" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Navigation Items */}
      <View style={styles.navigationList}>
        {drawerItems.map((item) => (
          <DrawerItem
            key={item.name}
            item={item}
            isActive={props.state.routes[props.state.index].name === item.name}
            onPress={() => {
              props.navigation.navigate(item.name);
              props.navigation.closeDrawer();
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: width * 0.7,
          backgroundColor: '#ffffff',
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Lights" component={LightsScreen} />
      <Drawer.Screen name="Doors" component={DoorsScreen} />
      <Drawer.Screen name="Climate" component={ThermostatScreen} />
      <Drawer.Screen name="Security" component={SecurityScreen} />
      <Drawer.Screen name="Scenes" component={ScenesScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  navigationList: {
    flex: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  drawerItemActive: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 3,
    borderLeftColor: '#2196f3',
  },
  drawerIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  drawerText: {
    fontSize: 15,
    color: '#5f6368',
    fontWeight: '400',
  },
  drawerTextActive: {
    color: '#1976d2',
    fontWeight: '500',
  },
});
