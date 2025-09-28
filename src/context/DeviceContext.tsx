// src/context/DeviceContext.tsx
// A simple global state container for device states with AsyncStorage persistence.
// This makes it easy to replace local state with API-backed state later.

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type DevicesState = {
  lightsOn: boolean;
  thermostatOn: boolean;
  securityOn: boolean;
  doorsLocked: boolean;
};

export type DeviceContextValue = {
  state: DevicesState;
  setLights: (on: boolean) => void;
  setThermostat: (on: boolean) => void;
  setSecurity: (on: boolean) => void;
  setDoors: (locked: boolean) => void;
  applyScene: (scene: 'GoodMorning' | 'Away' | 'Night') => void;
};

const DEFAULT_STATE: DevicesState = {
  lightsOn: false,
  thermostatOn: false,
  securityOn: false,
  doorsLocked: true,
};

const STORAGE_KEY = 'my-smart-home:devices';

const DeviceContext = createContext<DeviceContextValue | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DevicesState>(DEFAULT_STATE);

  // Load persisted state on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setState(JSON.parse(raw));
      } catch (e) {
        // keep defaults on error
      }
    })();
  }, []);

  // Persist on change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  // Individual setters
  const setLights = (on: boolean) => setState(s => ({ ...s, lightsOn: on }));
  const setThermostat = (on: boolean) => setState(s => ({ ...s, thermostatOn: on }));
  const setSecurity = (on: boolean) => setState(s => ({ ...s, securityOn: on }));
  const setDoors = (locked: boolean) => setState(s => ({ ...s, doorsLocked: locked }));

  // Scenes change multiple states at once
  const applyScene = (scene: 'GoodMorning' | 'Away' | 'Night') => {
    switch (scene) {
      case 'GoodMorning':
        setState({ lightsOn: true, thermostatOn: true, securityOn: false, doorsLocked: false });
        break;
      case 'Away':
        setState({ lightsOn: false, thermostatOn: false, securityOn: true, doorsLocked: true });
        break;
      case 'Night':
        setState({ lightsOn: false, thermostatOn: true, securityOn: true, doorsLocked: true });
        break;
    }
  };

  const value = useMemo<DeviceContextValue>(() => ({
    state,
    setLights,
    setThermostat,
    setSecurity,
    setDoors,
    applyScene,
  }), [state]);

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevices = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error('useDevices must be used within DeviceProvider');
  return ctx;
};
