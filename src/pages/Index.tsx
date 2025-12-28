import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { HomeView } from "@/components/views/HomeView";
import { JourneyView } from "@/components/views/JourneyView";
import { StatsView } from "@/components/views/StatsView";
import { AchievementsView } from "@/components/views/AchievementsView";
import { destinations, Destination } from "@/data/destinations";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type Tab = "home" | "journey" | "stats" | "achievements";

interface Device {
  id: string;
  name: string;
  icon: "watch" | "phone";
  connected: boolean;
}

interface Profile {
  id: string;
  fitness_level: string;
  weekly_goal: string;
  daily_step_goal: number;
  apple_health_connected: boolean;
  onboarding_completed: boolean;
  current_destination_id: string | null;
  distance_covered: number;
  total_steps: number;
  total_calories: number;
  total_active_minutes: number;
  journeys_completed: number;
  current_streak: number;
  longest_streak: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [devices, setDevices] = useState<Device[]>([
    { id: "apple-watch", name: "Apple Watch", icon: "watch", connected: false },
    { id: "iphone", name: "iPhone", icon: "phone", connected: false },
  ]);

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile(data);
          
          // Set current destination from profile
          if (data.current_destination_id) {
            const dest = destinations.find((d) => d.id === data.current_destination_id);
            if (dest) setCurrentDestination(dest);
          }
          
          // Update device connection status
          if (data.apple_health_connected) {
            setDevices((prev) =>
              prev.map((d) => ({ ...d, connected: true }))
            );
          }
          
          // Check if onboarding is needed
          if (!data.onboarding_completed) {
            navigate("/onboarding");
          }
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
      } finally {
        setProfileLoading(false);
      }
    }

    fetchProfile();
  }, [user, navigate]);

  const handleConnectDevice = async (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, connected: true } : device
      )
    );
    
    if (user) {
      await supabase
        .from("profiles")
        .update({ apple_health_connected: true })
        .eq("id", user.id);
    }
    
    toast.success("Device connected successfully!");
  };

  const handleSelectDestination = (destination: Destination) => {
    if (currentDestination?.id === destination.id) return;
    setSelectedDestination(destination);
  };

  const handleStartJourney = async () => {
    if (selectedDestination && user) {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            current_destination_id: selectedDestination.id,
            distance_covered: 0,
          })
          .eq("id", user.id);

        if (error) throw error;

        setCurrentDestination(selectedDestination);
        setSelectedDestination(null);
        setProfile((prev) =>
          prev ? { ...prev, current_destination_id: selectedDestination.id, distance_covered: 0 } : null
        );
        toast.success(`Your journey to ${selectedDestination.name} begins!`);
      } catch (error: any) {
        toast.error("Failed to start journey");
      }
    }
  };

  const handleCancelSelection = () => {
    setSelectedDestination(null);
  };

  const handleSettings = async () => {
    await signOut();
    navigate("/auth");
  };

  // Show loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold mb-4"
          >
            <Compass className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <p className="text-muted-foreground">Loading your adventure...</p>
        </motion.div>
      </div>
    );
  }

  // Show welcome screen for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold mb-6"
          >
            <Compass className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            Epic Run
          </h1>
          <p className="text-xl text-primary mb-4">Run to Fantasy</p>
          <p className="text-muted-foreground mb-8">
            Turn your daily runs into epic adventures. Run to Hogwarts, Mordor, Narnia and more!
          </p>
          
          <div className="space-y-3">
            <Button
              variant="gold"
              size="xl"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              I already have an account
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Get stats from profile or use defaults
  const distanceCovered = profile?.distance_covered ?? 0;
  const totalSteps = profile?.total_steps ?? 0;
  const caloriesBurned = profile?.total_calories ?? 0;
  const activeMinutes = profile?.total_active_minutes ?? 0;
  const journeysCompleted = profile?.journeys_completed ?? 0;
  const longestStreak = profile?.longest_streak ?? 0;

  const renderView = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeView
            currentDestination={currentDestination}
            distanceCovered={distanceCovered}
            totalSteps={totalSteps}
            caloriesBurned={caloriesBurned}
            activeMinutes={activeMinutes}
            devices={devices}
            onConnectDevice={handleConnectDevice}
            onSelectJourney={() => setActiveTab("journey")}
          />
        );
      case "journey":
        return (
          <JourneyView
            currentDestination={currentDestination}
            distanceCovered={distanceCovered}
            onSelectDestination={handleSelectDestination}
            selectedDestination={selectedDestination}
            onStartJourney={handleStartJourney}
            onCancelSelection={handleCancelSelection}
          />
        );
      case "stats":
        return (
          <StatsView
            totalDistance={distanceCovered}
            totalSteps={totalSteps}
            totalCalories={caloriesBurned}
            totalActiveMinutes={activeMinutes}
            journeysCompleted={journeysCompleted}
            longestStreak={longestStreak}
          />
        );
      case "achievements":
        return <AchievementsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSettingsClick={handleSettings} />
      <main className="container px-4 py-6">{renderView()}</main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
