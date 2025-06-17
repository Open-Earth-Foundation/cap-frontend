import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Cache for geocoding results
const geocodeCache = new Map();

const MapView = ({ city }) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const geocodeCity = async () => {
      if (city?.name && city?.regionName) {
        const cacheKey = `${city.name},${city.regionName}`;

        // Check cache first
        if (geocodeCache.has(cacheKey)) {
          setPosition(geocodeCache.get(cacheKey));
          return;
        }

        try {
          // Format the query for Nominatim
          const query = `${city.name}, ${city.regionName}, Brazil`;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
            {
              headers: {
                'User-Agent': 'CAP-City-Viewer/1.0 (https://github.com/your-repo)'
              }
            }
          );
          const data = await response.json();

          if (data && data.length > 0) {
            const coords = {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            };

            // Cache the result
            geocodeCache.set(cacheKey, coords);
            setPosition(coords);
          }
        } catch (error) {
          console.error('Error geocoding city:', error);
        }
      }
    };

    geocodeCity();
  }, [city]);
  return (
    <div className="map-container">
      <div className="map-wrapper">
        {position && <MapContainer
          center={position}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {position && (
            <Marker position={position}>
              <Popup>
                <strong>{city.name}</strong>
                <br />
                {city.regionName}
              </Popup>
            </Marker>
          )}
        </MapContainer>
        }
      </div>
    </div>
  );
};

export default MapView;