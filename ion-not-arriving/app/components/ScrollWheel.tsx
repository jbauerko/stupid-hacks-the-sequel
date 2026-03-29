"use client";

import { useRef, useEffect } from "react";

interface ScrollWheelProps {
  times: string[];
}

const ITEM_HEIGHT = 48;
const VISIBLE_ITEMS = 5;

export default function ScrollWheel({ times }: ScrollWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top when times list changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [times]);

  if (times.length === 0) return null;

  const containerHeight = ITEM_HEIGHT * VISIBLE_ITEMS;
  const padding = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

  return (
    <div className="relative w-full select-none" style={{ height: containerHeight }}>
      {/* Fade top */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none"
        style={{
          height: padding,
          background: "linear-gradient(to bottom, #1A1A2E, transparent)", // #1A1A2E = page bg
        }}
      />
      {/* Highlight band */}
      <div
        className="absolute inset-x-0 z-10 pointer-events-none"
        style={{
          top: padding,
          height: ITEM_HEIGHT,
          borderTop: "2px solid #FFD100",   // #FFD100 = ION Yellow
          borderBottom: "2px solid #FFD100",
          background: "rgba(0, 107, 183, 0.15)", // #006BB7 = ION Blue, low opacity
        }}
      />
      {/* Fade bottom */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: padding,
          background: "linear-gradient(to top, #1A1A2E, transparent)", // #1A1A2E = page bg
        }}
      />

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-scroll"
        style={{
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* Top padding */}
        <div style={{ height: padding }} />

        {times.map((time) => (
          <div
            key={time}
            className="flex items-center justify-center font-mono text-lg"
          style={{ color: "#FFFFFF" }} // #FFFFFF = white
            style={{ height: ITEM_HEIGHT, scrollSnapAlign: "center" }}
          >
            {time}
          </div>
        ))}

        {/* Bottom padding */}
        <div style={{ height: padding }} />
      </div>
    </div>
  );
}
