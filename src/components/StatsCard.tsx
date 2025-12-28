import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  variant?: "default" | "gold" | "mystical";
  delay?: number;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subValue,
  variant = "default",
  delay = 0,
}: StatsCardProps) {
  const variants = {
    default: {
      iconBg: "bg-secondary",
      iconColor: "text-foreground",
    },
    gold: {
      iconBg: "bg-primary/20",
      iconColor: "text-primary",
    },
    mystical: {
      iconBg: "bg-mystical/20",
      iconColor: "text-mystical",
    },
  };

  const style = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl border border-border/50 bg-gradient-card p-4"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            style.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", style.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-display text-xl font-bold text-foreground">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
