/*
 *  Copyright 2021 Joe Taylor <joe@textninja.net>
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React, { useState } from 'react';
import './app.css';

export const App = () => {

  let [state, setState] = useState({latitude:"", longitude:""});

  // sets state according to onChange event properties
  const setStateAccordingly = e => {
    setState(
      current => ({ ...current, [e.target.name]: e.target.value })
    );
  };

  // I'd rather keep the submit button enabled in all cases, so this isn't used
  // in the JSX, but it's here if I change my mind...
  var submitDisabled = true;

  const validationErrors = {
    latitude: null,
    longitude: null
  };

  ["latitude", "longitude"].forEach(p => {

    if (!state[p]) {
      validationErrors[p] = `Enter a ${p}`;
      return; // not provided. don't enable submit button.
    } if (isNaN(state[p])) {
      validationErrors[p] = `${p[0].toUpperCase() + p.substr(1)} should be a number`;
      return;
    }

    submitDisabled = false;

  });

  return (<>
    <h1>mychsa</h1>
    <p className="subtitle">Find your Community Health Service Area</p>

    <div>
      <div className="field-row">
        <input type="text" value={state.latitude}
          name="latitude"
          onChange={setStateAccordingly} />
        <div className={validationErrors.latitude?"":"ready"}>{validationErrors.latitude || ["Enter a latitude ",<span>✅</span>]}</div>
      </div>
      <div className="field-row">
        <input type="text" value={state.longitude}
          name="longitude"
          onChange={setStateAccordingly} />
        <div className={validationErrors.longitude?"":"ready"}>{validationErrors.longitude || ["Enter a longitude ",<span>✅</span>]}</div>
      </div>
      <input type="button" value="Submit" />
    </div>
  </>);
};