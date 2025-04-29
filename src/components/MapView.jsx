import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const getCityCoordinates = (cityName, cityData) => {
  return cityData.find(city => city.name === cityName)?.coordinates;
};

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapContent = ({ selectedCity, onCitySelect, cityData }) => {
  const map = useMap();
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch('/brazil-states.geojson');
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error('Error loading GeoJSON:', error);
      }
    };

    loadGeoJson();
  }, []);

  useEffect(() => {
    if (selectedCity && cityData) {
      const coordinates = getCityCoordinates(selectedCity, cityData);
      if (coordinates) {
        map.setView([coordinates.lat, coordinates.lng], 12);
      }
    }
  }, [selectedCity, cityData, map]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        const cityName = feature.properties.name;
        onCitySelect(cityName);
      }
    });
  };

  const getStyle = (feature) => {
    return {
      fillColor: '#4B4C63',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  return geoJsonData ? (
    <GeoJSON
      data={geoJsonData}
      style={getStyle}
      onEachFeature={onEachFeature}
    />
  ) : null;
};

const MapView = ({ selectedCity, onCitySelect }) => {
  const { t } = useTranslation();
  const [cityData, setCityData] = useState(null);

  useEffect(() => {
    const loadCityData = async () => {
      const data = await getCityData();
      setCityData(data);
    };
    loadCityData();
  }, []);

  return (
    <div className="map-container">
      <h2 className="text-2xl font-bold mb-4">{t('selectCity')}</h2>
      <div className="map-wrapper">
        <MapContainer
          center={[-15.77972, -47.92972]}
          zoom={4}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapContent
            selectedCity={selectedCity}
            onCitySelect={onCitySelect}
            cityData={cityData}
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;