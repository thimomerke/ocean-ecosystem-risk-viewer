// Sidebar.js

import React from 'react';

export default function Sidebar(props) {
  const locInput = React.useRef();
  const lonInput = React.useRef();
  const latInput = React.useRef();

  // Fetch coordinates for a new city/address
  const fetchCoordinates = (e) => {
    e.preventDefault();

    const locName = locInput.current.value;
    fetch(`https://nominatim.openstreetmap.org/search?q=${locName}&format=json`, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          props.flyToCallback(data[0].lat, data[0].lon);
        } else {
          alert("Location not found.");
        }
      });
  };

  const flyToCoordinates = (e) => {
    e.preventDefault();
    props.flyToCallback(latInput.current.value, lonInput.current.value);
  };

  return (
    <div className="sidebar">
      <h3>Location Search</h3>
      
      <p>Enter location by name:</p>
      <form className="find-location-form" onSubmit={fetchCoordinates}>
        <input
          ref={locInput}
          type="text"
          placeholder="e.g. Berlin"
          className="form-control input-md"
          required
        />
        <button type="submit">Submit</button>
      </form>

      <p>Or by precise coordinates:</p>
      <form className="find-location-form" onSubmit={flyToCoordinates}>
        <input
          ref={latInput}
          type="text"
          placeholder="Latitude"
          className="form-control input-md"
          required
        />
        <input
          ref={lonInput}
          type="text"
          placeholder="Longitude"
          className="form-control input-md"
          required
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Toggle Layers</h3>
      {Object.keys(props.layerStates).map((layerKey) => (
        <div key={layerKey}>
          <label>
            <input
              type="checkbox"
              checked={props.layerStates[layerKey]}
              onChange={() => props.toggleLayer(layerKey)}
            />
            {layerKey}
          </label>
        </div>
      ))}
    </div>
  );
}