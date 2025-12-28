import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Destination } from "@/data/destinations";
import { destinationCoordinates, startingPoint, getJourneyPath } from "@/data/journeyCoordinates";
import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface JourneyMapProps {
  destination: Destination;
  distanceCovered: number;
}

export function JourneyMap({ destination, distanceCovered }: JourneyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);

  const progressPercent = Math.min((distanceCovered / destination.distance) * 100, 100);
  const destCoords = destinationCoordinates[destination.id] || destinationCoordinates.hogwarts;

  // Fetch Mapbox token
  useEffect(() => {
    async function fetchToken() {
      try {
        const { data, error } = await supabase.functions.invoke("get-mapbox-token");
        
        if (error) {
          console.error("Error fetching mapbox token:", error);
          setMapError("Failed to load map configuration");
          return;
        }
        
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          setMapError("Map token not available");
        }
      } catch (err) {
        console.error("Failed to fetch mapbox token:", err);
        setMapError("Failed to load map");
      }
    }
    
    fetchToken();
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [startingPoint.lng, startingPoint.lat],
        zoom: 3,
        pitch: 30,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      map.current.on("load", () => {
        setMapLoaded(true);
        
        if (!map.current) return;

        const { coordinates, currentPosition } = getJourneyPath(
          startingPoint,
          destCoords,
          progressPercent
        );

        // Add the full journey path (dashed line for remaining)
        map.current.addSource("journey-full", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coordinates,
            },
          },
        });

        map.current.addLayer({
          id: "journey-full-line",
          type: "line",
          source: "journey-full",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#4a5568",
            "line-width": 3,
            "line-dasharray": [2, 2],
          },
        });

        // Add the completed portion (solid golden line)
        const completedIndex = Math.floor((progressPercent / 100) * coordinates.length);
        const completedCoords = coordinates.slice(0, completedIndex + 1);

        map.current.addSource("journey-completed", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: completedCoords,
            },
          },
        });

        map.current.addLayer({
          id: "journey-completed-line",
          type: "line",
          source: "journey-completed",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#d69e2e",
            "line-width": 4,
          },
        });

        // Add glow effect
        map.current.addLayer({
          id: "journey-completed-glow",
          type: "line",
          source: "journey-completed",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#d69e2e",
            "line-width": 12,
            "line-blur": 8,
            "line-opacity": 0.4,
          },
        });

        // Create custom markers
        // Start marker
        const startEl = document.createElement("div");
        startEl.innerHTML = `
          <div style="
            width: 24px; 
            height: 24px; 
            background: linear-gradient(135deg, #22c55e, #16a34a);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
          </div>
        `;
        new mapboxgl.Marker(startEl)
          .setLngLat([startingPoint.lng, startingPoint.lat])
          .setPopup(new mapboxgl.Popup().setHTML("<strong>Starting Point</strong><p>London</p>"))
          .addTo(map.current);

        // Current position marker
        const currentEl = document.createElement("div");
        currentEl.innerHTML = `
          <div style="
            width: 32px; 
            height: 32px; 
            background: linear-gradient(135deg, #d69e2e, #b7791f);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 20px rgba(214, 158, 46, 0.6), 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="font-size: 14px;">🏃</div>
          </div>
        `;
        new mapboxgl.Marker(currentEl)
          .setLngLat(currentPosition)
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>You are here!</strong><p>${progressPercent.toFixed(1)}% complete</p>`))
          .addTo(map.current);

        // Destination marker with fantasy emoji based on destination
        const destEmoji = getDestinationEmoji(destination.id);
        const destEl = document.createElement("div");
        destEl.innerHTML = `
          <div style="
            width: 36px; 
            height: 36px; 
            background: linear-gradient(135deg, #9333ea, #7e22ce);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.5), 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="font-size: 16px;">${destEmoji}</div>
          </div>
        `;
        new mapboxgl.Marker(destEl)
          .setLngLat([destCoords.lng, destCoords.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<strong>${destination.name}</strong><p>${destination.franchise}</p>`))
          .addTo(map.current);

        // Fit bounds to show the entire journey
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([startingPoint.lng, startingPoint.lat]);
        bounds.extend([destCoords.lng, destCoords.lat]);
        bounds.extend(currentPosition);
        
        map.current.fitBounds(bounds, {
          padding: 60,
          maxZoom: 6,
        });
      });

      map.current.on("error", (e) => {
        console.error("Map error:", e);
        setMapError("Failed to load map");
      });

    } catch (error) {
      console.error("Map initialization error:", error);
      setMapError("Failed to initialize map");
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, destination.id, progressPercent, destCoords, destination.name, destination.franchise]);

  if (mapError) {
    return (
      <div className="relative h-64 rounded-xl border border-border/50 bg-gradient-card overflow-hidden flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">{mapError}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Journey visualization unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl border border-border/50 overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainer} className="h-64 w-full" />
      
      {/* Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          >
            <Navigation className="h-8 w-8 text-primary" />
          </motion.div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-3 left-3 rounded-lg bg-background/90 backdrop-blur-sm p-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">You</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-mystical" />
            <span className="text-muted-foreground">{destination.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDestinationEmoji(destId: string): string {
  const emojis: Record<string, string> = {
    hogwarts: "🏰",
    mordor: "🌋",
    narnia: "🦁",
    rivendell: "🧝",
    asgard: "⚡",
    wakanda: "🐆",
  };
  return emojis[destId] || "🏰";
}
