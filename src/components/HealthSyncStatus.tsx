import { motion } from "framer-motion";
import { Heart, Smartphone, Watch, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
            isConnected
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
                {isConnected ? "Ready for native sync" : "Not connected"}
              </p>
            </div>
          </div>
          
          {isConnected ? (
            <div className="flex items-center gap-1.5 text-success">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium">Ready</span>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onConnect}>
              Enable
            </Button>
          )}
        </div>
      </div>

      {/* Native App Notice */}
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
              this app needs to be installed as a native iOS app. The web version 
              can only show the UI.
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

      {/* Manual Entry Option */}
      {isConnected && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground text-center">
            Until native sync is available, you can manually log your runs in the app
          </p>
        </div>
      )}
    </div>
  );
}
