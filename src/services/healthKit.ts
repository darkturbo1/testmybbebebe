import { Capacitor } from '@capacitor/core';
import { useState, useEffect, useCallback } from 'react';

// Types from the @capgo/capacitor-health plugin
type HealthDataType = 'steps' | 'distance' | 'calories' | 'heartRate' | 'weight';

interface HealthPlugin {
  isAvailable(): Promise<{ available: boolean; platform?: string; reason?: string }>;
  requestAuthorization(options: {
    read?: HealthDataType[];
    write?: HealthDataType[];
  }): Promise<{
    readAuthorized: HealthDataType[];
    readDenied: HealthDataType[];
  }>;
  readSamples(options: {
    dataType: HealthDataType;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{
    samples: Array<{
      dataType: HealthDataType;
      value: number;
      unit: string;
      startDate: string;
      endDate: string;
    }>;
  }>;
  queryWorkouts(options: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<{
    workouts: Array<{
      workoutType: string;
      duration: number;
      totalEnergyBurned?: number;
      totalDistance?: number;
      startDate: string;
      endDate: string;
    }>;
  }>;
}

// Dynamic import for the health plugin (only works on native)
let HealthPlugin: HealthPlugin | null = null;

async function getHealthPlugin(): Promise<HealthPlugin | null> {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  if (!HealthPlugin) {
    try {
      const module = await import('@capgo/capacitor-health');
      HealthPlugin = module.Health;
    } catch (error) {
      console.warn('HealthKit plugin not available:', error);
      return null;
    }
  }
  return HealthPlugin;
}

export interface HealthKitData {
  steps: number;
  distance: number; // in kilometers
  calories: number;
  activeMinutes: number;
  lastSyncTime: Date;
}

export interface HealthKitService {
  isAvailable: boolean;
  isAuthorized: boolean;
  requestAuthorization: () => Promise<boolean>;
  getTodayData: () => Promise<HealthKitData | null>;
  getDataForDateRange: (startDate: Date, endDate: Date) => Promise<HealthKitData | null>;
  startBackgroundSync: () => Promise<void>;
  stopBackgroundSync: () => void;
}

class HealthKitServiceImpl implements HealthKitService {
  isAvailable = false;
  isAuthorized = false;
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private onDataUpdate: ((data: HealthKitData) => void) | null = null;

  async initialize(): Promise<void> {
    const plugin = await getHealthPlugin();
    if (!plugin) {
      this.isAvailable = false;
      return;
    }

    try {
      const result = await plugin.isAvailable();
      this.isAvailable = result.available;
    } catch (error) {
      console.error('Error checking HealthKit availability:', error);
      this.isAvailable = false;
    }
  }

  async requestAuthorization(): Promise<boolean> {
    if (!this.isAvailable) {
      console.warn('HealthKit is not available on this device');
      return false;
    }

    const plugin = await getHealthPlugin();
    if (!plugin) return false;

    try {
      const result = await plugin.requestAuthorization({
        read: ['steps', 'distance', 'calories'],
        write: [],
      });
      this.isAuthorized = result.readAuthorized.length > 0;
      return this.isAuthorized;
    } catch (error) {
      console.error('Error requesting HealthKit authorization:', error);
      this.isAuthorized = false;
      return false;
    }
  }

  async getTodayData(): Promise<HealthKitData | null> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return this.getDataForDateRange(startOfDay, now);
  }

  async getDataForDateRange(startDate: Date, endDate: Date): Promise<HealthKitData | null> {
    if (!this.isAvailable || !this.isAuthorized) {
      return null;
    }

    const plugin = await getHealthPlugin();
    if (!plugin) return null;

    try {
      const [stepsResult, distanceResult, caloriesResult] = await Promise.all([
        plugin.readSamples({
          dataType: 'steps',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
        plugin.readSamples({
          dataType: 'distance',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
        plugin.readSamples({
          dataType: 'calories',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      ]);

      // Sum up all samples
      const totalSteps = stepsResult.samples.reduce((sum, s) => sum + s.value, 0);
      const totalDistanceMeters = distanceResult.samples.reduce((sum, s) => sum + s.value, 0);
      const totalCalories = caloriesResult.samples.reduce((sum, s) => sum + s.value, 0);

      // Convert distance from meters to kilometers
      const distanceKm = totalDistanceMeters / 1000;

      // Estimate active minutes based on steps (rough estimate: 100 steps = 1 minute of activity)
      const activeMinutes = Math.round(totalSteps / 100);

      return {
        steps: Math.round(totalSteps),
        distance: Math.round(distanceKm * 100) / 100, // Round to 2 decimal places
        calories: Math.round(totalCalories),
        activeMinutes,
        lastSyncTime: new Date(),
      };
    } catch (error) {
      console.error('Error fetching HealthKit data:', error);
      return null;
    }
  }

  setOnDataUpdate(callback: (data: HealthKitData) => void): void {
    this.onDataUpdate = callback;
  }

  async startBackgroundSync(): Promise<void> {
    if (this.syncInterval) {
      return; // Already syncing
    }

    // Sync every 5 minutes
    this.syncInterval = setInterval(async () => {
      const data = await this.getTodayData();
      if (data && this.onDataUpdate) {
        this.onDataUpdate(data);
      }
    }, 5 * 60 * 1000);

    // Initial sync
    const data = await this.getTodayData();
    if (data && this.onDataUpdate) {
      this.onDataUpdate(data);
    }
  }

  stopBackgroundSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}

// Singleton instance
export const healthKitService = new HealthKitServiceImpl();

// Hook for React components
export function useHealthKit() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [healthData, setHealthData] = useState<HealthKitData | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await healthKitService.initialize();
      setIsAvailable(healthKitService.isAvailable);
      setIsAuthorized(healthKitService.isAuthorized);
      setIsLoading(false);
    }
    init();
  }, []);

  const requestAuthorization = useCallback(async () => {
    setIsLoading(true);
    const result = await healthKitService.requestAuthorization();
    setIsAuthorized(result);
    setIsLoading(false);
    
    if (result) {
      // Fetch initial data after authorization
      const data = await healthKitService.getTodayData();
      if (data) {
        setHealthData(data);
        setLastSyncTime(data.lastSyncTime);
      }
    }
    
    return result;
  }, []);

  const syncNow = useCallback(async () => {
    if (!isAuthorized) return null;
    
    const data = await healthKitService.getTodayData();
    if (data) {
      setHealthData(data);
      setLastSyncTime(data.lastSyncTime);
    }
    return data;
  }, [isAuthorized]);

  const startBackgroundSync = useCallback(async () => {
    healthKitService.setOnDataUpdate((data) => {
      setHealthData(data);
      setLastSyncTime(data.lastSyncTime);
    });
    await healthKitService.startBackgroundSync();
  }, []);

  const stopBackgroundSync = useCallback(() => {
    healthKitService.stopBackgroundSync();
  }, []);

  return {
    isAvailable,
    isAuthorized,
    isLoading,
    healthData,
    lastSyncTime,
    requestAuthorization,
    syncNow,
    startBackgroundSync,
    stopBackgroundSync,
  };
}
