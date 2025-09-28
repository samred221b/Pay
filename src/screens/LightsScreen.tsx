// src/screens/LightsScreen.tsx
// Enhanced lights screen with individual room controls and visual feedback.
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LightChangeRecord {
  salon: string;
  bedroom: string;
  kitchen: string;
  bathroom: string;
  court: string;
}

interface RoomLightState {
  salon: boolean;
  bedroom: boolean;
  kitchen: boolean;
  bathroom: boolean;
  court: boolean;
}

interface LightsScreenProps {
  // No props needed since we're using drawer navigation
}

const RoomLightCard = ({
  roomName,
  isOn,
  onToggle,
}: {
  roomName: string;
  isOn: boolean;
  onToggle: (value: boolean) => void;
}) => (
  <View style={[styles.roomCard, isOn && styles.roomCardActive]}>
    <View style={styles.roomInfo}>
      <MaterialIcons
        name="lightbulb"
        size={24}
        color={isOn ? '#f59e0b' : '#d1d5db'}
      />
      <Text style={[styles.roomName, isOn && styles.roomNameActive]}>
        {roomName}
      </Text>
    </View>
    <Switch
      value={isOn}
      onValueChange={onToggle}
      trackColor={{ false: '#d1d5db', true: '#fbbf24' }}
      thumbColor={isOn ? '#f59e0b' : '#f3f4f6'}
    />
  </View>
);

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
      case 'light':
        return '💡';
      case 'action':
        return '⚡';
      default:
        return '📱';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'light':
        return '#f59e0b';
      case 'action':
        return '#10b981';
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
      </View>
    </TouchableOpacity>
  );
};

export default function LightsScreen({ onMenuPress }: { onMenuPress?: () => void }) {
  const [roomLights, setRoomLights] = useState<RoomLightState>({
    salon: true,
    bedroom: false,
    kitchen: false,
    bathroom: false,
    court: false,
  });

  const [lightChanges, setLightChanges] = useState<LightChangeRecord>({
    salon: '6:30 PM',
    bedroom: 'Never',
    kitchen: 'Never',
    bathroom: 'Never',
    court: 'Never',
  });

  const toggleRoomLight = (room: keyof RoomLightState) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    setRoomLights(prev => ({
      ...prev,
      [room]: !prev[room],
    }));

    setLightChanges(prev => ({
      ...prev,
      [room]: timeString,
    }));
  };

  const totalRoomsOn = Object.values(roomLights).filter(Boolean).length;
  const totalRooms = Object.keys(roomLights).length;

  // Search state
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputRef, setSearchInputRef] = useState<TextInput | null>(null);

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

  // Search data structure
  const searchData = [
    // Room lights
    ...Object.entries(roomLights).map(([roomKey, isOn]) => ({
      id: `light-${roomKey}`,
      type: 'light',
      title: `${roomKey.charAt(0).toUpperCase() + roomKey.slice(1)} Lights`,
      subtitle: isOn ? 'Currently on' : 'Currently off',
      data: { room: roomKey, isOn }
    })),
    // Quick actions
    { id: 'all-on', type: 'action', title: 'Turn All Lights On', subtitle: 'Quick action', data: 'all-on' },
    { id: 'all-off', type: 'action', title: 'Turn All Lights Off', subtitle: 'Quick action', data: 'all-off' }
  ];

  // Filter search results
  const filteredSearchResults = searchQuery.trim()
    ? searchData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
                placeholder="Search lights and actions..."
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
                  Find room lights and quick actions
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
                  Try searching for "Salon", "Lights", or "On"
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        /* Normal Lights Content */
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Room Lights</Text>
            <Text style={styles.subtitle}>
              {totalRoomsOn} of {totalRooms} rooms lit
            </Text>
          </View>

          {/* Room Light Controls */}
          <View style={styles.roomsContainer}>
            <RoomLightCard
              roomName="Salon"
              isOn={roomLights.salon}
              onToggle={(value) => toggleRoomLight('salon')}
            />
            <RoomLightCard
              roomName="Bedroom"
              isOn={roomLights.bedroom}
              onToggle={(value) => toggleRoomLight('bedroom')}
            />
            <RoomLightCard
              roomName="Kitchen"
              isOn={roomLights.kitchen}
              onToggle={(value) => toggleRoomLight('kitchen')}
            />
            <RoomLightCard
              roomName="Bathroom"
              isOn={roomLights.bathroom}
              onToggle={(value) => toggleRoomLight('bathroom')}
            />
            <RoomLightCard
              roomName="Court"
              isOn={roomLights.court}
              onToggle={(value) => toggleRoomLight('court')}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => {
                // Turn all lights on
                setRoomLights({
                  salon: true,
                  bedroom: true,
                  kitchen: true,
                  bathroom: true,
                  court: true,
                });
              }}
            >
              <MaterialIcons name="lightbulb" size={20} color="#10b981" />
              <Text style={styles.quickActionText}>All On</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => {
                // Turn all lights off
                setRoomLights({
                  salon: false,
                  bedroom: false,
                  kitchen: false,
                  bathroom: false,
                  court: false,
                });
              }}
            >
              <MaterialIcons name="lightbulb-outline" size={20} color="#ef4444" />
              <Text style={styles.quickActionText}>All Off</Text>
            </TouchableOpacity>
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
  roomsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  roomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  roomCardActive: {
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  roomNameActive: {
    color: '#92400e',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  bottomSpacing: {
    height: 32,
  },
});
