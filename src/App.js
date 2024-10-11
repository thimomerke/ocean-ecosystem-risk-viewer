import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { FeatureLayer } from 'react-esri-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from './components/sidebar';
import states from './components/us_states';
import './App.css';

function App() {
  const defaultCenter = [55.9533456, -3.1883749];
  const defaultZoom = 8;

  const mapRef = useRef();
  const featureLayerRef1 = useRef();
  const featureLayerRef2 = useRef();
  const featureLayerRef3 = useRef();

  let moveTimeout;
  const handleMoveEnd = () => {
    const map = mapRef.current;
    if (moveTimeout) clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      if (map) {
        const bounds = map.getBounds();
        const bbox = [
          bounds.getWest(),
          bounds.getSouth(),
          bounds.getEast(),
          bounds.getNorth(),
        ].join(',');

        // Update the where clause for your feature layers here
        // Example:
        // featureLayerRef1.current.setWhere(`intersects(shape, envelope(${bbox}))`);
      }
    }, 300); // 300ms delay before sending the request
  };

  const [optionState, setOptionState] = React.useState(states[0]);

  function handleStateSelection(selectedState) {
    setOptionState(selectedState);
    handleMapFly([selectedState.latitude, selectedState.longitude]);
  }

  function handleMapFly(coordinates) {
    const map = mapRef.current;
    if (map) {
      map.flyTo(coordinates, 6.5, {
        duration: 2,
      });
    }
  }

  return (
    <div className="App">
      <MapContainer
        className="map-container"
        style={{ width: '70vw', height: '100vh' }} // Add this line
        center={defaultCenter}
        zoom={defaultZoom}
        maxZoom={12}
        minZoom={7}
        crs={L.CRS.EPSG3857}
        ref={mapRef}
        whenCreated={(mapInstance) => {
          mapInstance.on('moveend', handleMoveEnd);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <FeatureLayer
          ref={featureLayerRef1}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs/FeatureServer/1"
          style={{ color: 'blue', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Coral Reef ID:</b> ${feature.properties.name}`);
          }}
        />

        <FeatureLayer
          ref={featureLayerRef2}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Cold_water_Corals/FeatureServer/1"
          style={{ color: 'red', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Coral Reef ID:</b> ${feature.properties.name}`);
          }}
        />

        <FeatureLayer
          ref={featureLayerRef3}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Seagrasses/FeatureServer"
          style={{ color: 'green', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Coral Reef ID:</b> ${feature.properties.name}`);
          }}
        />
      </MapContainer>
      <Sidebar callback={handleStateSelection}></Sidebar>
    </div>
  );
}

export default App;