import React, { useEffect, useRef, useState} from 'react';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { FeatureLayer } from 'react-esri-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { imageMapLayer } from 'esri-leaflet';
import Sidebar from './components/sidebar';
import states from './components/us_states';
import './App.css';

function App() {
  const defaultCenter = [55.9533456, -3.1883749];
  const defaultZoom = 8;

  const mapRef = useRef();
  const featureLayerRef1 = useRef(); // Coral Reefs
  const featureLayerRef2 = useRef(); // Cold Water Corals
  const featureLayerRef3 = useRef(); // Seagrass
  const featureLayerRef4 = useRef(); // Gray Seals
  const featureLayerRef5 = useRef(); // Protected Sites
  const featureLayerRef6 = useRef(); // Migratory Zones
  const featureLayerRef7 = useRef(); // Seamounts
  const featureLayerRef8 = useRef(); // Whales
  const featureLayerRef9 = useRef(); // Whales
  const featureLayerRef10 = useRef(); // Whales
  const featureLayerRef11 = useRef(); // Whales

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

    // State for layer visibility
    const [layerStates, setLayerStates] = useState({
      CoralReefs: false,
      Seagrass: false,
      GraySeals: false,
      ProtectedSites: false,
      MigratoryZones: false,
      Seamounts: false,
      Whales: false,
    });
  
    // Function to toggle layer visibility
    const toggleLayer = (layerKey) => {
      setLayerStates((prevState) => ({
        ...prevState,
        [layerKey]: !prevState[layerKey],
      }));
    };
  
    // Fly to coordinates
    const flyToCoordinates = (lat, lon) => {
      mapRef.current.flyTo([lat, lon], 8); // Zoom level 8 for a closer look
    };

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

{layerStates.CoralReefs && (
        <FeatureLayer
          ref={featureLayerRef1}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Coral_Reefs/FeatureServer/1"
          style={{ color: 'blue', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Coral Reef</b><br><b>Coral Reef Name:</b> ${feature.properties.name}<br><b>Species:</b> ${feature.properties.species}`);
          }}
        />
)}
{layerStates.CoralReefs && (
        <FeatureLayer
          ref={featureLayerRef2}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Cold_water_Corals/FeatureServer/1"
          style={{ color: 'red', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Cold Water Corals</b><br><b>Coral Reef Name:</b>  ${feature.properties.name}<br><b>Species:</b> ${feature.properties.species}`);
          }}
        />
        )}
{layerStates.Seagrass && (
        <FeatureLayer
          ref={featureLayerRef3}
          url="https://data-gis.unep-wcmc.org/server/rest/services/HabitatsAndBiotopes/Global_Distribution_of_Seagrasses/FeatureServer/1"
          style={{ color: 'green', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Seagrass</b><br><b>Species:</b> ${feature.properties.scientific}`);
          }}
        />
)}
{layerStates.GraySeals && (
        <FeatureLayer
          ref={featureLayerRef4}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/Kaschner_003_GreySeal2013/FeatureServer/0"
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 6,
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
        )}

{layerStates.ProtectedSites && (
<FeatureLayer
  ref={featureLayerRef5}
  url="https://data-gis.unep-wcmc.org/server/rest/services/ProtectedSites/The_World_Database_of_Protected_Areas/FeatureServer/0"
  pointToLayer={(feature, latlng) => {
    // Check if the property "marine" equals "Marine" (2)
    if (feature.properties.marine === "2") {
      return L.circleMarker(latlng, {
        radius: 6,
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
)}

{layerStates.MigratoryZones && (
<FeatureLayer
          ref={featureLayerRef6}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/MiCO_MigratoryConnectivityInTheOcean/FeatureServer/2"
          style={{ color: 'red', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Migration Corridor</b><br><b>Species:</b>  ${feature.properties.common_nam}<br><b>Description:</b> ${feature.properties.dscrptn}`);
          }}
        />
        )}
{layerStates.Seamounts && (
<FeatureLayer
          ref={featureLayerRef7}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/ZSL_ModelledSeamountsKnolls2011/FeatureServer/4"
          style={{ color: 'red', weight: 1 }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Seamount</b><br><b>Area:</b>  ${feature.properties.area2d}<br><b>Depth:</b> ${feature.properties.depth}`);
          }}
        />
      )}

        {layerStates.Whales && (
<FeatureLayer
          ref={featureLayerRef8}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/Kaschner_005_NorthernBottlenoseWhale/FeatureServer/0"
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: 'green',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5,
            });
          }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Northern Bottlenose Whales</b><br><b>Species:</b>  ${feature.properties.species}`);
          }}
        />
      )}

        {layerStates.Whales && (
<FeatureLayer
          ref={featureLayerRef9}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/Kaschner_006_SpermWhale2013/FeatureServer/0"
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: 'green',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5,
            });
          }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Sperm Whales</b><br><b>Species:</b>  ${feature.properties.species}`);
          }}
        />
      )}

        {layerStates.Whales && (
<FeatureLayer
          ref={featureLayerRef10}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/Kaschner_012_MelonHeadedWhale2013/FeatureServer/0"
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: 'green',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5,
            });
          }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Melon-Headed Whales</b><br><b>Species:</b>  ${feature.properties.species}`);
          }}
        />
      )}

        {layerStates.Whales && (
<FeatureLayer
          ref={featureLayerRef11}
          url="https://data-gis.unep-wcmc.org/server/rest/services/Hosted/Kaschner_009_SeiWhale2013/FeatureServer/0"
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 6,
              fillColor: 'green',
              color: '#000',
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5,
            });
          }}
          where="1=1"
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`<b>Sei Whales</b><br><br><b>Species:</b>  ${feature.properties.species}`);
          }}
        />
        )}

      </MapContainer>
      <Sidebar
        layerStates={layerStates}
        toggleLayer={toggleLayer}
        flyToCallback={flyToCoordinates}
      />
    </div>
  );
}

export default App;