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
  const featureLayerRef4 = useRef(); // Greay Seals

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

  function handleLocationSelection(lat, lon) {
    handleMapFly([lat, lon]);
  }

  function handleMapFly(coordinates) {
    const map = mapRef.current;
    if (map) {
      map.flyTo(coordinates, 8, {
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
            layer.bindPopup(`<b>Coral Reef</b><br><b>Coral Reef Name:</b> ${feature.properties.name}<br><b>Species:</b> ${feature.properties.species}`);
          }}
        />

        <FeatureLayer
          ref={featureLayerRef2}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Cold_water_Corals/FeatureServer/1"
          style={{ color: 'red', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Cold Water Corals</b><br><b>Coral Reef Name:</b>  ${feature.properties.name}<br><b>Species:</b> ${feature.properties.species}`);
          }}
        />

        <FeatureLayer
          ref={featureLayerRef3}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Seagrasses/FeatureServer/1"
          style={{ color: 'green', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Seagrass</b><br><b>Species:</b> ${feature.properties.scientific}`);
          }}
        />

        <FeatureLayer
          ref={featureLayerRef4}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/Kaschner_003_GreySeal2013/FeatureServer/0"
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 4.5,
              fillColor: 'orange',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5,
            });
          }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `<b>Grey Seal Population</b><br><b>Species:</b> ${feature.properties.species}`
            );
          }}
        /> 

<FeatureLayer
  ref={featureLayerRef4}
  url="https://data-gis.unep-wcmc.org/server/rest/services/ProtectedSites/The_World_Database_of_Protected_Areas/FeatureServer/0"
  pointToLayer={(feature, latlng) => {
    // Check if the property "marine" equals "Marine" (2)
    if (feature.properties.marine === "2") {
      return L.circleMarker(latlng, {
        radius: 4.5,
        fillColor: 'black',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.5,
      });
    }
    // Return an empty layer for non-matching features
    return L.layerGroup(); // This returns an empty layer safely
  }}
  onEachFeature={(feature, layer) => {
    // Only bind popup if the layer is a circle marker (i.e., when the condition is met)
    if (feature.properties && feature.properties.marine === "2") {
      layer.bindPopup(
        `<b>Marine Protected Area</b><br><b>Name:</b> ${feature.properties.desig}`
      );
    }
  }}
/>

      </MapContainer>
      <Sidebar callback={handleLocationSelection}></Sidebar>
    </div>
  );
}

export default App;