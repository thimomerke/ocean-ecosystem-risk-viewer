// Sidebar.js

import React from 'react';

export default function Sidebar(props) {
  const locInput = React.useRef();
  const lonInput = React.useRef();
  const latInput = React.useRef();

  //fetch coordinates for new city/adress
  const fetchCoordinates = (e) => {
    e.preventDefault()

    var locName = locInput.current.value
    //alert(cityName)
    fetch(`https://nominatim.openstreetmap.org/search?q=${locName}&format=json`, { method: 'GET' })
      .then(response => {
        return response.json()
      })
      .then(data => {
        props.callback(data[0].lat, data[0].lon);
      })
  }

  const flyToCoordinates = (e) => {
    e.preventDefault()

    props.callback(latInput.current.value, lonInput.current.value);
  }

  return (
    <div className="sidebar">
  Enter location by name
      <form className="find-location-form" onSubmit={fetchCoordinates}>
      <input ref={locInput} id="name" name="name" type="text" placeholder="e.g. Berlin" class="form-control input-md" required=""/>
      <button type="submit">Submit</button>
      </form>

      Or by precise coordinates
      <form className="find-location-form" onSubmit={flyToCoordinates}>
      <input ref={lonInput} id="name" name="name" type="text" placeholder="Longitude" class="form-control input-md" required=""/>
      <input ref={latInput} id="name" name="name" type="text" placeholder="Latitude" class="form-control input-md" required=""/>
      <button type="submit">Submit</button>
      </form>

    </div>
  );
}