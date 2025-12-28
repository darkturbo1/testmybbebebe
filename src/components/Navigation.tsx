import { motion } from "framer-motion";
import { Home, Map, BarChart3, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "home" | "journey" | "stats" | "achievements";

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: "home" as Tab, icon: Home, label: "Home" },
  { id: "journey" as Tab, icon: Map, label: "Journey" },
  { id: "stats" as Tab, icon: BarChart3, label: "Stats" },
  { id: "achievements" as Tab, icon: Trophy, label: "Awards" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-around px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 px-4 py-2"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon
                className={cn(
                  "relative h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "relative text-xs transition-colors",
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
