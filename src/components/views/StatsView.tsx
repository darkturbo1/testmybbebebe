import { motion } from "framer-motion";
import {
  Footprints,
  Flame,
  Clock,
  TrendingUp,
  MapPin,
  Target,
  Award,
} from "lucide-react";
import { StatsCard } from "@/components/StatsCard";

interface StatsViewProps {
  totalDistance: number;
  totalSteps: number;
  totalCalories: number;
  totalActiveMinutes: number;
  journeysCompleted: number;
  longestStreak: number;
}

export function StatsView({
  totalDistance,
  totalSteps,
  totalCalories,
  totalActiveMinutes,
  journeysCompleted,
  longestStreak,
}: StatsViewProps) {
  const weeklyData = [
    { day: "Mon", distance: 4.2 },
    { day: "Tue", distance: 6.1 },
    { day: "Wed", distance: 3.8 },
    { day: "Thu", distance: 7.5 },
    { day: "Fri", distance: 5.2 },
    { day: "Sat", distance: 8.9 },
    { day: "Sun", distance: 4.5 },
  ];

  const maxDistance = Math.max(...weeklyData.map((d) => d.distance));

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          Your Statistics
        </h1>
        <p className="text-muted-foreground">Track your running journey</p>
      </motion.div>

      {/* All-Time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-border/50 bg-gradient-card p-5"
      >
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          All-Time Summary
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-primary">
              {totalDistance.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">km traveled</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-foreground">
              {(totalSteps / 1000).toFixed(0)}k
            </p>
            <p className="text-sm text-muted-foreground">total steps</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-foreground">
              {Math.floor(totalActiveMinutes / 60)}h
            </p>
            <p className="text-sm text-muted-foreground">active time</p>
          </div>
          <div className="text-center">
            <p className="font-display text-3xl font-bold text-mystical">
              {journeysCompleted}
            </p>
            <p className="text-sm text-muted-foreground">journeys done</p>
          </div>
        </div>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border/50 bg-gradient-card p-5"
      >
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          This Week
        </h2>
        <div className="flex h-40 items-end justify-between gap-2">
          {weeklyData.map((data, index) => (
            <div key={data.day} className="flex flex-1 flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(data.distance / maxDistance) * 100}%` }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                className="w-full rounded-t-lg bg-gradient-gold"
                style={{ minHeight: "8px" }}
              />
              <span className="text-xs text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Total this week:{" "}
            <span className="font-semibold text-primary">
              {weeklyData.reduce((a, b) => a + b.distance, 0).toFixed(1)} km
            </span>
          </p>
        </div>
      </motion.div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          icon={MapPin}
          label="Total Distance"
          value={`${totalDistance.toFixed(1)} km`}
          variant="gold"
          delay={0.3}
        />
        <StatsCard
          icon={Footprints}
          label="Total Steps"
          value={totalSteps.toLocaleString()}
          variant="default"
          delay={0.35}
        />
        <StatsCard
          icon={Flame}
          label="Calories Burned"
          value={totalCalories.toLocaleString()}
          subValue="kcal"
          variant="default"
          delay={0.4}
        />
        <StatsCard
          icon={Clock}
          label="Active Time"
          value={`${Math.floor(totalActiveMinutes / 60)}h ${totalActiveMinutes % 60}m`}
          variant="default"
          delay={0.45}
        />
        <StatsCard
          icon={Target}
          label="Journeys"
          value={journeysCompleted}
          subValue="completed"
          variant="mystical"
          delay={0.5}
        />
        <StatsCard
          icon={Award}
          label="Longest Streak"
          value={`${longestStreak} days`}
          variant="gold"
          delay={0.55}
        />
      </div>
    </div>
  );
}
