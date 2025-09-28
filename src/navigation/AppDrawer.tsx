import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LightsScreen from '../screens/LightsScreen';
import DoorsScreen from '../screens/DoorsScreen';
import ThermostatScreen from '../screens/ThermostatScreen';
import SecurityScreen from '../screens/SecurityScreen';
import ScenesScreen from '../screens/ScenesScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type DrawerParamList = {
  Home: undefined;
  Lights: undefined;
  Doors: undefined;
  Climate: undefined;
  Security: undefined;
  Scenes: undefined;
  Settings: undefined;
};

const navigationItems = [
  { name: 'Home', title: 'Home', icon: '🏠', component: HomeScreen },
  { name: 'Lights', title: 'Lights', icon: '💡', component: LightsScreen },
  { name: 'Doors', title: 'Doors', icon: '🚪', component: DoorsScreen },
  { name: 'Security', title: 'Security', icon: '🔒', component: SecurityScreen },
  { name: 'Scenes', title: 'Scenes', icon: '⚡', component: ScenesScreen },
  { name: 'Settings', title: 'Settings', icon: '⚙️', component: SettingsScreen },
];

function NavigationDrawer({ visible, onClose, onNavigate }: {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screenName: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.drawerContainer}>
          {/* Drawer Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.userProfile}>
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={32} color="#ffffff" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
                <Text style={styles.userName}>Smart Home User</Text>
              </View>
            </View>
          </View>

          {/* Navigation Items */}
          <View style={styles.navigationList}>
            {navigationItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.drawerItem}
                onPress={() => {
                  onNavigate(item.name);
                  onClose();
                }}
              >
                <Text style={styles.drawerIcon}>{item.icon}</Text>
                <Text style={styles.drawerText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function AppDrawer() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Home');

  const handleNavigate = (screenName: string) => {
    setCurrentScreen(screenName);
    setDrawerVisible(false);
  };

  const renderCurrentScreen = () => {
    const currentItem = navigationItems.find(item => item.name === currentScreen);
    const CurrentScreenComponent = currentItem?.component || HomeScreen;

    if (currentScreen === 'Home') {
      return <CurrentScreenComponent onMenuPress={() => setDrawerVisible(true)} />;
    }

    return <CurrentScreenComponent />;
  };

  return (
    <View style={styles.container}>
      <NavigationDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigate={handleNavigate}
      />

      {renderCurrentScreen()}

      {/* Overlay the menu button on top of the current screen */}
      <TouchableOpacity
        style={styles.floatingMenuButton}
        onPress={() => setDrawerVisible(true)}
        activeOpacity={0.7}
      >
        <MaterialIcons name="menu" size={24} color="#0f172a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    width: '70%',
    height: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
  navigationList: {
    flex: 1,
    paddingTop: 16,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
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
  container: {
    flex: 1,
    position: 'relative',
  },
  floatingMenuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
