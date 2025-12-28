import { motion } from "framer-motion";
import { Heart, Smartphone, Watch, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHealthKit } from "@/services/healthKit";
import { Capacitor } from "@capacitor/core";

interface HealthSyncStatusProps {
  isConnected: boolean;
  onConnect: () => void;
  lastSyncedSteps?: number;
  lastSyncTime?: Date;
}

export function HealthSyncStatus({
  isConnected,
  onConnect,
  lastSyncedSteps,
  lastSyncTime,
}: HealthSyncStatusProps) {
  const { 
    isAvailable, 
    isAuthorized, 
    isLoading, 
    healthData, 
    lastSyncTime: syncTime,
    requestAuthorization,
    syncNow 
  } = useHealthKit();

  const isNative = Capacitor.isNativePlatform();
  const actualLastSync = syncTime || lastSyncTime;
  const actualSteps = healthData?.steps || lastSyncedSteps || 0;

  const handleConnect = async () => {
    if (isNative && isAvailable) {
      await requestAuthorization();
    } else {
      onConnect();
    }
  };

  const handleSync = async () => {
    await syncNow();
  };

  return (
    <div className="rounded-xl border border-border/50 bg-gradient-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-pink-500" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Health Data Sync
        </h3>
      </div>

      {/* Connection Status */}
      <div className="space-y-3 mb-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-lg border p-3 transition-all",
            (isAuthorized || isConnected)
              ? "border-success/50 bg-success/5"
              : "border-border/50 bg-secondary/30"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-red-500">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground">Apple Health</p>
              <p className="text-xs text-muted-foreground">
                {isAuthorized 
                  ? "Syncing live data" 
                  : isConnected 
                    ? "Ready for native sync" 
                    : "Not connected"}
              </p>
            </div>
          </div>
          
          {(isAuthorized || isConnected) ? (
            <div className="flex items-center gap-2">
              {isAuthorized && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSync}
                  disabled={isLoading}
                >
                  <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                </Button>
              )}
              <div className="flex items-center gap-1.5 text-success">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium">
                  {isAuthorized ? "Live" : "Ready"}
                </span>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Enable"}
            </Button>
          )}
        </div>
      </div>

      {/* Live Data Display (only on native with authorization) */}
      {isAuthorized && healthData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-success/30 bg-success/5 p-4 mb-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-foreground">
              Live HealthKit Data
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {healthData.steps.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Steps Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {healthData.distance.toFixed(1)} km
              </p>
              <p className="text-xs text-muted-foreground">Distance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {healthData.calories}
              </p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {healthData.activeMinutes}
              </p>
              <p className="text-xs text-muted-foreground">Active Min</p>
            </div>
          </div>
          {actualLastSync && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Last synced: {formatTimeAgo(actualLastSync)}
            </p>
          )}
        </motion.div>
      )}

      {/* Native App Notice (only show if not on native) */}
      {!isNative && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4"
        >
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground text-sm">
                Native App Required for Real Sync
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                To automatically sync your steps and workouts from Apple Health, 
                install this app on your iPhone. The web version shows demo data.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Watch className="h-3.5 w-3.5" />
                  <span>Apple Watch</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>iPhone HealthKit</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Manual Entry Option */}
      {isConnected && !isAuthorized && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Until native sync is available, you can manually log your runs in the app
          </p>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
