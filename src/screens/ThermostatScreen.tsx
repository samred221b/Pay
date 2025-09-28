// src/screens/ThermostatScreen.tsx
// Enhanced climate screen with individual room temperature controls.
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface RoomClimateState {
  salon: {
    temperature: number;
    power: boolean;
    mode: 'cool' | 'heat' | 'auto' | 'fan';
    humidity: number;
    lastAdjusted: string;
  };
  bedroom: {
    temperature: number;
    power: boolean;
    mode: 'cool' | 'heat' | 'auto' | 'fan';
    humidity: number;
    lastAdjusted: string;
  };
  kitchen: {
    temperature: number;
    power: boolean;
    mode: 'cool' | 'heat' | 'auto' | 'fan';
    humidity: number;
    lastAdjusted: string;
  };
  bathroom: {
    temperature: number;
    power: boolean;
    mode: 'cool' | 'heat' | 'auto' | 'fan';
    humidity: number;
    lastAdjusted: string;
  };
  court: {
    temperature: number;
    power: boolean;
    mode: 'cool' | 'heat' | 'auto' | 'fan';
    humidity: number;
    lastAdjusted: string;
  };
}

interface ThermostatScreenProps {
  onMenuPress?: () => void;
}

const RoomClimateCard = ({
  roomName,
  climateData,
  onTemperatureChange,
  onPowerToggle,
  onModeChange,
}: {
  roomName: string;
  climateData: RoomClimateState[keyof RoomClimateState];
  onTemperatureChange: (delta: number) => void;
  onPowerToggle: () => void;
  onModeChange: (mode: 'cool' | 'heat' | 'auto' | 'fan') => void;
}) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'cool': return '❄️';
      case 'heat': return '🔥';
      case 'auto': return '⚙️';
      case 'fan': return '💨';
      default: return '❄️';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'cool': return '#3b82f6';
      case 'heat': return '#ef4444';
      case 'auto': return '#8b5cf6';
      case 'fan': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <View style={[styles.roomCard, climateData.power && styles.roomCardActive]}>
      <View style={styles.roomHeader}>
        <View style={styles.roomInfo}>
          <Text style={[styles.roomName, climateData.power && styles.roomNameActive]}>
            {roomName}
          </Text>
          <Text style={styles.lastAdjusted}>
            Last adjusted at {climateData.lastAdjusted}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.powerButton, climateData.power && styles.powerButtonActive]}
          onPress={onPowerToggle}
        >
          <MaterialIcons
            name={climateData.power ? "power-settings-new" : "power-off"}
            size={20}
            color={climateData.power ? "#ffffff" : "#6b7280"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.climateControls}>
        {/* Temperature Display and Controls */}
        <View style={styles.temperatureSection}>
          <TouchableOpacity
            style={styles.tempButton}
            onPress={() => onTemperatureChange(-1)}
            disabled={!climateData.power}
          >
            <MaterialIcons name="remove" size={20} color={climateData.power ? "#374151" : "#d1d5db"} />
          </TouchableOpacity>

          <View style={styles.temperatureDisplay}>
            <Text style={[styles.temperature, climateData.power && styles.temperatureActive]}>
              {climateData.temperature}°C
            </Text>
          </View>

          <TouchableOpacity
            style={styles.tempButton}
            onPress={() => onTemperatureChange(1)}
            disabled={!climateData.power}
          >
            <MaterialIcons name="add" size={20} color={climateData.power ? "#374151" : "#d1d5db"} />
          </TouchableOpacity>
        </View>

        {/* Mode and Humidity */}
        <View style={styles.secondaryInfo}>
          <View style={styles.modeSelector}>
            {(['cool', 'heat', 'auto', 'fan'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeButton,
                  climateData.mode === mode && { backgroundColor: getModeColor(mode) }
                ]}
                onPress={() => onModeChange(mode)}
                disabled={!climateData.power}
              >
                <Text style={[
                  styles.modeButtonText,
                  climateData.mode === mode && styles.modeButtonTextActive
                ]}>
                  {getModeIcon(mode)} {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.humidityDisplay}>
            <MaterialIcons name="opacity" size={16} color="#6b7280" />
            <Text style={styles.humidityText}>
              {climateData.humidity}% Humidity
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ThermostatScreen() {
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const [roomClimate, setRoomClimate] = useState<RoomClimateState>({
    salon: {
      temperature: 22,
      power: true,
      mode: 'cool',
      humidity: 45,
      lastAdjusted: '2:15 PM',
    },
    bedroom: {
      temperature: 20,
      power: false,
      mode: 'heat',
      humidity: 50,
      lastAdjusted: 'Never',
    },
    kitchen: {
      temperature: 24,
      power: true,
      mode: 'auto',
      humidity: 40,
      lastAdjusted: '1:30 PM',
    },
    bathroom: {
      temperature: 23,
      power: true,
      mode: 'fan',
      humidity: 60,
      lastAdjusted: '3:45 PM',
    },
    court: {
      temperature: 25,
      power: false,
      mode: 'cool',
      humidity: 35,
      lastAdjusted: 'Never',
    },
  });

  const updateRoomClimate = (
    room: keyof RoomClimateState,
    updates: Partial<RoomClimateState[keyof RoomClimateState]>
  ) => {
    setRoomClimate(prev => ({
      ...prev,
      [room]: {
        ...prev[room],
        ...updates,
        lastAdjusted: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
      },
    }));
  };

  const adjustTemperature = (room: keyof RoomClimateState, delta: number) => {
    const current = roomClimate[room];
    const newTemp = Math.max(16, Math.min(30, current.temperature + delta));
    updateRoomClimate(room, { temperature: newTemp });
  };

  const togglePower = (room: keyof RoomClimateState) => {
    const current = roomClimate[room];
    updateRoomClimate(room, { power: !current.power });
  };

  const changeMode = (room: keyof RoomClimateState, mode: 'cool' | 'heat' | 'auto' | 'fan') => {
    updateRoomClimate(room, { mode });
  };

  const activeRooms = Object.values(roomClimate).filter(room => room.power).length;
  const totalRooms = Object.keys(roomClimate).length;

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
        onPress={() => navigation.openDrawer()}
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
        <Text style={styles.title}>Climate Control</Text>
        <Text style={styles.subtitle}>
          {activeRooms} of {totalRooms} rooms active
        </Text>
      </View>

      {/* Room Climate Controls */}
      <View style={styles.roomsContainer}>
        {Object.entries(roomClimate).map(([roomKey, roomData]) => (
          <RoomClimateCard
            key={roomKey}
            roomName={roomKey.charAt(0).toUpperCase() + roomKey.slice(1)}
            climateData={roomData}
            onTemperatureChange={(delta) => adjustTemperature(roomKey as keyof RoomClimateState, delta)}
            onPowerToggle={() => togglePower(roomKey as keyof RoomClimateState)}
            onModeChange={(mode) => changeMode(roomKey as keyof RoomClimateState, mode)}
          />
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => {
            // Set all to 22°C and auto mode
            const updates: Partial<RoomClimateState[keyof RoomClimateState]> = {
              temperature: 22,
              mode: 'auto',
              power: true,
            };
            Object.keys(roomClimate).forEach(room => {
              updateRoomClimate(room as keyof RoomClimateState, updates);
            });
          }}
        >
          <MaterialIcons name="settings" size={20} color="#8b5cf6" />
          <Text style={styles.quickActionText}>Auto 22°C</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => {
            // Turn off all climate control
            Object.keys(roomClimate).forEach(room => {
              updateRoomClimate(room as keyof RoomClimateState, { power: false });
            });
          }}
        >
          <MaterialIcons name="power-off" size={20} color="#ef4444" />
          <Text style={styles.quickActionText}>All Off</Text>
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
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  roomNameActive: {
    color: '#0ea5e9',
  },
  lastAdjusted: {
    fontSize: 12,
    color: '#6b7280',
  },
  powerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  powerButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0284c7',
  },
  climateControls: {
    gap: 16,
  },
  temperatureSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  tempButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  temperatureDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  temperature: {
    fontSize: 32,
    fontWeight: '600',
    color: '#374151',
  },
  temperatureActive: {
    color: '#0ea5e9',
  },
  secondaryInfo: {
    gap: 12,
  },
  modeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  humidityDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  humidityText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
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
