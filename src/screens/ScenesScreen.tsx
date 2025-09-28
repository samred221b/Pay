// src/screens/ScenesScreen.tsx
// Comprehensive scenes screen with scene management and activation controls.
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Scene {
  id: string;
  name: string;
  icon: string;
  description: string;
  isActive: boolean;
  lastActivated: string | null;
  devices: {
    lights: boolean;
    climate: number; // temperature
    security: boolean;
    doors: boolean;
  };
}

interface ScenesScreenProps {
  onMenuPress?: () => void;
}

const SceneCard = ({
  scene,
  onActivate,
  onEdit,
}: {
  scene: Scene;
  onActivate: (sceneId: string) => void;
  onEdit: (scene: Scene) => void;
}) => {
  const getSceneIcon = (iconName: string) => {
    switch (iconName) {
      case 'morning': return '🌅';
      case 'evening': return '🌆';
      case 'away': return '🏠';
      case 'movie': return '🎬';
      case 'sleep': return '😴';
      default: return '⚡';
    }
  };

  const getSceneColor = (iconName: string) => {
    switch (iconName) {
      case 'morning': return '#f59e0b';
      case 'evening': return '#8b5cf6';
      case 'away': return '#ef4444';
      case 'movie': return '#3b82f6';
      case 'sleep': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <View style={[styles.sceneCard, scene.isActive && styles.sceneCardActive]}>
      <View style={styles.sceneHeader}>
        <View style={styles.sceneInfo}>
          <Text style={styles.sceneIcon}>{getSceneIcon(scene.icon)}</Text>
          <View style={styles.sceneDetails}>
            <Text style={[styles.sceneName, scene.isActive && styles.sceneNameActive]}>
              {scene.name}
            </Text>
            <Text style={styles.sceneDescription}>
              {scene.description}
            </Text>
            {scene.lastActivated && (
              <Text style={styles.lastActivated}>
                Last activated: {scene.lastActivated}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.sceneStatus}>
          <View style={[styles.statusIndicator, { backgroundColor: scene.isActive ? getSceneColor(scene.icon) : '#d1d5db' }]} />
          <Text style={[styles.statusText, scene.isActive && styles.statusTextActive]}>
            {scene.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
      </View>

      <View style={styles.sceneActions}>
        <TouchableOpacity
          style={[styles.activateButton, { backgroundColor: getSceneColor(scene.icon) }]}
          onPress={() => onActivate(scene.id)}
        >
          <MaterialIcons name="play-arrow" size={20} color="#ffffff" />
          <Text style={styles.activateButtonText}>
            {scene.isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(scene)}
        >
          <MaterialIcons name="edit" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function ScenesScreen({ onMenuPress }: { onMenuPress?: () => void }) {
  const [scenes, setScenes] = useState<Scene[]>([
    {
      id: 'morning',
      name: 'Morning Routine',
      icon: 'morning',
      description: 'Bright lights, warm climate, unlocked doors for the day ahead',
      isActive: false,
      lastActivated: null,
      devices: {
        lights: true,
        climate: 22,
        security: false,
        doors: false,
      },
    },
    {
      id: 'evening',
      name: 'Evening Relax',
      icon: 'evening',
      description: 'Dim lights, comfortable temperature, secure home',
      isActive: true,
      lastActivated: '7:30 PM',
      devices: {
        lights: true,
        climate: 21,
        security: true,
        doors: true,
      },
    },
    {
      id: 'away',
      name: 'Away Mode',
      icon: 'away',
      description: 'All systems off, security armed, ready for absence',
      isActive: false,
      lastActivated: null,
      devices: {
        lights: false,
        climate: 18,
        security: true,
        doors: true,
      },
    },
    {
      id: 'movie',
      name: 'Movie Time',
      icon: 'movie',
      description: 'Dim lights, cool temperature, perfect for movie night',
      isActive: false,
      lastActivated: null,
      devices: {
        lights: true,
        climate: 20,
        security: false,
        doors: true,
      },
    },
    {
      id: 'sleep',
      name: 'Sleep Mode',
      icon: 'sleep',
      description: 'Lights off, cool temperature, secure for restful sleep',
      isActive: false,
      lastActivated: null,
      devices: {
        lights: false,
        climate: 19,
        security: true,
        doors: true,
      },
    },
  ]);

  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [showNewSceneModal, setShowNewSceneModal] = useState(false);

  const activateScene = (sceneId: string) => {
    const now = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    setScenes(prev => prev.map(scene => {
      if (scene.id === sceneId) {
        return {
          ...scene,
          isActive: !scene.isActive,
          lastActivated: !scene.isActive ? now : scene.lastActivated,
        };
      }
      return scene;
    }));
  };

  const editScene = (scene: Scene) => {
    setSelectedScene(scene);
  };

  const createNewScene = () => {
    setShowNewSceneModal(true);
  };

  const activeScenes = scenes.filter(scene => scene.isActive).length;

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
        onPress={handleSearch}
        activeOpacity={0.7}
      >
        <MaterialIcons name="search" size={24} color="#0f172a" />
      </TouchableOpacity>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Scenes</Text>
        <Text style={styles.subtitle}>
          {activeScenes} of {scenes.length} scenes active
        </Text>
      </View>

      {/* Scenes List */}
      <View style={styles.scenesContainer}>
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            onActivate={activateScene}
            onEdit={editScene}
          />
        ))}
      </View>

      {/* New Scene Button */}
      <View style={styles.newSceneSection}>
        <TouchableOpacity
          style={styles.newSceneButton}
          onPress={createNewScene}
        >
          <MaterialIcons name="add" size={24} color="#ffffff" />
          <Text style={styles.newSceneButtonText}>Create New Scene</Text>
        </TouchableOpacity>
      </View>

      {/* Scene Details Modal */}
      <Modal
        visible={selectedScene !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedScene(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSelectedScene(null)}
            >
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Scene</Text>
          </View>

          {selectedScene && (
            <View style={styles.modalContent}>
              <View style={styles.scenePreview}>
                <Text style={styles.scenePreviewIcon}>
                  {selectedScene.icon === 'morning' ? '🌅' :
                   selectedScene.icon === 'evening' ? '🌆' :
                   selectedScene.icon === 'away' ? '🏠' :
                   selectedScene.icon === 'movie' ? '🎬' : '😴'}
                </Text>
                <View style={styles.scenePreviewInfo}>
                  <Text style={styles.scenePreviewName}>{selectedScene.name}</Text>
                  <Text style={styles.scenePreviewDescription}>{selectedScene.description}</Text>
                </View>
              </View>

              <View style={styles.deviceSettings}>
                <Text style={styles.settingsTitle}>Device Settings</Text>

                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>Lights</Text>
                  <TouchableOpacity
                    style={[styles.deviceToggle, selectedScene.devices.lights && styles.deviceToggleActive]}
                    onPress={() => {
                      setSelectedScene({
                        ...selectedScene,
                        devices: { ...selectedScene.devices, lights: !selectedScene.devices.lights }
                      });
                    }}
                  >
                    <Text style={[styles.deviceToggleText, selectedScene.devices.lights && styles.deviceToggleTextActive]}>
                      {selectedScene.devices.lights ? 'ON' : 'OFF'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>Climate ({selectedScene.devices.climate}°C)</Text>
                  <View style={styles.tempControls}>
                    <TouchableOpacity
                      style={styles.tempButton}
                      onPress={() => {
                        const newTemp = Math.max(16, selectedScene.devices.climate - 1);
                        setSelectedScene({
                          ...selectedScene,
                          devices: { ...selectedScene.devices, climate: newTemp }
                        });
                      }}
                    >
                      <MaterialIcons name="remove" size={16} color="#374151" />
                    </TouchableOpacity>
                    <Text style={styles.tempValue}>{selectedScene.devices.climate}°C</Text>
                    <TouchableOpacity
                      style={styles.tempButton}
                      onPress={() => {
                        const newTemp = Math.min(30, selectedScene.devices.climate + 1);
                        setSelectedScene({
                          ...selectedScene,
                          devices: { ...selectedScene.devices, climate: newTemp }
                        });
                      }}
                    >
                      <MaterialIcons name="add" size={16} color="#374151" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>Security</Text>
                  <TouchableOpacity
                    style={[styles.deviceToggle, selectedScene.devices.security && styles.deviceToggleActive]}
                    onPress={() => {
                      setSelectedScene({
                        ...selectedScene,
                        devices: { ...selectedScene.devices, security: !selectedScene.devices.security }
                      });
                    }}
                  >
                    <Text style={[styles.deviceToggleText, selectedScene.devices.security && styles.deviceToggleTextActive]}>
                      {selectedScene.devices.security ? 'ARMED' : 'DISARMED'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.deviceRow}>
                  <Text style={styles.deviceLabel}>Doors</Text>
                  <TouchableOpacity
                    style={[styles.deviceToggle, selectedScene.devices.doors && styles.deviceToggleActive]}
                    onPress={() => {
                      setSelectedScene({
                        ...selectedScene,
                        devices: { ...selectedScene.devices, doors: !selectedScene.devices.doors }
                      });
                    }}
                  >
                    <Text style={[styles.deviceToggleText, selectedScene.devices.doors && styles.deviceToggleTextActive]}>
                      {selectedScene.devices.doors ? 'LOCKED' : 'UNLOCKED'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    // Save changes to scene
                    setScenes(prev => prev.map(s =>
                      s.id === selectedScene.id ? selectedScene : s
                    ));
                    setSelectedScene(null);
                  }}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    Alert.alert(
                      'Delete Scene',
                      `Are you sure you want to delete "${selectedScene.name}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: () => {
                            setScenes(prev => prev.filter(s => s.id !== selectedScene.id));
                            setSelectedScene(null);
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.deleteButtonText}>Delete Scene</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
  scenesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  sceneCard: {
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
  sceneCardActive: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0ea5e9',
  },
  sceneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sceneInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  sceneIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sceneDetails: {
    flex: 1,
  },
  sceneName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  sceneNameActive: {
    color: '#0ea5e9',
  },
  sceneDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  lastActivated: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  sceneStatus: {
    alignItems: 'center',
    gap: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusTextActive: {
    color: '#0ea5e9',
  },
  sceneActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activateButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  newSceneSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  newSceneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  newSceneButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
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
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  scenePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  scenePreviewIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  scenePreviewInfo: {
    flex: 1,
  },
  scenePreviewName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  scenePreviewDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  deviceSettings: {
    flex: 1,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  deviceLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  deviceToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  deviceToggleActive: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  deviceToggleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  deviceToggleTextActive: {
    color: '#1e40af',
  },
  tempControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tempButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tempValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    minWidth: 50,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 32,
  },
});
