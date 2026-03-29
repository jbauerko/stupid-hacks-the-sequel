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
  routePaths: Record<number, [number, number][]>;
  selectedStationId: string;
  onStationSelect: (id: string) => void;
}

export default function IonMap({ stations, routePaths, selectedStationId, onStationSelect }: IonMapProps) {
  return (
    <MapContainer
      center={[43.455, -80.49]}
      zoom={13}
      className="w-full h-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route lines — #006BB7 = ION Blue */}
      {routePaths[0] && (
        <Polyline positions={routePaths[0]} color="#006BB7" weight={5} opacity={0.8} />
      )}
      {routePaths[1] && (
        <Polyline positions={routePaths[1]} color="#006BB7" weight={3} opacity={0.4} />
      )}

      {stations.map((station) => {
        const isSelected = station.id === selectedStationId;
        return (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lon]}
            radius={isSelected ? 11 : 7}
            pathOptions={{
              color: "#006BB7",             // #006BB7 = ION Blue (stroke)
              fillColor: isSelected
                ? "#FFD100"                 // #FFD100 = ION Yellow (selected fill)
                : "#FFFFFF",               // #FFFFFF = White (default fill)
              fillOpacity: 1,
              weight: isSelected ? 3 : 2,
            }}
            eventHandlers={{ click: () => onStationSelect(station.id) }}
          >
            <Tooltip direction="top" offset={[0, -10]} className="ion-tooltip">
              {station.name}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
