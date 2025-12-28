import { motion } from "framer-motion";
import { Compass, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold shadow-gold">
            <Compass className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-foreground">
              Epic Run
            </h1>
            <p className="text-xs text-muted-foreground">Run to Fantasy</p>
          </div>
        </motion.div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
