// src/screens/DoorsScreen.tsx
// Enhanced doors screen with individual room controls and visual feedback.
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface RoomDoorState {
  salon: boolean;
  bedroom: boolean;
  kitchen: boolean;
  bathroom: boolean;
  court: boolean;
}

interface DoorChangeRecord {
  [room: string]: string;
}

interface DoorsScreenProps {
  onMenuPress?: () => void;
}

const RoomDoorCard = ({
  roomName,
  isLocked,
  onToggle,
  lastChanged,
}: {
  roomName: string;
  isLocked: boolean;
  onToggle: (value: boolean) => void;
  lastChanged: string;
}) => (
  <View style={[styles.roomCard, isLocked && styles.roomCardLocked]}>
    <View style={styles.roomInfo}>
      <MaterialIcons
        name={isLocked ? "lock" : "lock-open"}
        size={24}
        color={isLocked ? '#ef4444' : '#10b981'}
      />
      <View style={styles.roomDetails}>
        <Text style={[styles.roomName, isLocked && styles.roomNameLocked]}>
          {roomName}
        </Text>
        <Text style={styles.lastChanged}>
          Last changed at {lastChanged}
        </Text>
      </View>
    </View>
    <View style={styles.switchContainer}>
      <Text style={[styles.statusText, isLocked ? styles.lockedText : styles.unlockedText]}>
        {isLocked ? 'LOCKED' : 'UNLOCKED'}
      </Text>
      <Switch
        value={isLocked}
        onValueChange={onToggle}
        trackColor={{ false: '#10b981', true: '#ef4444' }}
        thumbColor={isLocked ? '#dc2626' : '#059669'}
      />
    </View>
  </View>
);

export default function DoorsScreen({ onMenuPress }: { onMenuPress?: () => void }) {
  const [roomDoors, setRoomDoors] = useState<RoomDoorState>({
    salon: true,
    bedroom: true,
    kitchen: true,
    bathroom: false,
    court: true,
  });

  const [doorChanges, setDoorChanges] = useState<DoorChangeRecord>({
    salon: '6:43 PM',
    bedroom: '6:45 PM',
    kitchen: '6:47 PM',
    bathroom: 'Never',
    court: '6:50 PM',
  });

  const toggleRoomDoor = (room: keyof RoomDoorState) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    setRoomDoors(prev => ({
      ...prev,
      [room]: !prev[room],
    }));

    setDoorChanges(prev => ({
      ...prev,
      [room]: timeString,
    }));
  };

  const totalDoorsLocked = Object.values(roomDoors).filter(Boolean).length;
  const totalDoors = Object.keys(roomDoors).length;

  const handleSearch = () => {
    // Placeholder function for search functionality
    console.log('Search button pressed');
    // TODO: Implement search functionality
  };

  const lockAllDoors = () => {
    setRoomDoors({
      salon: true,
      bedroom: true,
      kitchen: true,
      bathroom: true,
      court: true,
    });
  };

  const unlockAllDoors = () => {
    setRoomDoors({
      salon: false,
      bedroom: false,
      kitchen: false,
      bathroom: false,
      court: false,
    });
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
        onPress={handleSearch}
        activeOpacity={0.7}
      >
        <MaterialIcons name="search" size={24} color="#0f172a" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Door Security</Text>
        <Text style={styles.subtitle}>
          {totalDoorsLocked} of {totalDoors} doors locked
        </Text>
      </View>

      {/* Room Door Controls */}
      <View style={styles.roomsContainer}>
        <RoomDoorCard
          roomName="Salon"
          isLocked={roomDoors.salon}
          onToggle={(value) => toggleRoomDoor('salon')}
          lastChanged={doorChanges.salon}
        />
        <RoomDoorCard
          roomName="Bedroom"
          isLocked={roomDoors.bedroom}
          onToggle={(value) => toggleRoomDoor('bedroom')}
          lastChanged={doorChanges.bedroom}
        />
        <RoomDoorCard
          roomName="Kitchen"
          isLocked={roomDoors.kitchen}
          onToggle={(value) => toggleRoomDoor('kitchen')}
          lastChanged={doorChanges.kitchen}
        />
        <RoomDoorCard
          roomName="Bathroom"
          isLocked={roomDoors.bathroom}
          onToggle={(value) => toggleRoomDoor('bathroom')}
          lastChanged={doorChanges.bathroom}
        />
        <RoomDoorCard
          roomName="Court"
          isLocked={roomDoors.court}
          onToggle={(value) => toggleRoomDoor('court')}
          lastChanged={doorChanges.court}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.quickActionButton, styles.lockAllButton]}
          onPress={lockAllDoors}
        >
          <MaterialIcons name="lock" size={20} color="#dc2626" />
          <Text style={[styles.quickActionText, styles.lockAllText]}>Lock All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickActionButton, styles.unlockAllButton]}
          onPress={unlockAllDoors}
        >
          <MaterialIcons name="lock-open" size={20} color="#059669" />
          <Text style={[styles.quickActionText, styles.unlockAllText]}>Unlock All</Text>
        </TouchableOpacity>
      </View>

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
  roomCardLocked: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  roomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roomDetails: {
    marginLeft: 12,
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  roomNameLocked: {
    color: '#dc2626',
    fontWeight: '600',
  },
  lastChanged: {
    fontSize: 12,
    color: '#6b7280',
  },
  switchContainer: {
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  lockedText: {
    color: '#dc2626',
  },
  unlockedText: {
    color: '#059669',
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
  lockAllButton: {
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  unlockAllButton: {
    borderColor: '#a7f3d0',
    backgroundColor: '#f0fdf4',
  },
  lockAllText: {
    color: '#dc2626',
  },
  unlockAllText: {
    color: '#059669',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 32,
  },
});
