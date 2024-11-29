// Sidebar.js

import React from 'react';

export default function Sidebar({ layerStates, toggleLayer, flyToCallback }) {
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
          flyToCallback(data[0].lat, data[0].lon);
        } else {
          alert("Location not found.");
        }
      });
  };

  const flyToCoordinates = (e) => {
    e.preventDefault();
    flyToCallback(latInput.current.value, lonInput.current.value);
  };

  return (
    <div className="sidebar">
      <h2>Marine Ecosystem Viewer</h2>

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
          id="latBut"
          ref={latInput}
          type="text"
          placeholder="Latitude"
          className="form-control input-md"
          required
        />
        <input
          id="lonBut"
          ref={lonInput}
          type="text"
          placeholder="Longitude"
          className="form-control input-md"
          required
        />
        <button type="submit">Submit</button>
      </form>

      <div id="layers">
      <h3>Toggle Layers</h3>
      {Object.keys(layerStates).map((layerKey) => (
  <div key={layerKey}> {/* Optional spacing between items */}
    <label> {/* Center items vertically and add spacing */}
      <input
        type="checkbox"
        checked={layerStates[layerKey].visible}
        onChange={() => toggleLayer(layerKey)}
      />
      <span>{layerStates[layerKey].label}</span>
      {layerStates[layerKey].color !== "transparent" && (
      <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <circle cx="8" cy="8" r="6" stroke="#000000" strokeWidth="1" fill={layerStates[layerKey].color} />
      </svg>
      )}
    </label>
  </div>
))}
    </div>
    <div id="footer">
    <img id="cbs-logo" src="https://design.cbs.dk/wp-content/uploads/CBSlogo_extended_rgb_blue.svg" alt="CBS Logo"></img>
    <br></br>&copy;2024 Copenhagen Business School / Nordic ESG Lab, v1.2.1
    </div>
    </div>
  );
}