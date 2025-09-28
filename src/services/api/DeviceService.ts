// src/services/api/DeviceService.ts
// Interface for a device control service. Implement with MQTT or REST later.

export type DeviceType = 'lights' | 'thermostat' | 'security';

export interface IDeviceService {
  // Turn a device on/off
  setDeviceState(device: DeviceType, on: boolean): Promise<void>;
  // Fetch current device state
  getDeviceState(device: DeviceType): Promise<boolean>;
  // Optional: batch set (used by scenes)
  setStates(states: Partial<Record<DeviceType, boolean>>): Promise<void>;
}
