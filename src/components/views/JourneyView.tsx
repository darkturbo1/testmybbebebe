import { motion } from "framer-motion";
import { destinations, Destination } from "@/data/destinations";
import { DestinationCard } from "@/components/DestinationCard";
import { JourneyProgress } from "@/components/JourneyProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

interface JourneyViewProps {
  currentDestination: Destination | null;
  distanceCovered: number;
  onSelectDestination: (destination: Destination) => void;
  selectedDestination: Destination | null;
  onStartJourney: () => void;
  onCancelSelection: () => void;
}

export function JourneyView({
  currentDestination,
  distanceCovered,
  onSelectDestination,
  selectedDestination,
  onStartJourney,
  onCancelSelection,
}: JourneyViewProps) {
  const hasActiveJourney = currentDestination !== null;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          {hasActiveJourney ? "Your Journey" : "Choose Your Destination"}
        </h1>
        <p className="text-muted-foreground">
          {hasActiveJourney
            ? "Track your progress on the interactive map"
            : "Pick a fantasy location and start running"}
        </p>
      </motion.div>

      {/* Current Journey Progress with Map */}
      {hasActiveJourney && (
        <JourneyProgress
          destination={currentDestination}
          distanceCovered={distanceCovered}
          showMap={true}
        />
      )}

      {/* Selection Confirmation */}
      {selectedDestination && !hasActiveJourney && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/50 bg-primary/10 p-4"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">
                Ready for {selectedDestination.name}?
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedDestination.distance} km journey awaits
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onCancelSelection}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Choose Another
            </Button>
            <Button variant="gold" className="flex-1" onClick={onStartJourney}>
              Begin Journey
            </Button>
          </div>
        </motion.div>
      )}

      {/* Destinations Grid */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
          {hasActiveJourney ? "Other Destinations" : "Available Destinations"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DestinationCard
                destination={destination}
                isSelected={
                  selectedDestination?.id === destination.id ||
                  currentDestination?.id === destination.id
                }
                onSelect={onSelectDestination}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
