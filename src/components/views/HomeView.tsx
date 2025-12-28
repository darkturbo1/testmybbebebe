import { motion } from "framer-motion";
import { Footprints, Flame, Clock, TrendingUp, Calendar, Target } from "lucide-react";
import { JourneyProgress } from "@/components/JourneyProgress";
import { StatsCard } from "@/components/StatsCard";
import { HealthSyncStatus } from "@/components/HealthSyncStatus";
import { TrackingStatus } from "@/components/TrackingStatus";
import { Destination } from "@/data/destinations";

interface Device {
  id: string;
  name: string;
  icon: "watch" | "phone";
  connected: boolean;
}

interface HomeViewProps {
  currentDestination: Destination | null;
  distanceCovered: number;
  totalSteps: number;
  caloriesBurned: number;
  activeMinutes: number;
  devices: Device[];
  onConnectDevice: (deviceId: string) => void;
  onSelectJourney: () => void;
}

export function HomeView({
  currentDestination,
  distanceCovered,
  totalSteps,
  caloriesBurned,
  activeMinutes,
  devices,
  onConnectDevice,
  onSelectJourney,
}: HomeViewProps) {
  const weeklyAvg = distanceCovered > 0 ? (distanceCovered / 7).toFixed(1) : "0";
  const streak = 12; // This would come from profile in real app
  const isHealthConnected = devices.some(d => d.connected);

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          Welcome, Adventurer
        </h1>
        <p className="text-muted-foreground">Your epic journey awaits</p>
      </motion.div>

      {/* Current Journey */}
      {currentDestination ? (
        <JourneyProgress
          destination={currentDestination}
          distanceCovered={distanceCovered}
          showMap={false}
        />
      ) : (
        <motion.button
          onClick={onSelectJourney}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl border-2 border-dashed border-primary/50 bg-gradient-card p-8 text-center transition-colors hover:border-primary"
        >
          <div className="mb-3 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Start Your Journey
          </h3>
          <p className="text-muted-foreground">
            Choose a fantasy destination to begin
          </p>
        </motion.button>
      )}

      {/* Tracking Status */}
      <TrackingStatus isTracking={isHealthConnected} lastSync={new Date()} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          icon={Footprints}
          label="Today's Steps"
          value={totalSteps.toLocaleString()}
          subValue="Goal: 10,000"
          variant="gold"
          delay={0.1}
        />
        <StatsCard
          icon={Flame}
          label="Calories"
          value={caloriesBurned}
          subValue="kcal burned"
          variant="default"
          delay={0.2}
        />
        <StatsCard
          icon={Clock}
          label="Active Time"
          value={`${activeMinutes} min`}
          subValue="Today"
          variant="default"
          delay={0.3}
        />
        <StatsCard
          icon={TrendingUp}
          label="Daily Avg"
          value={`${weeklyAvg} km`}
          subValue="This week"
          variant="mystical"
          delay={0.4}
        />
      </div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-primary">{streak} Days</p>
            <p className="text-sm text-muted-foreground">Current streak</p>
          </div>
        </div>
        <div className="text-3xl">🔥</div>
      </motion.div>

      {/* Health Sync Status (replaces Device Connection) */}
      <HealthSyncStatus
        isConnected={isHealthConnected}
        onConnect={() => onConnectDevice("apple-watch")}
      />
    </div>
  );
}
