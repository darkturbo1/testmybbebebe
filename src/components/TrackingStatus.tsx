import { motion } from "framer-motion";
import { MapPin, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackingStatusProps {
  isTracking: boolean;
  lastSync?: Date;
}

export function TrackingStatus({ isTracking, lastSync }: TrackingStatusProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-gradient-card p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isTracking ? "bg-success/20" : "bg-secondary"
            )}
          >
            <MapPin
              className={cn(
                "h-5 w-5",
                isTracking ? "text-success" : "text-muted-foreground"
              )}
            />
          </div>
          {isTracking && (
            <motion.div
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-success"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">
              {isTracking ? "Tracking Active" : "Tracking Paused"}
            </p>
            {isTracking && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Radio className="h-4 w-4 text-success" />
              </motion.div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {lastSync
              ? `Last synced ${formatTimeAgo(lastSync)}`
              : "Background location enabled"}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "h-3 w-3 rounded-full",
          isTracking ? "bg-success animate-pulse-glow" : "bg-muted-foreground"
        )}
      />
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}
