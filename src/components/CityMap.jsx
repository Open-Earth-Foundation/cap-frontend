import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Custom hook to fit bounds
const FitBoundsToPolygon = ({ polygon }) => {
  const map = useMap();

  useEffect(() => {
    if (polygon && polygon.length > 0) {
      // Create bounds from polygon coordinates
      const bounds = polygon.reduce((bounds, coordinate) => {
        return bounds.extend(coordinate);
      }, map.getBounds());

      // Fit the map to the polygon bounds with some padding
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 13, // Limit maximum zoom level
      });
    }
  }, [map, polygon]);

  return null;
};

const CityMap = ({ selectedCity }) => {
  const [cityCoordinates, setCityCoordinates] = useState(null);
  const [cityPolygon, setCityPolygon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedCity) return;

    setLoading(true);
    setError(null);

    const fetchCityData = async () => {
      try {
        const apiUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(selectedCity)}&format=json&polygon_geojson=1&addressdetails=1`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          let polygon = data[0].geojson ? data[0].geojson.coordinates : null;

          // Handle different types of polygons
          if (polygon) {
            let coordinateArray;

            if (data[0].geojson.type === "MultiPolygon") {
              // Get the largest polygon from MultiPolygon
              coordinateArray = polygon.reduce((largest, current) => {
                const currentArea = current[0].length;
                const largestArea = largest[0].length;
                return currentArea > largestArea ? current : largest;
              })[0];
            } else if (data[0].geojson.type === "Polygon") {
              coordinateArray = polygon[0];
            }

            // Convert coordinates to [lat, lng] format
            const adjustedPolygon = coordinateArray.map((point) => [
              point[1],
              point[0],
            ]);
            setCityPolygon(adjustedPolygon);
          }

          setCityCoordinates([parseFloat(lat), parseFloat(lon)]);
        } else {
          setError("City coordinates not found");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCityData();
  }, [selectedCity]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
        <p className="text-gray-600">Loading map for {selectedCity}...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
        <p className="text-red-500">Error loading map: {error}</p>
      </div>
    );

  return cityCoordinates ? (
    <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={cityCoordinates}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={cityCoordinates} />
        {cityPolygon && (
          <>
            <Polygon
              positions={cityPolygon}
              pathOptions={{
                color: "blue",
                weight: 2,
                fillColor: "blue",
                fillOpacity: 0.1,
              }}
            />
            <FitBoundsToPolygon polygon={cityPolygon} />
          </>
        )}
      </MapContainer>
    </div>
  ) : (
    <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
      <p className="text-gray-600">
        No coordinates available for {selectedCity}.
      </p>
    </div>
  );
};

export default CityMap;
