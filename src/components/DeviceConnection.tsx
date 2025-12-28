import { motion } from "framer-motion";
import { Watch, Smartphone, Activity, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Device {
  id: string;
  name: string;
  icon: "watch" | "phone";
  connected: boolean;
}

interface DeviceConnectionProps {
  devices: Device[];
  onConnect: (deviceId: string) => void;
}

const deviceIcons = {
  watch: Watch,
  phone: Smartphone,
};

export function DeviceConnection({ devices, onConnect }: DeviceConnectionProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">
          Connected Devices
        </h3>
      </div>

      <div className="space-y-3">
        {devices.map((device, index) => {
          const Icon = deviceIcons[device.icon];
          
          return (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 transition-all",
                device.connected
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/50 bg-secondary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    device.connected ? "bg-primary/20" : "bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      device.connected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <div>
                  <p className="font-medium text-foreground">{device.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {device.connected ? "Syncing data" : "Not connected"}
                  </p>
                </div>
              </div>

              {device.connected ? (
                <div className="flex items-center gap-1.5 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onConnect(device.id)}
                >
                  Connect
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Connect your devices to automatically track steps and distance. Background tracking enabled.
      </p>
    </div>
  );
}
