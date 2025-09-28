// src/components/Sidebar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type SidebarItem = {
  id: string;
  title: string;
};

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'home', title: 'Home' },
  { id: 'lights', title: 'Lights' },
  { id: 'doors', title: 'Doors' },
  { id: 'thermostat', title: 'Thermostat' },
  { id: 'security', title: 'Security' },
  { id: 'scenes', title: 'Scenes' },
  { id: 'settings', title: 'Settings' },
];

interface SidebarProps {
  activeItem: string;
  onSelect: (itemId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onSelect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Smart Home</Text>
      </View>
      <View style={styles.itemsContainer}>
        {SIDEBAR_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              activeItem === item.id && styles.activeItem,
            ]}
            onPress={() => onSelect(item.id)}
          >
            <Text
              style={[
                styles.itemText,
                activeItem === item.id && styles.activeItemText,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: '#f8f9fa',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  itemsContainer: {
    paddingVertical: 8,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  activeItem: {
    backgroundColor: '#e9ecef',
    borderLeftWidth: 4,
    borderLeftColor: '#0d6efd',
  },
  itemText: {
    fontSize: 16,
    color: '#495057',
  },
  activeItemText: {
    color: '#0d6efd',
    fontWeight: '500',
  },
});

export default Sidebar;
