"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { Station } from "./components/IonMap";
import ScrollWheel from "./components/ScrollWheel";

const IonMap = dynamic(() => import("./components/IonMap"), { ssr: false });

interface ScheduleData {
  stations: Station[];
  schedule: Record<string, Record<number, number[]>>;
  headsigns: Record<number, string>;
  routePaths: Record<number, [number, number][]>;
}

function minutesToDisplay(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function getNotArrivingTimes(arrivalMinutes: number[], windowHours = 2): string[] {
  const now = new Date();
  const currentMinute = now.getHours() * 60 + now.getMinutes();
  const windowEnd = currentMinute + windowHours * 60;
  const arrivingSet = new Set(arrivalMinutes);
  const notArriving: string[] = [];
  for (let min = currentMinute; min < windowEnd; min++) {
    if (!arrivingSet.has(min % (24 * 60))) {
      notArriving.push(minutesToDisplay(min));
    }
  }
  return notArriving;
}

// Placeholder logo — replace the contents of this component with your own SVG/image
function Logo() {
  return (
    <div
      className="flex items-center justify-center font-bold text-sm tracking-widest border-2 px-3 py-1"
      style={{ borderColor: "#FFD100", color: "#FFD100", minWidth: 80 }}
    >
      [ LOGO ]
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string>("");
  const [direction, setDirection] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError("Failed to load schedule data."); setLoading(false); });
  }, []);

  const headsigns = data?.headsigns ?? {};
  const selectedStation = data?.stations.find((s) => s.id === selectedStationId);

  const availableDirections = selectedStation
    ? Object.keys(selectedStation.stopIds).map(Number)
    : [];

  const rawMinutes =
    selectedStation && direction !== null && data
      ? data.schedule[String(selectedStation.stopIds[direction])]?.[direction]
      : undefined;
  const arrivalMinutes: number[] = Array.isArray(rawMinutes) ? rawMinutes : [];

  const notArrivingTimes =
    selectedStation && direction !== null ? getNotArrivingTimes(arrivalMinutes) : [];

  function handleStationSelect(id: string) {
    setSelectedStationId(id);
    setDirection(null);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1A1A2E", color: "#FFFFFF" }}>

      {/* Header */}
      <header
        className="flex items-center gap-4 px-6 py-3 shrink-0"
        style={{ background: "#006BB7", borderBottom: "3px solid #FFD100" }}
      >
        <Logo />
        <div>
          <div className="font-bold text-xl tracking-tight" style={{ color: "#FFFFFF" }}>
            Ion Not Arriving
          </div>
          <div className="text-xs" style={{ color: "#FFD100" }}>
            Waterloo Region&apos;s most useless transit planner
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Map area */}
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          {loading && (
            <div
              className="absolute inset-0 flex items-center justify-center text-sm"
              style={{ background: "#0A0A1A", color: "#006BB7" }}
            >
              Loading ION schedule…
            </div>
          )}
          {error && (
            <div
              className="absolute inset-0 flex items-center justify-center text-sm p-8 text-center"
              style={{ background: "#0A0A1A", color: "#FFD100" }}
            >
              {error}
            </div>
          )}
          {!loading && !error && data && (
            <IonMap
              stations={data.stations}
              routePaths={data.routePaths}
              selectedStationId={selectedStationId}
              onStationSelect={handleStationSelect}
            />
          )}
          {!selectedStationId && !loading && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1.5 pointer-events-none"
              style={{ background: "#006BB7", color: "#FFFFFF" }}
            >
              Click a station
            </div>
          )}
        </div>

        {/* Side panel */}
        <div
          className="w-72 shrink-0 flex flex-col overflow-y-auto"
          style={{ borderLeft: "2px solid #006BB7", background: "#1A1A2E" }}
        >
          {!selectedStation ? (
            <div
              className="flex-1 flex items-center justify-center text-center text-xs p-8"
              style={{ color: "#006BB7" }}
            >
              Select a station on the map to see when the ION will not arrive.
            </div>
          ) : (
            <>
              {/* Station name bar */}
              <div
                className="px-4 py-3 shrink-0"
                style={{ background: "#006BB7", borderBottom: "2px solid #FFD100" }}
              >
                <div className="font-bold text-base" style={{ color: "#FFFFFF" }}>
                  {selectedStation.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "#FFD100" }}>
                  Select a direction
                </div>
              </div>

              {/* Direction buttons */}
              <div className="flex flex-col gap-2 p-4 shrink-0">
                {availableDirections.map((dir) => (
                  <button
                    key={dir}
                    onClick={() => setDirection(dir)}
                    className="py-2 px-3 text-sm font-medium text-left transition-colors"
                    style={
                      direction === dir
                        ? { background: "#FFD100", color: "#1A1A2E", border: "2px solid #FFD100" }
                        : { background: "transparent", color: "#FFFFFF", border: "2px solid #006BB7" }
                    }
                  >
                    → {headsigns[dir] ?? `Direction ${dir}`}
                  </button>
                ))}
              </div>

              {/* Non-arrival scroll wheel */}
              {direction !== null && (
                <div className="flex flex-col flex-1 px-4 pb-4">
                  <div
                    className="text-xs mb-1 shrink-0"
                    style={{ color: "#006BB7" }}
                  >
                    Times the ION will{" "}
                    <span style={{ color: "#FFD100" }} className="font-bold">NOT</span>{" "}
                    arrive · next 2 hrs · {notArrivingTimes.length} slots
                  </div>
                  <ScrollWheel times={notArrivingTimes} />
                  <div className="text-xs mt-3 shrink-0" style={{ color: "#444466" }}>
                    * Based on GRT GTFS schedule. The ION may also not arrive at scheduled times.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
