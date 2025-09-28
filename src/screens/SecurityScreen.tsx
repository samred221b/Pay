// src/screens/SecurityScreen.tsx
// Comprehensive security dashboard with monitoring, controls, and management features.
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SecurityScreenProps {
  onMenuPress?: () => void;
}

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  thumbnail: string;
  lastMotion: string | null;
}

interface Sensor {
  id: string;
  name: string;
  type: 'motion' | 'door' | 'window' | 'smoke' | 'glass-break';
  location: string;
  status: 'active' | 'triggered' | 'offline' | 'low-battery';
  batteryLevel: number;
  lastTriggered: string | null;
  enabled: boolean;
}

interface SecurityAlert {
  id: string;
  type: 'motion' | 'door' | 'smoke' | 'system';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  user: string;
  type: 'arm' | 'disarm' | 'alert' | 'system';
}

const SecurityToggle = ({
  status,
  mode,
  onToggle,
  onModeChange,
}: {
  status: 'armed' | 'disarmed';
  mode: 'home' | 'away';
  onToggle: () => void;
  onModeChange: (mode: 'home' | 'away') => void;
}) => {
  const getStatusColor = (status: string) => {
    return status === 'armed' ? '#ef4444' : '#10b981';
  };

  const getModeColor = (mode: string) => {
    return mode === 'away' ? '#8b5cf6' : '#3b82f6';
  };

  return (
    <View style={styles.securityToggleContainer}>
      <View style={styles.statusSection}>
        <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
          {status.toUpperCase()}
        </Text>
        <TouchableOpacity
          style={[styles.mainToggle, { backgroundColor: getStatusColor(status) }]}
          onPress={onToggle}
        >
          <MaterialIcons
            name="security"
            size={32}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.modeSection}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'home' && { backgroundColor: getModeColor('home') }]}
          onPress={() => onModeChange('home')}
        >
          <MaterialIcons name="home" size={20} color={mode === 'home' ? '#ffffff' : '#6b7280'} />
          <Text style={[styles.modeText, mode === 'home' && styles.modeTextActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'away' && { backgroundColor: getModeColor('away') }]}
          onPress={() => onModeChange('away')}
        >
          <MaterialIcons name="flight" size={20} color={mode === 'away' ? '#ffffff' : '#6b7280'} />
          <Text style={[styles.modeText, mode === 'away' && styles.modeTextActive]}>Away</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CameraThumbnail = ({
  camera,
  onPress,
}: {
  camera: Camera;
  onPress: (camera: Camera) => void;
}) => (
  <TouchableOpacity style={styles.cameraThumbnail} onPress={() => onPress(camera)}>
    <View style={styles.thumbnailContainer}>
      <Text style={styles.cameraIcon}>📹</Text>
      <View style={styles.cameraOverlay}>
        <Text style={styles.cameraName}>{camera.name}</Text>
        <View style={[styles.statusDot, { backgroundColor: camera.status === 'online' ? '#10b981' : '#ef4444' }]} />
      </View>
    </View>
    {camera.lastMotion && (
      <Text style={styles.lastMotion}>Motion: {camera.lastMotion}</Text>
    )}
  </TouchableOpacity>
);

const SensorItem = ({
  sensor,
  onToggle,
}: {
  sensor: Sensor;
  onToggle: (sensorId: string) => void;
}) => {
  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'motion': return '👤';
      case 'door': return '🚪';
      case 'window': return '🪟';
      case 'smoke': return '💨';
      case 'glass-break': return '💥';
      default: return '📡';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'triggered': return '#ef4444';
      case 'offline': return '#6b7280';
      case 'low-battery': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.sensorItem}>
      <View style={styles.sensorLeft}>
        <Text style={styles.sensorIcon}>{getSensorIcon(sensor.type)}</Text>
        <View style={styles.sensorInfo}>
          <Text style={styles.sensorName}>{sensor.name}</Text>
          <Text style={styles.sensorLocation}>{sensor.location}</Text>
          <Text style={[styles.sensorStatus, { color: getStatusColor(sensor.status) }]}>
            {sensor.status.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.sensorRight}>
        <Text style={styles.batteryText}>{sensor.batteryLevel}%</Text>
        <TouchableOpacity
          style={[styles.sensorToggle, sensor.enabled && styles.sensorToggleActive]}
          onPress={() => onToggle(sensor.id)}
        >
          <MaterialIcons
            name={sensor.enabled ? 'toggle-on' : 'toggle-off'}
            size={24}
            color={sensor.enabled ? '#10b981' : '#d1d5db'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AlertItem = ({
  alert,
  onAcknowledge,
}: {
  alert: SecurityAlert;
  onAcknowledge: (alertId: string) => void;
}) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'motion': return '👤';
      case 'door': return '🚪';
      case 'smoke': return '💨';
      case 'system': return '⚙️';
      default: return '⚠️';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <View style={[styles.alertItem, { borderLeftColor: getSeverityColor(alert.severity) }]}>
      <Text style={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
      <View style={styles.alertContent}>
        <View style={styles.alertHeader}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertTime}>{alert.timestamp}</Text>
        </View>
        <Text style={styles.alertMessage}>{alert.message}</Text>
        {!alert.acknowledged && (
          <TouchableOpacity
            style={styles.acknowledgeButton}
            onPress={() => onAcknowledge(alert.id)}
          >
            <Text style={styles.acknowledgeText}>Acknowledge</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const EmergencyButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.emergencyButton} onPress={onPress}>
    <MaterialIcons name="emergency" size={24} color="#ffffff" />
    <Text style={styles.emergencyText}>PANIC ALARM</Text>
  </TouchableOpacity>
);

export default function SecurityScreen({ onMenuPress }: { onMenuPress?: () => void }) {
  const [securityStatus, setSecurityStatus] = useState<'armed' | 'disarmed'>('armed');
  const [securityMode, setSecurityMode] = useState<'home' | 'away'>('home');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [cameras] = useState<Camera[]>([
    {
      id: 'cam1',
      name: 'Front Door',
      location: 'Main Entrance',
      status: 'online',
      thumbnail: '📹',
      lastMotion: '2 min ago',
    },
    {
      id: 'cam2',
      name: 'Living Room',
      location: 'Main Area',
      status: 'online',
      thumbnail: '📹',
      lastMotion: null,
    },
    {
      id: 'cam3',
      name: 'Backyard',
      location: 'Outdoor',
      status: 'offline',
      thumbnail: '📹',
      lastMotion: '1 hour ago',
    },
  ]);

  const [sensors, setSensors] = useState<Sensor[]>([
    {
      id: 'sensor1',
      name: 'Front Door Sensor',
      type: 'door',
      location: 'Main Entrance',
      status: 'active',
      batteryLevel: 85,
      lastTriggered: null,
      enabled: true,
    },
    {
      id: 'sensor2',
      name: 'Living Room Motion',
      type: 'motion',
      location: 'Living Area',
      status: 'triggered',
      batteryLevel: 92,
      lastTriggered: '5 min ago',
      enabled: true,
    },
    {
      id: 'sensor3',
      name: 'Kitchen Window',
      type: 'window',
      location: 'Kitchen',
      status: 'active',
      batteryLevel: 78,
      lastTriggered: null,
      enabled: true,
    },
    {
      id: 'sensor4',
      name: 'Smoke Detector',
      type: 'smoke',
      location: 'Hallway',
      status: 'active',
      batteryLevel: 45,
      lastTriggered: null,
      enabled: true,
    },
  ]);

  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: 'alert1',
      type: 'motion',
      title: 'Motion Detected',
      message: 'Motion detected in Living Room',
      timestamp: '5 min ago',
      acknowledged: false,
      severity: 'medium',
    },
    {
      id: 'alert2',
      type: 'door',
      title: 'Door Opened',
      message: 'Front door opened without disarming',
      timestamp: '15 min ago',
      acknowledged: true,
      severity: 'high',
    },
    {
      id: 'alert3',
      type: 'system',
      title: 'Low Battery',
      message: 'Smoke detector battery at 45%',
      timestamp: '1 hour ago',
      acknowledged: false,
      severity: 'low',
    },
  ]);

  const [logs, setLogs] = useState<SecurityLog[]>([
    {
      id: 'log1',
      timestamp: '2:30 PM',
      event: 'System Armed',
      details: 'Security system armed in Home mode',
      user: 'Alex Johnson',
      type: 'arm',
    },
    {
      id: 'log2',
      timestamp: '2:15 PM',
      event: 'Motion Detected',
      details: 'Living room motion sensor triggered',
      user: 'System',
      type: 'alert',
    },
    {
      id: 'log3',
      timestamp: '1:45 PM',
      event: 'System Disarmed',
      details: 'Security system disarmed',
      user: 'Alex Johnson',
      type: 'disarm',
    },
  ]);

  const toggleSecurity = () => {
    if (securityStatus === 'armed') {
      Alert.alert(
        'Disarm Security',
        'Are you sure you want to disarm the security system?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disarm',
            style: 'destructive',
            onPress: () => setSecurityStatus('disarmed'),
          },
        ]
      );
    } else {
      setSecurityStatus('armed');
    }
  };

  const changeSecurityMode = (mode: 'home' | 'away') => {
    if (securityStatus === 'armed') {
      Alert.alert(
        'Change Security Mode',
        `Switch to ${mode === 'home' ? 'Home' : 'Away'} mode?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Switch',
            onPress: () => setSecurityMode(mode),
          },
        ]
      );
    } else {
      setSecurityMode(mode);
    }
  };

  const toggleSensor = (sensorId: string) => {
    setSensors(prev => prev.map(sensor =>
      sensor.id === sensorId
        ? { ...sensor, enabled: !sensor.enabled }
        : sensor
    ));
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  const openCameraView = (camera: Camera) => {
    setSelectedCamera(camera);
    setShowCameraModal(true);
  };

  const triggerPanicAlarm = () => {
    Alert.alert(
      'Panic Alarm',
      'This will trigger all alarms and notify emergency contacts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Trigger Alarm',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Panic Alarm Activated', 'Emergency services and contacts notified.');
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

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911' },
    { name: 'Neighbor', number: '+1 (555) 123-4567' },
    { name: 'Family Member', number: '+1 (555) 987-6543' },
  ];

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
        onPress={() => console.log('Search security')}
        activeOpacity={0.7}
      >
        <MaterialIcons name="search" size={24} color="#0f172a" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Security Center</Text>
        <Text style={styles.subtitle}>Monitor and control your home security</Text>
      </View>

      {/* Security Toggle */}
      <View style={styles.securitySection}>
        <SecurityToggle
          status={securityStatus}
          mode={securityMode}
          onToggle={toggleSecurity}
          onModeChange={changeSecurityMode}
        />
      </View>

      {/* Emergency Section */}
      <View style={styles.emergencySection}>
        <EmergencyButton onPress={triggerPanicAlarm} />
        <Text style={styles.emergencyNote}>Tap to trigger panic alarm</Text>
      </View>

      {/* Cameras Section */}
      <View style={styles.camerasSection}>
        <Text style={styles.sectionTitle}>Security Cameras</Text>
        <View style={styles.camerasGrid}>
          {cameras.map((camera) => (
            <CameraThumbnail
              key={camera.id}
              camera={camera}
              onPress={openCameraView}
            />
          ))}
        </View>
      </View>

      {/* Sensors Section */}
      <View style={styles.sensorsSection}>
        <Text style={styles.sectionTitle}>Sensors</Text>
        <View style={styles.sensorsList}>
          {sensors.map((sensor) => (
            <SensorItem
              key={sensor.id}
              sensor={sensor}
              onToggle={toggleSensor}
            />
          ))}
        </View>
      </View>

      {/* Recent Alerts */}
      <View style={styles.alertsSection}>
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        <View style={styles.alertsList}>
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onAcknowledge={acknowledgeAlert}
            />
          ))}
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.contactsSection}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.contactsList}>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity key={index} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <MaterialIcons name="call" size={20} color="#10b981" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Security Settings */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Security Settings</Text>
        <TouchableOpacity style={styles.settingsItem}>
          <MaterialIcons name="volume-up" size={20} color="#6b7280" />
          <View style={styles.settingsContent}>
            <Text style={styles.settingsTitle}>Alarm Sounds</Text>
            <Text style={styles.settingsSubtitle}>Configure alarm volume and sounds</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <MaterialIcons name="timer" size={20} color="#6b7280" />
          <View style={styles.settingsContent}>
            <Text style={styles.settingsTitle}>Entry/Exit Delays</Text>
            <Text style={styles.settingsSubtitle}>Set delay times for arming/disarming</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <MaterialIcons name="notifications" size={20} color="#6b7280" />
          <View style={styles.settingsContent}>
            <Text style={styles.settingsTitle}>Alert Preferences</Text>
            <Text style={styles.settingsSubtitle}>Customize security notifications</Text>
          </View>
          <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* Security Logs */}
      <View style={styles.logsSection}>
        <TouchableOpacity
          style={styles.logsButton}
          onPress={() => setShowLogs(true)}
        >
          <MaterialIcons name="history" size={20} color="#6b7280" />
          <Text style={styles.logsButtonText}>View Security Logs</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCameraModal}
        animationType="fade"
        onRequestClose={() => setShowCameraModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCameraModal(false)}
            >
              <MaterialIcons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedCamera?.name} - {selectedCamera?.location}
            </Text>
          </View>
          <View style={styles.cameraView}>
            <Text style={styles.cameraPlaceholder}>📹 Live Camera Feed</Text>
            <Text style={styles.cameraStatus}>
              {selectedCamera?.status === 'online' ? '🟢 Online' : '🔴 Offline'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Logs Modal */}
      <Modal
        visible={showLogs}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLogs(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowLogs(false)}
            >
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Security Logs</Text>
          </View>
          <View style={styles.logsContent}>
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.logItem}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logTime}>{item.timestamp}</Text>
                    <Text style={[styles.logType, {
                      color: item.type === 'arm' ? '#10b981' :
                             item.type === 'disarm' ? '#ef4444' :
                             item.type === 'alert' ? '#f59e0b' : '#6b7280'
                    }]}>
                      {item.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.logEvent}>{item.event}</Text>
                  <Text style={styles.logDetails}>{item.details}</Text>
                  <Text style={styles.logUser}>by {item.user}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

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
  securitySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  securityToggleContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  mainToggle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modeSection: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    gap: 6,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  modeTextActive: {
    color: '#ffffff',
  },
  emergencySection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  emergencyText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  emergencyNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  camerasSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  camerasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cameraThumbnail: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16/9,
    backgroundColor: '#000000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cameraIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  lastMotion: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  sensorsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sensorsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  sensorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sensorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sensorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  sensorLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  sensorStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sensorRight: {
    alignItems: 'center',
    gap: 8,
  },
  batteryText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  sensorToggle: {
    padding: 4,
  },
  sensorToggleActive: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
  },
  alertsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  alertsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderRadius: 4,
  },
  alertIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  alertTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  alertMessage: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 8,
  },
  acknowledgeButton: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  acknowledgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e40af',
  },
  contactsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contactsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  contactNumber: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  settingsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingsContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  logsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  logsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logsButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#0f172a',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  cameraPlaceholder: {
    fontSize: 48,
    color: '#ffffff',
    marginBottom: 16,
  },
  cameraStatus: {
    fontSize: 16,
    color: '#ffffff',
  },
  logsContent: {
    flex: 1,
    padding: 16,
  },
  logItem: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#e5e7eb',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  logType: {
    fontSize: 12,
    fontWeight: '600',
  },
  logEvent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  logUser: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  bottomSpacing: {
    height: 32,
  },
});
