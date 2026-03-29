"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
  stopIds: Record<number, string>;
}

interface IonMapProps {
  stations: Station[];
  selectedStationId: string;
  onStationSelect: (id: string) => void;
}

export default function IonMap({ stations, selectedStationId, onStationSelect }: IonMapProps) {
  const routeLine = stations.map((s) => [s.lat, s.lon] as [number, number]);

  return (
    <MapContainer
      center={[43.455, -80.49]}
      zoom={13}
      className="w-full h-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={routeLine} color="#006bb7" weight={4} opacity={0.6} />
      {stations.map((station) => {
        const isSelected = station.id === selectedStationId;
        return (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lon]}
            radius={isSelected ? 12 : 8}
            pathOptions={{
              color: isSelected ? "#f87171" : "#006bb7",
              fillColor: isSelected ? "#ef4444" : "#ffffff",
              fillOpacity: 1,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{ click: () => onStationSelect(station.id) }}
          >
            <Tooltip direction="top" offset={[0, -10]}>{station.name}</Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
