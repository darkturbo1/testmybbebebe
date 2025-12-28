import { motion } from "framer-motion";
import { Trophy, Medal, Star, Zap, Crown, Flame, Map, Footprints } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "medal" | "star" | "zap" | "crown" | "flame" | "map" | "footprints";
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const iconMap = {
  trophy: Trophy,
  medal: Medal,
  star: Star,
  zap: Zap,
  crown: Crown,
  flame: Flame,
  map: Map,
  footprints: Footprints,
};

const rarityStyles = {
  common: {
    bg: "bg-secondary",
    border: "border-border/50",
    text: "text-muted-foreground",
    icon: "text-muted-foreground",
  },
  rare: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/50",
    text: "text-blue-400",
    icon: "text-blue-400",
  },
  epic: {
    bg: "bg-mystical/10",
    border: "border-mystical/50",
    text: "text-mystical",
    icon: "text-mystical",
  },
  legendary: {
    bg: "bg-primary/10",
    border: "border-primary/50",
    text: "text-primary",
    icon: "text-primary",
  },
};

const achievements: Achievement[] = [
  {
    id: "first-steps",
    name: "First Steps",
    description: "Complete your first 1 km",
    icon: "footprints",
    unlocked: true,
    unlockedAt: new Date("2024-01-15"),
    rarity: "common",
  },
  {
    id: "marathon-hero",
    name: "Marathon Hero",
    description: "Run a total of 42.2 km",
    icon: "medal",
    unlocked: true,
    unlockedAt: new Date("2024-02-01"),
    rarity: "rare",
  },
  {
    id: "week-warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "flame",
    unlocked: true,
    unlockedAt: new Date("2024-02-10"),
    rarity: "common",
  },
  {
    id: "fantasy-explorer",
    name: "Fantasy Explorer",
    description: "Complete your first journey",
    icon: "map",
    unlocked: true,
    unlockedAt: new Date("2024-03-01"),
    rarity: "rare",
  },
  {
    id: "lightning-runner",
    name: "Lightning Runner",
    description: "Run 10 km in a single day",
    icon: "zap",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "century-club",
    name: "Century Club",
    description: "Run a total of 100 km",
    icon: "star",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "fellowship",
    name: "The Fellowship",
    description: "Complete the journey to Mordor",
    icon: "crown",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "realm-walker",
    name: "Realm Walker",
    description: "Complete all available journeys",
    icon: "trophy",
    unlocked: false,
    rarity: "legendary",
  },
];

export function AchievementsView() {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          Achievements
        </h1>
        <p className="text-muted-foreground">
          {unlockedCount} of {achievements.length} unlocked
        </p>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center gap-6 rounded-xl border border-primary/30 bg-primary/5 p-6"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
          <Trophy className="h-10 w-10 text-primary-foreground" />
        </div>
        <div>
          <p className="font-display text-4xl font-bold text-primary">
            {unlockedCount}
          </p>
          <p className="text-muted-foreground">Achievements Earned</p>
        </div>
      </motion.div>

      {/* Achievement Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((achievement, index) => {
          const Icon = iconMap[achievement.icon];
          const style = rarityStyles[achievement.rarity];

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className={cn(
                "relative overflow-hidden rounded-xl border p-4 transition-all",
                achievement.unlocked ? style.border : "border-border/30",
                achievement.unlocked ? style.bg : "bg-secondary/20"
              )}
            >
              {/* Locked Overlay */}
              {!achievement.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                  <div className="text-2xl">🔒</div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg",
                    achievement.unlocked ? style.bg : "bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6",
                      achievement.unlocked ? style.icon : "text-muted-foreground/50"
                    )}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "font-display font-semibold",
                        achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {achievement.name}
                    </p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                        style.bg,
                        style.text
                      )}
                    >
                      {achievement.rarity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
