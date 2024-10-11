// Sidebar.js

import React from 'react';
import states from './us_states';

export default function Sidebar(props) {
  const [optionState, setOptionState] = React.useState(states[0]);

  function handleStateChange(event) {
    const selectedState = states.find((state) => state.name === event.target.value);
    setOptionState(selectedState);
    props.callback(selectedState);
  }

  return (
    <div className="sidebar">
      <select name="state" onChange={handleStateChange} multiple>
        {states.map((state) => (
          <option key={state.name} value={state.name}>
            {state.name}
          </option>
        ))}
      </select>
      <p>{`You selected ${optionState.name}`}</p>
    </div>
  );
}