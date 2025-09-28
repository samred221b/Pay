// src/screens/HomeScreen.tsx
// Comprehensive smart home welcome screen with dashboard functionality.
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface RoomData {
  id: string;
  name: string;
  lights: boolean;
  doors: boolean;
  climate: {
    temperature: number;
    isActive: boolean;
    mode: 'cool' | 'heat' | 'auto';
  };
  lastUpdated: string;
}

interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  location: string;
}

interface Scene {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: string;
}

const RoomCard = ({
  room,
  onLightToggle,
  onDoorToggle,
  onClimatePress,
}: {
  room: RoomData;
  onLightToggle: (roomId: string) => void;
  onDoorToggle: (roomId: string) => void;
  onClimatePress: (room: RoomData) => void;
}) => {
  const getClimateIcon = (mode: string) => {
    switch (mode) {
      case 'cool': return '❄️';
      case 'heat': return '🔥';
      case 'auto': return '⚙️';
      default: return '🌡️';
    }
  };

  const getClimateColor = (mode: string) => {
    switch (mode) {
      case 'cool': return '#3b82f6';
      case 'heat': return '#ef4444';
      case 'auto': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.roomCard}>
      <View style={styles.roomHeader}>
        <Text style={styles.roomName}>{room.name}</Text>
        <TouchableOpacity
          style={styles.climateButton}
          onPress={() => onClimatePress(room)}
        >
          <Text style={styles.climateIcon}>{getClimateIcon(room.climate.mode)}</Text>
          <Text style={[styles.climateTemp, { color: getClimateColor(room.climate.mode) }]}>
            {room.climate.temperature}°C
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.roomControls}>
        {/* Lights Control */}
        <TouchableOpacity
          style={[styles.controlButton, room.lights && styles.controlButtonActive]}
          onPress={() => onLightToggle(room.id)}
        >
          <MaterialIcons
            name="lightbulb"
            size={20}
            color={room.lights ? '#f59e0b' : '#9ca3af'}
          />
          <Text style={[styles.controlText, room.lights && styles.controlTextActive]}>
            {room.lights ? 'ON' : 'OFF'}
          </Text>
        </TouchableOpacity>

        {/* Doors Control */}
        <TouchableOpacity
          style={[styles.controlButton, room.doors && styles.controlButtonActive]}
          onPress={() => onDoorToggle(room.id)}
        >
          <MaterialIcons
            name={room.doors ? "lock" : "lock-open"}
            size={20}
            color={room.doors ? '#10b981' : '#ef4444'}
          />
          <Text style={[styles.controlText, room.doors ? styles.controlTextActive : styles.controlTextLocked]}>
            {room.doors ? 'LOCKED' : 'OPEN'}
          </Text>
        </TouchableOpacity>

        {/* Climate Status */}
        <View style={[styles.controlButton, room.climate.isActive && styles.controlButtonActive]}>
          <Text style={[styles.climateIconSmall, room.climate.isActive && { color: getClimateColor(room.climate.mode) }]}>
            {getClimateIcon(room.climate.mode)}
          </Text>
          <Text style={[styles.controlText, room.climate.isActive && styles.controlTextActive]}>
            {room.climate.mode.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const WeatherWidget = ({ weather }: { weather: WeatherData }) => (
  <View style={styles.weatherWidget}>
    <View style={styles.weatherIconContainer}>
      <Text style={styles.weatherIcon}>{weather.icon}</Text>
    </View>
    <View style={styles.weatherInfo}>
      <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
      <Text style={styles.weatherCondition}>{weather.condition}</Text>
      <Text style={styles.weatherLocation}>{weather.location}</Text>
    </View>
  </View>
);

const QuickActionButton = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.quickActionButton, { borderColor: color }]} onPress={onPress}>
    <MaterialIcons name={icon} size={20} color={color} />
    <Text style={[styles.quickActionText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const ScenePreview = ({
  scene,
  onActivate,
}: {
  scene: Scene;
  onActivate: (sceneId: string) => void;
}) => {
  const getSceneIcon = (iconName: string) => {
    switch (iconName) {
      case 'morning': return '🌅';
      case 'evening': return '🌆';
      case 'movie': return '🎬';
      case 'sleep': return '😴';
      default: return '⚡';
    }
  };

  return (
    <TouchableOpacity style={styles.scenePreview} onPress={() => onActivate(scene.id)}>
      <Text style={styles.scenePreviewIcon}>{getSceneIcon(scene.icon)}</Text>
      <View style={styles.scenePreviewInfo}>
        <Text style={styles.scenePreviewName}>{scene.name}</Text>
        <MaterialIcons name="play-arrow" size={16} color="#10b981" />
      </View>
    </TouchableOpacity>
  );
};

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <View style={[styles.notificationItem, { borderLeftColor: getNotificationColor(notification.type) }]}>
      <Text style={styles.notificationIcon}>{getNotificationIcon(notification.type)}</Text>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.timestamp}</Text>
      </View>
    </View>
  );
};

const SearchResultItem = ({
  item,
  onPress,
}: {
  item: {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    data: any;
  };
  onPress: () => void;
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'room':
        return '🏠';
      case 'action':
        return '⚡';
      case 'scene':
        return '🎬';
      default:
        return '📱';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'room':
        return '#10b981';
      case 'action':
        return '#f59e0b';
      case 'scene':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <TouchableOpacity style={styles.searchResultItem} onPress={onPress}>
      <View style={[styles.searchResultIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
        <Text style={{ fontSize: 20 }}>{getTypeIcon(item.type)}</Text>
      </View>
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultTitle}>{item.title}</Text>
        <Text style={styles.searchResultSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={[styles.searchResultBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
        <Text style={[styles.searchResultBadgeText, { color: getTypeColor(item.type) }]}>
          {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ onMenuPress }: { onMenuPress?: () => void }) {
  const [rooms, setRooms] = useState<RoomData[]>([
    {
      id: 'salon',
      name: 'Salon',
      lights: true,
      doors: false,
      climate: { temperature: 22, isActive: true, mode: 'cool' },
      lastUpdated: '2 min ago',
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      lights: false,
      doors: true,
      climate: { temperature: 20, isActive: false, mode: 'heat' },
      lastUpdated: '15 min ago',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      lights: true,
      doors: true,
      climate: { temperature: 24, isActive: true, mode: 'auto' },
      lastUpdated: '1 hour ago',
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      lights: false,
      doors: true,
      climate: { temperature: 23, isActive: true, mode: 'auto' },
      lastUpdated: '30 min ago',
    },
    {
      id: 'court',
      name: 'Court',
      lights: false,
      doors: true,
      climate: { temperature: 25, isActive: false, mode: 'cool' },
      lastUpdated: 'Never',
    },
  ]);

  const [weather, setWeather] = useState<WeatherData>({
    temperature: 24,
    condition: 'Sunny',
    icon: '☀️',
    location: 'Addis Ababa',
  });

  const [scenes, setScenes] = useState<Scene[]>([
    { id: 'morning', name: 'Morning Routine', icon: 'morning', isActive: false },
    { id: 'evening', name: 'Evening Relax', icon: 'evening', isActive: true },
    { id: 'movie', name: 'Movie Time', icon: 'movie', isActive: false },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Security Alert',
      message: 'Front door unlocked for 30 minutes',
      type: 'warning',
      timestamp: '2 min ago',
    },
    {
      id: '2',
      title: 'Energy Usage',
      message: 'Kitchen lights left on overnight',
      type: 'info',
      timestamp: '1 hour ago',
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Search state
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputRef, setSearchInputRef] = useState<TextInput | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleRoomLight = (roomId: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, lights: !room.lights, lastUpdated: 'Just now' }
        : room
    ));
  };

  const toggleRoomDoor = (roomId: string) => {
    setRooms(prev => prev.map(room =>
      room.id === roomId
        ? { ...room, doors: !room.doors, lastUpdated: 'Just now' }
        : room
    ));
  };

  const openClimateControl = (room: RoomData) => {
    Alert.alert(
      `${room.name} Climate Control`,
      `Current: ${room.climate.temperature}°C (${room.climate.mode.toUpperCase()})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Adjust',
          onPress: () => {
            // Navigate to climate screen or show modal
            navigateToScreen('Climate');
            console.log('Open climate control for', room.name);
          }
        }
      ]
    );
  };

  const activateScene = (sceneId: string) => {
    setScenes(prev => prev.map(scene =>
      scene.id === sceneId
        ? { ...scene, isActive: !scene.isActive }
        : scene
    ));
    // Navigate to scenes screen for more options
    navigateToScreen('Scenes');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDateTime = () => {
    return currentTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSearch = () => {
    setIsSearchActive(true);
    setSearchQuery('');
    // Focus the search input after a short delay to ensure it's rendered
    setTimeout(() => {
      searchInputRef?.focus();
    }, 100);
  };

  const closeSearch = () => {
    setIsSearchActive(false);
    setSearchQuery('');
  };

  const quickActions = [
    { icon: 'lightbulb-outline', label: 'All Lights Off', color: '#ef4444', action: () => navigateToScreen('Lights') },
    { icon: 'security', label: 'Arm Security', color: '#10b981', action: () => navigateToScreen('Security') },
    { icon: 'play-arrow', label: 'Evening Scene', color: '#8b5cf6', action: () => navigateToScreen('Scenes') },
  ];

  // Search data structure
  const searchData = [
    // Rooms
    ...rooms.map(room => ({
      id: room.id,
      type: 'room',
      title: room.name,
      subtitle: `${room.lights ? 'Lights on' : 'Lights off'} • ${room.doors ? 'Door locked' : 'Door unlocked'} • ${room.climate.temperature}°C`,
      data: room
    })),
    // Quick Actions
    ...quickActions.map(action => ({
      id: action.label.toLowerCase().replace(/\s+/g, '-'),
      type: 'action',
      title: action.label,
      subtitle: 'Quick action',
      data: action
    })),
    // Scenes
    ...scenes.map(scene => ({
      id: scene.id,
      type: 'scene',
      title: scene.name,
      subtitle: scene.isActive ? 'Active scene' : 'Available scene',
      data: scene
    }))
  ];

  // Filter search results
  const filteredSearchResults = searchQuery.trim()
    ? searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const navigateToScreen = (screenName: string) => {
    console.log('Navigating to:', screenName);
    // This will be handled by the parent component
  };

  const activeRooms = rooms.filter(room => room.lights || room.doors || room.climate.isActive).length;

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
        onPress={handleSearch}
        activeOpacity={0.7}
      >
        <MaterialIcons name="search" size={24} color="#0f172a" />
      </TouchableOpacity>

      {isSearchActive ? (
        /* Search UI */
        <View style={styles.searchContainer}>
          {/* Search Header */}
          <View style={styles.searchHeader}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color="#6b7280" />
              <TextInput
                ref={(ref) => setSearchInputRef(ref)}
                style={styles.searchInput}
                placeholder="Search rooms, devices, scenes..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={closeSearch} style={styles.clearButton}>
                  <MaterialIcons name="close" size={20} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={closeSearch} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          <View style={styles.searchResults}>
            {searchQuery.trim() === '' ? (
              <View style={styles.searchPrompt}>
                <MaterialIcons name="search" size={48} color="#d1d5db" />
                <Text style={styles.searchPromptText}>Start typing to search</Text>
                <Text style={styles.searchPromptSubtext}>
                  Find rooms, quick actions, and scenes
                </Text>
              </View>
            ) : filteredSearchResults.length > 0 ? (
              filteredSearchResults.map((item) => (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  onPress={() => {
                    // Handle search result selection
                    closeSearch();
                    console.log('Selected:', item.title);
                  }}
                />
              ))
            ) : (
              <View style={styles.noResults}>
                <MaterialIcons name="search-off" size={48} color="#d1d5db" />
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for "Salon", "Lights", or "Morning"
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        /* Normal Home Content */
        <>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.welcomeMessage}>Welcome Home</Text>
            <Text style={styles.dateTime}>{getCurrentDateTime()}</Text>
          </View>

          {/* Weather Widget */}
          <View style={styles.weatherSection}>
            <WeatherWidget weather={weather} />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  icon={action.icon as keyof typeof MaterialIcons.glyphMap}
                  label={action.label}
                  color={action.color}
                  onPress={action.action}
                />
              ))}
            </View>
          </View>

          {/* Rooms Section */}
          <View style={styles.roomsSection}>
            <Text style={styles.sectionTitle}>Room Controls</Text>
            <Text style={styles.sectionSubtitle}>
              {activeRooms} of {rooms.length} rooms active
            </Text>
            <View style={styles.roomsGrid}>
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onLightToggle={toggleRoomLight}
                  onDoorToggle={toggleRoomDoor}
                  onClimatePress={openClimateControl}
                />
              ))}
            </View>
          </View>

          {/* Scenes Preview */}
          <View style={styles.scenesSection}>
            <Text style={styles.sectionTitle}>Favorite Scenes</Text>
            <View style={styles.scenesList}>
              {scenes.map((scene) => (
                <ScenePreview
                  key={scene.id}
                  scene={scene}
                  onActivate={activateScene}
                />
              ))}
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.notificationsSection}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </>
      )}
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
  searchContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 80,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  searchResults: {
    flex: 1,
    padding: 16,
  },
  searchPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  searchPromptText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  searchPromptSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchResultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  searchResultBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  headerSection: {
    padding: 24,
    paddingTop: 80,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  welcomeMessage: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  dateTime: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '400',
    textAlign: 'center',
  },
  weatherSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  weatherWidget: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherIconContainer: {
    marginRight: 16,
  },
  weatherIcon: {
    fontSize: 32,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 2,
  },
  weatherLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  roomsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  roomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  roomCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  climateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  climateIcon: {
    fontSize: 14,
  },
  climateTemp: {
    fontSize: 14,
    fontWeight: '600',
  },
  roomControls: {
    gap: 8,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  controlButtonActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  controlText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 4,
  },
  controlTextActive: {
    color: '#1e40af',
  },
  controlTextLocked: {
    color: '#dc2626',
  },
  climateIconSmall: {
    fontSize: 12,
    marginRight: 4,
  },
  scenesSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scenesList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  scenePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  scenePreviewIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  scenePreviewInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scenePreviewName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  notificationsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  notificationsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderRadius: 4,
  },
  notificationIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
    color: '#9ca3af',
  },
  bottomSpacing: {
    height: 32,
  },
});
