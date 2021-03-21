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

const { URLSearchParams } = require('url');
const getChsaDataForLatLon = require('../lib/getchsadataforlatlon');

module.exports = {
  get: async (req, res) => {

    res.header("Content-Type", "application/json");

    let success = false,
        errors = [],
        result = null,
        processedQueryParams = {}; // store lat/lon in numeric form

    const err = msg => errors.push(msg);
    const recognizedParams = ["lat", "lon"];

    // validate contents of lat/lon params and add to processed
    // params object
    recognizedParams.forEach(param => {
      if (typeof req.query[param] === "undefined") {
        err(`the following parameter is required: ${param}`);
      } else {
        let latLonPattern = /^-?\d+(\.\d+)?$/;
        if (!latLonPattern.test(req.query[param])) {
          err(`'${param}' should be a number`);
        } else {
          processedQueryParams[param] = parseFloat(param);
        }
      }
    });

    // trigger an error if lat is out of range (assuming it's provided)
    if (typeof processedQueryParams.lat === "number") {
      if (processedQueryParams.lat < -90 ||
          processedQueryParams.lat > 90) {
        err('invalid latitude');
      }
    }

    // trigger an error if lon is out of range (assuming it's provided)
    if (typeof processedQueryParams.lon === "number") {
      if (processedQueryParams.lon < -180 ||
          processedQueryParams.lon > 180) {
        err('invalid longitude');
      }
    }

    // trigger an error if there are any unrecognized parameters
    Object.keys(req.query).forEach(k => {
      if (!recognizedParams.includes(k)) {
        err("unrecognized parameter: '" + encodeURIComponent(k) + "'");
      }
    });    


    // perform necessary requests
    if (!errors.length) {

      let { lat, lon } = processedQueryParams;

      let apiResult = await getChsaDataForLatLon(lat, lon);

      success = true;
      result = JSON.parse(apiResult);
    }


    if (!errors.length && success) {
      res.send(JSON.stringify({ success, result }));
    } else {
      res.send(JSON.stringify({ success, errors }, null))
    }
  }
};