import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppDrawer from './src/navigation/AppDrawer';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <AppDrawer />
    </>
  );
}
