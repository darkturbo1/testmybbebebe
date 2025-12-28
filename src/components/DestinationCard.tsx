import { motion } from "framer-motion";
import { MapPin, Clock, Flame } from "lucide-react";
import { Destination } from "@/data/destinations";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
  isSelected: boolean;
  onSelect: (destination: Destination) => void;
}

const difficultyColors = {
  Easy: "text-success",
  Medium: "text-primary",
  Hard: "text-orange-500",
  Epic: "text-mystical",
};

export function DestinationCard({ destination, isSelected, onSelect }: DestinationCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(destination)}
      className={cn(
        "relative w-full overflow-hidden rounded-xl border transition-all duration-300",
        isSelected
          ? "border-primary shadow-gold ring-2 ring-primary/50"
          : "border-border/50 hover:border-primary/50"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary"
          >
            <span className="text-primary-foreground text-lg">✓</span>
          </motion.div>
        )}
      </div>

      <div className="p-4 text-left">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-foreground">{destination.name}</h3>
          <span className={cn("text-sm font-medium", difficultyColors[destination.difficulty])}>
            {destination.difficulty}
          </span>
        </div>
        
        <p className="mb-3 text-xs text-muted-foreground">{destination.franchise}</p>
        
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
          {destination.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-primary">
            <MapPin className="h-4 w-4" />
            <span className="font-semibold">{destination.distance} km</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>~{destination.estimatedDays} days</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
