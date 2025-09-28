// src/screens/SettingsScreen.tsx
// Comprehensive settings screen with multiple configuration sections.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingsScreenProps {
  onMenuPress?: () => void;
}

const SettingsSection = ({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: any;
}) => (
  <View style={[styles.section, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const SettingsItem = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress} disabled={!onPress}>
    <View style={styles.itemLeft}>
      <View style={styles.itemIcon}>
        <MaterialIcons name={icon} size={20} color="#6b7280" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <View style={styles.itemRight}>
      {rightElement}
      {showArrow && onPress && (
        <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsToggle = ({
  icon,
  title,
  subtitle,
  value,
  onToggle,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <View style={styles.settingsToggle}>
    <View style={styles.toggleLeft}>
      <View style={styles.itemIcon}>
        <MaterialIcons name={icon} size={20} color="#6b7280" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
    </View>
    <Switch value={value} onValueChange={onToggle} />
  </View>
);

export default function SettingsScreen({ onMenuPress }: { onMenuPress?: () => void }) {
  // User Account State
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: '👤',
  });

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Notification State
  const [notifications, setNotifications] = useState({
    securityAlerts: true,
    deviceStatus: true,
    sceneUpdates: false,
    energyReports: true,
  });

  const [doNotDisturb, setDoNotDisturb] = useState({
    enabled: false,
    startTime: '22:00',
    endTime: '07:00',
  });

  // Home Configuration State
  const [homes, setHomes] = useState([
    { id: 'home1', name: 'Main Home', isDefault: true, roomCount: 5 },
    { id: 'home2', name: 'Vacation Home', isDefault: false, roomCount: 3 },
  ]);

  const [rooms, setRooms] = useState([
    { id: 'room1', name: 'Salon', deviceCount: 5 },
    { id: 'room2', name: 'Bedroom', deviceCount: 3 },
    { id: 'room3', name: 'Kitchen', deviceCount: 7 },
    { id: 'room4', name: 'Bathroom', deviceCount: 2 },
    { id: 'room5', name: 'Court', deviceCount: 1 },
  ]);

  // Device Management State
  const [devices, setDevices] = useState([
    { id: 'device1', name: 'Living Room Lights', type: 'Smart Bulb', status: 'Online', lastSeen: '2 min ago' },
    { id: 'device2', name: 'Thermostat', type: 'Climate Control', status: 'Online', lastSeen: '1 min ago' },
    { id: 'device3', name: 'Front Door Lock', type: 'Smart Lock', status: 'Offline', lastSeen: '1 hour ago' },
    { id: 'device4', name: 'Security Camera', type: 'Camera', status: 'Online', lastSeen: '30 sec ago' },
  ]);

  const [pendingUpdates, setPendingUpdates] = useState(2);

  // Privacy State
  const [privacySettings, setPrivacySettings] = useState({
    twoFactorEnabled: false,
    dataSharing: true,
    analytics: false,
  });

  // Automation State
  const [automationSettings, setAutomationSettings] = useState({
    globalRules: true,
    sceneScheduling: true,
    autoBackup: true,
  });

  // Confirmation handlers
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => console.log('User logged out'),
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will reset all settings and data to factory defaults. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => console.log('App reset to factory defaults'),
        },
      ]
    );
  };

  const handleDeleteHome = (homeId: string, homeName: string) => {
    Alert.alert(
      'Delete Home',
      `Are you sure you want to delete "${homeName}"? This will remove all associated rooms and devices.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setHomes(prev => prev.filter(home => home.id !== homeId));
          },
        },
      ]
    );
  };

  const handleDeleteRoom = (roomId: string, roomName: string) => {
    Alert.alert(
      'Delete Room',
      `Are you sure you want to delete "${roomName}"? This will remove all devices in this room.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setRooms(prev => prev.filter(room => room.id !== roomId));
          },
        },
      ]
    );
  };

  const handleDeleteDevice = (deviceId: string, deviceName: string) => {
    Alert.alert(
      'Remove Device',
      `Are you sure you want to remove "${deviceName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setDevices(prev => prev.filter(device => device.id !== deviceId));
          },
        },
      ]
    );
  };

  const handleSearch = () => {
    // Placeholder function for search functionality
    console.log('Search button pressed');
    // TODO: Implement search functionality
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          console.log('Menu button pressed');
          onMenuPress?.();
        }}
        activeOpacity={0.7}
      >
        <MaterialIcons name="menu" size={24} color="#0f172a" />
      </TouchableOpacity>

      {/* Search Button */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => console.log('Search settings')}
        activeOpacity={0.7}
      >
        <MaterialIcons name="search" size={24} color="#0f172a" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your smart home experience</Text>
      </View>

      {/* User Account Management */}
      <SettingsSection title="Account">
        <SettingsItem
          icon="person"
          title={userProfile.name}
          subtitle={userProfile.email}
          onPress={() => Alert.alert('Edit Profile', 'Navigate to profile editing')}
        />
        <SettingsItem
          icon="lock"
          title="Change Password"
          subtitle="Update your account password"
          onPress={() => Alert.alert('Change Password', 'Navigate to password change')}
        />
        <SettingsItem
          icon="link"
          title="Linked Accounts"
          subtitle="Google, Apple ID, etc."
          onPress={() => Alert.alert('Linked Accounts', 'Manage connected accounts')}
        />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SettingsSection>

      {/* Home Configuration */}
      <SettingsSection title="Home Configuration">
        {homes.map((home) => (
          <View key={home.id} style={styles.homeItem}>
            <View style={styles.homeInfo}>
              <Text style={styles.homeName}>{home.name}</Text>
              <Text style={styles.homeDetails}>{home.roomCount} rooms</Text>
            </View>
            <View style={styles.homeActions}>
              {home.isDefault && (
                <Text style={styles.defaultBadge}>Default</Text>
              )}
              <TouchableOpacity
                style={styles.deleteHomeButton}
                onPress={() => handleDeleteHome(home.id, home.name)}
              >
                <MaterialIcons name="delete" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <SettingsItem
          icon="add-home"
          title="Add New Home"
          onPress={() => Alert.alert('Add Home', 'Navigate to add home flow')}
        />
      </SettingsSection>

      {/* Rooms Management */}
      <SettingsSection title="Rooms">
        {rooms.map((room) => (
          <View key={room.id} style={styles.roomItem}>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{room.name}</Text>
              <Text style={styles.roomDetails}>{room.deviceCount} devices</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteRoomButton}
              onPress={() => handleDeleteRoom(room.id, room.name)}
            >
              <MaterialIcons name="delete" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
        <SettingsItem
          icon="add"
          title="Add New Room"
          onPress={() => Alert.alert('Add Room', 'Navigate to add room flow')}
        />
      </SettingsSection>

      {/* Device Management */}
      <SettingsSection title="Devices">
        {devices.map((device) => (
          <View key={device.id} style={styles.deviceItem}>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.deviceDetails}>{device.type} • {device.status}</Text>
              <Text style={styles.deviceLastSeen}>Last seen: {device.lastSeen}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteDeviceButton}
              onPress={() => handleDeleteDevice(device.id, device.name)}
            >
              <MaterialIcons name="delete" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
        {pendingUpdates > 0 && (
          <View style={styles.updateBanner}>
            <MaterialIcons name="system-update" size={16} color="#f59e0b" />
            <Text style={styles.updateText}>{pendingUpdates} firmware updates available</Text>
          </View>
        )}
        <SettingsItem
          icon="add"
          title="Add New Device"
          subtitle="Setup wizard for new devices"
          onPress={() => Alert.alert('Add Device', 'Navigate to device setup')}
        />
      </SettingsSection>

      {/* Notification Preferences */}
      <SettingsSection title="Notifications">
        <SettingsToggle
          icon="security"
          title="Security Alerts"
          subtitle="Door locks, motion detection"
          value={notifications.securityAlerts}
          onToggle={(value) => setNotifications(prev => ({ ...prev, securityAlerts: value }))}
        />
        <SettingsToggle
          icon="info"
          title="Device Status"
          subtitle="Online/offline notifications"
          value={notifications.deviceStatus}
          onToggle={(value) => setNotifications(prev => ({ ...prev, deviceStatus: value }))}
        />
        <SettingsToggle
          icon="play-arrow"
          title="Scene Updates"
          subtitle="When scenes activate/deactivate"
          value={notifications.sceneUpdates}
          onToggle={(value) => setNotifications(prev => ({ ...prev, sceneUpdates: value }))}
        />
        <SettingsToggle
          icon="bolt"
          title="Energy Reports"
          subtitle="Weekly usage summaries"
          value={notifications.energyReports}
          onToggle={(value) => setNotifications(prev => ({ ...prev, energyReports: value }))}
        />

        <View style={styles.dndSection}>
          <SettingsToggle
            icon="do-not-disturb"
            title="Do Not Disturb"
            subtitle={`${doNotDisturb.startTime} - ${doNotDisturb.endTime}`}
            value={doNotDisturb.enabled}
            onToggle={(value) => setDoNotDisturb(prev => ({ ...prev, enabled: value }))}
          />
        </View>

        <SettingsItem
          icon="notifications"
          title="Notification Settings"
          subtitle="Sounds, vibration, priority"
          onPress={() => Alert.alert('Notification Settings', 'Advanced notification configuration')}
        />
      </SettingsSection>

      {/* Theme & Appearance */}
      <SettingsSection title="Appearance">
        <SettingsToggle
          icon="brightness-6"
          title="Dark Mode"
          subtitle="Toggle between light and dark themes"
          value={isDarkMode}
          onToggle={setIsDarkMode}
        />
        <SettingsToggle
          icon="animation"
          title="Animations"
          subtitle="Enable interface animations"
          value={animationsEnabled}
          onToggle={setAnimationsEnabled}
        />
        <SettingsItem
          icon="color-lens"
          title="Accent Colors"
          subtitle="Customize app colors"
          onPress={() => Alert.alert('Accent Colors', 'Color customization options')}
        />
        <SettingsItem
          icon="text-fields"
          title="Font Size"
          subtitle="Adjust text size"
          onPress={() => Alert.alert('Font Size', 'Text size options')}
        />
      </SettingsSection>

      {/* Privacy & Security */}
      <SettingsSection title="Privacy & Security">
        <SettingsToggle
          icon="security"
          title="Two-Factor Authentication"
          subtitle="Add extra security to your account"
          value={privacySettings.twoFactorEnabled}
          onToggle={(value) => setPrivacySettings(prev => ({ ...prev, twoFactorEnabled: value }))}
        />
        <SettingsToggle
          icon="share"
          title="Data Sharing"
          subtitle="Share usage data for improvements"
          value={privacySettings.dataSharing}
          onToggle={(value) => setPrivacySettings(prev => ({ ...prev, dataSharing: value }))}
        />
        <SettingsToggle
          icon="analytics"
          title="Analytics"
          subtitle="Help improve the app"
          value={privacySettings.analytics}
          onToggle={(value) => setPrivacySettings(prev => ({ ...prev, analytics: value }))}
        />
        <SettingsItem
          icon="privacy-tip"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'View privacy policy and terms')}
        />
        <SettingsItem
          icon="description"
          title="Terms of Service"
          onPress={() => Alert.alert('Terms of Service', 'View terms and conditions')}
        />
      </SettingsSection>

      {/* Automation & Scenes */}
      <SettingsSection title="Automation">
        <SettingsToggle
          icon="rule"
          title="Global Automation Rules"
          subtitle="Enable automatic device control"
          value={automationSettings.globalRules}
          onToggle={(value) => setAutomationSettings(prev => ({ ...prev, globalRules: value }))}
        />
        <SettingsToggle
          icon="schedule"
          title="Scene Scheduling"
          subtitle="Automatic scene activation"
          value={automationSettings.sceneScheduling}
          onToggle={(value) => setAutomationSettings(prev => ({ ...prev, sceneScheduling: value }))}
        />
        <SettingsToggle
          icon="backup"
          title="Auto Backup"
          subtitle="Backup scenes and settings"
          value={automationSettings.autoBackup}
          onToggle={(value) => setAutomationSettings(prev => ({ ...prev, autoBackup: value }))}
        />
        <SettingsItem
          icon="restore"
          title="Backup & Restore"
          subtitle="Manage backups"
          onPress={() => Alert.alert('Backup & Restore', 'Backup and restore options')}
        />
      </SettingsSection>

      {/* App Info */}
      <SettingsSection title="App Information">
        <SettingsItem
          icon="info"
          title="Version"
          subtitle="2.1.0 (Build 145)"
          onPress={() => {}}
          showArrow={false}
        />
        <SettingsItem
          icon="system-update"
          title="Check for Updates"
          subtitle="Download latest features"
          onPress={() => Alert.alert('Check Updates', 'Checking for app updates...')}
        />
        <SettingsItem
          icon="help"
          title="Help & Support"
          subtitle="FAQs, tutorials, contact"
          onPress={() => Alert.alert('Help & Support', 'Access help resources')}
        />
        <SettingsItem
          icon="feedback"
          title="Send Feedback"
          subtitle="Help us improve"
          onPress={() => Alert.alert('Send Feedback', 'Navigate to feedback form')}
        />
        <SettingsItem
          icon="rate-review"
          title="Rate App"
          subtitle="Leave a review"
          onPress={() => Alert.alert('Rate App', 'Navigate to app store')}
        />
      </SettingsSection>

      {/* Advanced Settings */}
      <SettingsSection title="Advanced" style={styles.advancedSection}>
        <SettingsItem
          icon="code"
          title="Developer Options"
          subtitle="Debug and testing tools"
          onPress={() => Alert.alert('Developer Options', 'Advanced debugging tools')}
        />
        <SettingsItem
          icon="bug-report"
          title="Diagnostics"
          subtitle="View logs and system info"
          onPress={() => Alert.alert('Diagnostics', 'System diagnostics and logs')}
        />
        <TouchableOpacity style={styles.resetButton} onPress={handleResetApp}>
          <MaterialIcons name="restore" size={20} color="#ef4444" />
          <Text style={styles.resetText}>Reset to Factory Defaults</Text>
        </TouchableOpacity>
      </SettingsSection>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  menuButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1000,
    // Removed circular background styling - now just the icon
  },
  searchButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    // Search button with same styling as menu button (no background)
  },
  header: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dndSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    marginTop: 8,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
  },
  homeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  homeInfo: {
    flex: 1,
  },
  homeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  homeDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  homeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  deleteHomeButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  roomDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  deleteRoomButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  deviceDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  deviceLastSeen: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 1,
  },
  deleteDeviceButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
  },
  updateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  updateText: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '500',
  },
  advancedSection: {
    borderColor: '#fecaca',
    borderWidth: 1,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    marginTop: 8,
    gap: 8,
  },
  resetText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
  },
  bottomSpacing: {
    height: 32,
  },
});
