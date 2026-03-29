"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const MODES = [
  { id: "ik", label: "ik", description: "ion know" },
  { id: "idk", label: "idk", description: "ion don't know" },
  { id: "2016", label: "2016", description: "2016 mode" },
];

export default function ModePage() {
  const [spinning, setSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [finalMode, setFinalMode] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  function spin() {
    if (spinning) return;
    setSpinning(true);
    setFinalMode(null);

    let speed = 50;
    let ticks = 0;
    const totalTicks = 20 + Math.floor(Math.random() * 10);

    function tick() {
      setSelectedIndex((prev) => (prev + 1) % MODES.length);
      ticks++;

      if (ticks >= totalTicks) {
        setSpinning(false);
        setSelectedIndex((prev) => {
          setFinalMode(MODES[prev].id);
          return prev;
        });
        return;
      }

      // Slow down gradually
      speed = 50 + (ticks / totalTicks) * 300;
      intervalRef.current = setTimeout(tick, speed);
    }

    intervalRef.current = setTimeout(tick, speed);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, []);

  function handleGo() {
    if (!finalMode) return;
    router.push(`/map?mode=${finalMode}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#030712",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#f87171",
          marginBottom: "0.5rem",
        }}
      >
        choose your fate
      </h1>
      <p style={{ color: "#6b7280", marginBottom: "3rem", fontSize: "0.875rem" }}>
        spin the wheel of misfortune
      </p>

      {/* The spinner display */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "2.5rem",
        }}
      >
        {MODES.map((mode, i) => (
          <div
            key={mode.id}
            style={{
              padding: "1rem 3rem",
              borderRadius: "0.75rem",
              border: `2px solid ${
                i === selectedIndex ? "#f87171" : "#1f2937"
              }`,
              background:
                i === selectedIndex
                  ? finalMode
                    ? "#7f1d1d"
                    : "#1c1917"
                  : "#111827",
              color: i === selectedIndex ? "#fff" : "#4b5563",
              fontSize: "1.5rem",
              fontWeight: i === selectedIndex ? "bold" : "normal",
              minWidth: "250px",
              textAlign: "center",
              transition: spinning ? "none" : "all 0.2s",
              transform: i === selectedIndex ? "scale(1.1)" : "scale(1)",
            }}
          >
            <span style={{ fontSize: "1.75rem" }}>{mode.label}</span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#9ca3af",
                marginLeft: "0.75rem",
              }}
            >
              ({mode.description})
            </span>
          </div>
        ))}
      </div>

      {/* Spin button */}
      {!finalMode && (
        <button
          onClick={spin}
          disabled={spinning}
          style={{
            background: spinning ? "#374151" : "#dc2626",
            color: "#fff",
            padding: "1rem 3rem",
            borderRadius: "0.5rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
            border: "none",
            cursor: spinning ? "not-allowed" : "pointer",
          }}
        >
          {spinning ? "spinning..." : "SPIN"}
        </button>
      )}

      {/* Go button after selection */}
      {finalMode && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <p style={{ color: "#9ca3af", fontSize: "0.875rem" }}>
            destiny has chosen:{" "}
            <span style={{ color: "#f87171", fontWeight: "bold" }}>
              {MODES.find((m) => m.id === finalMode)?.description}
            </span>
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setFinalMode(null)}
              style={{
                background: "#374151",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              spin again
            </button>
            <button
              onClick={handleGo}
              style={{
                background: "#dc2626",
                color: "#fff",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              accept my fate
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
