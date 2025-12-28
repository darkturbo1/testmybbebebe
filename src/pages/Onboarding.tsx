import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Dumbbell, 
  Target, 
  Heart, 
  Check,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHealthKit } from "@/services/healthKit";
import { Capacitor } from "@capacitor/core";

type FitnessLevel = "beginner" | "intermediate" | "advanced" | "athlete";
type WeeklyGoal = "light" | "moderate" | "active" | "intense";

const fitnessLevels: { id: FitnessLevel; label: string; description: string; icon: string }[] = [
  { id: "beginner", label: "Beginner", description: "New to running or returning after a break", icon: "🌱" },
  { id: "intermediate", label: "Intermediate", description: "Run regularly, 2-3 times per week", icon: "🏃" },
  { id: "advanced", label: "Advanced", description: "Experienced runner with consistent training", icon: "⚡" },
  { id: "athlete", label: "Athlete", description: "Competitive runner or fitness professional", icon: "🏆" },
];

const weeklyGoals: { id: WeeklyGoal; label: string; distance: string; description: string }[] = [
  { id: "light", label: "Light", distance: "10-20 km/week", description: "2-3 short runs per week" },
  { id: "moderate", label: "Moderate", distance: "20-40 km/week", description: "3-4 runs per week" },
  { id: "active", label: "Active", distance: "40-60 km/week", description: "5+ runs per week" },
  { id: "intense", label: "Intense", distance: "60+ km/week", description: "Daily training" },
];

const dailyStepGoals = [5000, 7500, 10000, 12500, 15000];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("beginner");
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal>("moderate");
  const [dailyStepGoal, setDailyStepGoal] = useState(10000);
  const [appleHealthConnected, setAppleHealthConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAvailable, isAuthorized, requestAuthorization, isLoading: healthLoading } = useHealthKit();
  const isNative = Capacitor.isNativePlatform();

  const totalSteps = 4;

  // Sync authorization state with local state
  useEffect(() => {
    if (isAuthorized) {
      setAppleHealthConnected(true);
    }
  }, [isAuthorized]);

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      navigate("/auth");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          fitness_level: fitnessLevel,
          weekly_goal: weeklyGoal,
          daily_step_goal: dailyStepGoal,
          apple_health_connected: appleHealthConnected,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Your adventure begins now!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAppleHealth = async () => {
    if (isNative && isAvailable) {
      // Real HealthKit authorization on native
      const success = await requestAuthorization();
      if (success) {
        setAppleHealthConnected(true);
        toast.success("Apple Health connected! Your steps will be synced automatically.");
      } else {
        toast.error("Could not connect to Apple Health. Please check your settings.");
      }
    } else {
      // Simulate connection for web (will show native app required message)
      setAppleHealthConnected(true);
      toast.success("Apple Health preference saved! Install the native app to sync real data.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            key="fitness"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 mb-4">
                <Dumbbell className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                What's your fitness level?
              </h2>
              <p className="mt-2 text-muted-foreground">
                This helps us personalize your journey
              </p>
            </div>

            <div className="space-y-3">
              {fitnessLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setFitnessLevel(level.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
                    fitnessLevel === level.id
                      ? "border-primary bg-primary/10 shadow-gold"
                      : "border-border/50 bg-secondary/30 hover:border-primary/50"
                  )}
                >
                  <span className="text-3xl">{level.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{level.label}</p>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                  {fitnessLevel === level.id && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="goal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 mb-4">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                How much do you want to run?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Set your weekly running target
              </p>
            </div>

            <div className="space-y-3">
              {weeklyGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setWeeklyGoal(goal.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                    weeklyGoal === goal.id
                      ? "border-primary bg-primary/10 shadow-gold"
                      : "border-border/50 bg-secondary/30 hover:border-primary/50"
                  )}
                >
                  <div>
                    <p className="font-semibold text-foreground">{goal.label}</p>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-primary">{goal.distance}</p>
                    {weeklyGoal === goal.id && (
                      <Check className="h-5 w-5 text-primary ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="steps"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 mb-4">
                <span className="text-2xl">👟</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Daily step goal
              </h2>
              <p className="mt-2 text-muted-foreground">
                How many steps do you want to hit each day?
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {dailyStepGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setDailyStepGoal(goal)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all",
                    dailyStepGoal === goal
                      ? "border-primary bg-primary/10 shadow-gold"
                      : "border-border/50 bg-secondary/30 hover:border-primary/50"
                  )}
                >
                  <p className="font-display text-xl font-bold text-foreground">
                    {(goal / 1000).toFixed(goal % 1000 === 0 ? 0 : 1)}k
                  </p>
                  <p className="text-xs text-muted-foreground">steps</p>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-border/50 bg-secondary/30 p-4">
              <p className="text-sm text-muted-foreground text-center">
                <span className="font-semibold text-foreground">{dailyStepGoal.toLocaleString()} steps</span> is approximately{" "}
                <span className="font-semibold text-primary">{(dailyStepGoal * 0.0008).toFixed(1)} km</span> of walking
              </p>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="health"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 mb-4">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                Connect Apple Health
              </h2>
              <p className="mt-2 text-muted-foreground">
                Automatically sync your steps and workouts
              </p>
            </div>

            <div className="rounded-xl border border-border/50 bg-gradient-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-red-500">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Apple Health</p>
                  <p className="text-sm text-muted-foreground">
                    {appleHealthConnected 
                      ? isAuthorized 
                        ? "Connected & syncing" 
                        : "Preference saved"
                      : "Not connected"}
                  </p>
                </div>
                {appleHealthConnected && (
                  <Check className="h-6 w-6 text-success ml-auto" />
                )}
              </div>

              {!appleHealthConnected ? (
                <Button
                  variant="gold"
                  className="w-full"
                  onClick={handleConnectAppleHealth}
                  disabled={healthLoading}
                >
                  {healthLoading ? "Connecting..." : "Connect Apple Health"}
                </Button>
              ) : (
                <div className="rounded-lg bg-success/10 border border-success/30 p-3">
                  <p className="text-sm text-success text-center">
                    {isAuthorized 
                      ? "✓ Your steps and workouts will be synced automatically"
                      : "✓ Install the native iOS app to enable live syncing"}
                  </p>
                </div>
              )}
            </div>

            {!isNative && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                <p className="text-xs text-amber-600 text-center">
                  You're viewing the web version. For real-time HealthKit syncing, 
                  install the native iOS app on your iPhone.
                </p>
              </div>
            )}

            <p className="text-center text-sm text-muted-foreground">
              You can skip this step and connect later in settings
            </p>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                i <= step ? "bg-primary" : "bg-secondary"
              )}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {step + 1} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 pb-8">
        <div className="flex gap-3 max-w-md mx-auto">
          {step > 0 && (
            <Button variant="outline" size="lg" onClick={handleBack}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {step < totalSteps - 1 ? (
            <Button variant="gold" size="lg" className="flex-1" onClick={handleNext}>
              Continue
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button
              variant="gold"
              size="lg"
              className="flex-1"
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? (
                "Setting up..."
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Your Adventure
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
