import { motion } from "framer-motion";
import { MapPin, Flag, Footprints } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Destination } from "@/data/destinations";

interface JourneyProgressProps {
  destination: Destination;
  distanceCovered: number;
}

export function JourneyProgress({ destination, distanceCovered }: JourneyProgressProps) {
  const progressPercent = Math.min((distanceCovered / destination.distance) * 100, 100);
  const remaining = Math.max(destination.distance - distanceCovered, 0);
  const isComplete = distanceCovered >= destination.distance;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-card p-6">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img
          src={destination.image}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background" />
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Journey</p>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Run to {destination.name}
            </h2>
            <p className="text-sm text-muted-foreground">{destination.franchise}</p>
          </div>
          
          {isComplete ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold shadow-gold"
            >
              <span className="text-2xl">🏆</span>
            </motion.div>
          ) : (
            <div className="text-right">
              <p className="font-display text-3xl font-bold text-primary">
                {progressPercent.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">complete</p>
            </div>
          )}
        </div>

        {/* Progress Track */}
        <div className="relative mb-4">
          <Progress value={progressPercent} variant="gold" className="h-4" />
          
          {/* Markers */}
          <div className="absolute inset-0 flex items-center justify-between px-1">
            <motion.div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Footprints className="h-3 w-3" />
            </motion.div>
            
            <motion.div
              style={{ left: `${progressPercent}%` }}
              className="absolute flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-gradient-gold shadow-gold"
              animate={{ x: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <MapPin className="h-3 w-3 text-primary-foreground" />
            </motion.div>
            
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
              <Flag className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 rounded-xl bg-secondary/30 p-4">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-primary">
              {distanceCovered.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">km covered</p>
          </div>
          <div className="text-center border-x border-border/50">
            <p className="font-display text-xl font-bold text-foreground">
              {remaining.toFixed(1)}
            </p>
            <p className="text-xs text-muted-foreground">km remaining</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-foreground">
              {destination.distance}
            </p>
            <p className="text-xs text-muted-foreground">km total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
