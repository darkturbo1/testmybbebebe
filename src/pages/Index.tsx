import { useState } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { HomeView } from "@/components/views/HomeView";
import { JourneyView } from "@/components/views/JourneyView";
import { StatsView } from "@/components/views/StatsView";
import { AchievementsView } from "@/components/views/AchievementsView";
import { destinations, Destination } from "@/data/destinations";

type Tab = "home" | "journey" | "stats" | "achievements";

interface Device {
  id: string;
  name: string;
  icon: "watch" | "phone";
  connected: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(
    destinations[0] // Start with Hogwarts for demo
  );
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [devices, setDevices] = useState<Device[]>([
    { id: "apple-watch", name: "Apple Watch", icon: "watch", connected: true },
    { id: "iphone", name: "iPhone", icon: "phone", connected: true },
  ]);

  // Mock data for demo
  const distanceCovered = 23.5;
  const totalSteps = 8432;
  const caloriesBurned = 342;
  const activeMinutes = 67;
  const totalDistance = 156.8;
  const totalCalories = 12450;
  const totalActiveMinutes = 2340;
  const journeysCompleted = 2;
  const longestStreak = 21;

  const handleConnectDevice = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, connected: true } : device
      )
    );
  };

  const handleSelectDestination = (destination: Destination) => {
    if (currentDestination?.id === destination.id) return;
    setSelectedDestination(destination);
  };

  const handleStartJourney = () => {
    if (selectedDestination) {
      setCurrentDestination(selectedDestination);
      setSelectedDestination(null);
    }
  };

  const handleCancelSelection = () => {
    setSelectedDestination(null);
  };

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
            totalDistance={totalDistance}
            totalSteps={totalSteps * 20}
            totalCalories={totalCalories}
            totalActiveMinutes={totalActiveMinutes}
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
      <Header />
      <main className="container px-4 py-6">{renderView()}</main>
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
