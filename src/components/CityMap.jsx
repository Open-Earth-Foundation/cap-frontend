import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

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
        const apiUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(selectedCity)}&format=json&polygon_geojson=1`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data.length > 0) {
          const { lat, lon } = data[0]; // Get city coordinates
          let polygon = data[0].geojson ? data[0].geojson.coordinates : null; // Get city polygon if available

          // Handle MultiPolygon (nested array) and Polygon (single array)
          if (polygon && data[0].geojson.type === "MultiPolygon") {
            polygon = polygon.flat(2); // Flatten MultiPolygon coordinates
          } else if (polygon && data[0].geojson.type === "Polygon") {
            polygon = polygon[0]; // For Polygon, use the first array of coordinates
          }

          // Reverse the coordinates if they are in [lon, lat] format (as returned by Nominatim)
          const adjustedPolygon = polygon.map(point => [point[1], point[0]]);

          setCityCoordinates([parseFloat(lat), parseFloat(lon)]);
          setCityPolygon(adjustedPolygon);
        } else {
          setError('City coordinates not found');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCityData();
  }, [selectedCity]);

  if (loading) return <p>Loading map for {selectedCity}...</p>;
  if (error) return <p>Error loading map: {error}</p>;

  return cityCoordinates ? (
    <MapContainer
      center={cityCoordinates} // Use city coordinates to center the map
      zoom={13}
      style={{ zIndex: '0', height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Add a marker at the city's coordinates */}
      <Marker position={cityCoordinates} />

      {/* If a polygon is available, render it */}
      {cityPolygon && <Polygon positions={cityPolygon} />}
    </MapContainer>
  ) : (
    <p>No coordinates available for {selectedCity}.</p>
  );
};

export default CityMap;