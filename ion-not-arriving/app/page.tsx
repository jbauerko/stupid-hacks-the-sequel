"use client";

import { useState } from "react";

// Ion Route 301 stops (simplified, direction: Fairway → Conestoga)
const STOPS = [
  { id: "fairway", name: "Fairway" },
  { id: "pioneer", name: "Pioneer Park" },
  { id: "block_line", name: "Block Line" },
  { id: "fairview", name: "Fairview Park Mall" },
  { id: "idlewood", name: "Idlewood" },
  { id: "ottawa", name: "Ottawa" },
  { id: "mill", name: "Mill" },
  { id: "central", name: "Central Station" },
  { id: "king_univ", name: "King / University" },
  { id: "laurier", name: "Laurier / Waterloo" },
  { id: "uw_davis", name: "University of Waterloo" },
  { id: "research", name: "Research & Technology" },
  { id: "northfield", name: "Northfield" },
  { id: "columbia", name: "Columbia" },
  { id: "conestoga", name: "Conestoga" },
];

// Ion runs roughly every 8 minutes, 6am–midnight weekdays.
// These are approximate scheduled arrival minutes past each hour.
const ARRIVAL_MINUTES = [0, 8, 16, 24, 32, 40, 48, 56];

function getNotArrivingTimes(stopId: string): string[] {
  if (!stopId) return [];

  const stopIndex = STOPS.findIndex((s) => s.id === stopId);
  // Each stop adds ~1 min travel time from Fairway
  const offsetMinutes = stopIndex;

  const arrivingMinutes = new Set(
    ARRIVAL_MINUTES.map((m) => (m + offsetMinutes) % 60)
  );

  const notArriving: string[] = [];
  const now = new Date();
  const currentHour = now.getHours();

  // Show the next 2 hours of non-arrival times
  for (let h = currentHour; h < currentHour + 2; h++) {
    const displayHour = h % 24;
    for (let min = 0; min < 60; min++) {
      if (!arrivingMinutes.has(min)) {
        const ampm = displayHour >= 12 ? "PM" : "AM";
        const hour12 = displayHour % 12 || 12;
        const minStr = String(min).padStart(2, "0");
        notArriving.push(`${hour12}:${minStr} ${ampm}`);
      }
    }
  }

  return notArriving;
}

export default function Home() {
  const [selectedStop, setSelectedStop] = useState("");

  const notArrivingTimes = getNotArrivingTimes(selectedStop);
  const selectedStopName = STOPS.find((s) => s.id === selectedStop)?.name;

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-400 mb-2">
            Ion Not Arriving
          </h1>
          <p className="text-gray-400 text-lg">
            The Waterloo Region transit planner that tells you exactly when the
            Ion will{" "}
            <span className="line-through text-gray-600">arrive</span>{" "}
            <span className="text-red-400 font-semibold">NOT arrive</span>.
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select your stop
          </label>
          <select
            value={selectedStop}
            onChange={(e) => setSelectedStop(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">-- Choose a stop --</option>
            {STOPS.map((stop) => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
        </div>

        {selectedStop && (
          <div>
            <h2 className="text-xl font-semibold text-gray-200 mb-1">
              Times the Ion will{" "}
              <span className="text-red-400 underline">NOT</span> arrive at{" "}
              <span className="text-white">{selectedStopName}</span>
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              (next 2 hours · {notArrivingTimes.length} non-arrivals found)
            </p>
            <div className="grid grid-cols-4 gap-2">
              {notArrivingTimes.map((time) => (
                <div
                  key={time}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-center text-sm text-gray-300"
                >
                  {time}
                </div>
              ))}
            </div>
            <p className="mt-6 text-gray-600 text-xs italic">
              * Based on the scheduled timetable. The Ion may also not arrive at
              scheduled times.
            </p>
          </div>
        )}

        {!selectedStop && (
          <div className="text-center text-gray-600 mt-16 text-6xl">🚋</div>
        )}
      </div>
    </main>
  );
}
