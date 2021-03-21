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

export const App = () => {

  let [state, setState] = useState({latitude:"", longitude:""});

  // sets state according to onChange event properties
  const setStateAccordingly = e => {
    setState(
      current => ({ ...current, [e.target.name]: e.target.value })
    );
  };

  return (<>
    <h1>mychsa</h1>
    <p class="subtitle">Find your Community Health Service Area</p>

    <div>
      <div>
        <label>Latitude:</label>
        <input type="text" value={state.latitude}
          name="latitude"
          onChange={setStateAccordingly} />
      </div>
      <div>
        <label>Longitude:</label>
        <input type="text" value={state.longitude}
          name="longitude"
          onChange={setStateAccordingly} />
      </div>
      <input type="button" value="Submit"/>
    </div>
  </>);
};