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
const fetch = require('node-fetch');

module.exports = {
  get: async (req, res) => {

    // send "beacon" (full request) to the apiaccess tracking service if specified
    if (process.env.APIACCESS_ENDPOINT) {
      try {
        await fetch(process.env.APIACCESS_ENDPOINT, { method: "POST" }); // we don't concern ourselves with the result, but let's wait for it to complete
      } catch (e) {
        console.error(e);
      }
    }

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
        err(`The following parameter is required: ${param}`);
      } else {
        let latLonPattern = /^-?\d+(\.\d+)?$/;
        if (!latLonPattern.test(req.query[param])) {
          err(`'${param}' should be a number. Please ensure that ${param} does not include any non-numeric characters.`);
        } else {
          processedQueryParams[param] = parseFloat(req.query[param]);
        }
      }
    });

    // trigger an error if lat is out of range (assuming it's provided)
    if (typeof processedQueryParams.lat === "number") {
      if (processedQueryParams.lat < -90 ||
          processedQueryParams.lat > 90) {
        err('Invalid latitude. Valid latitudes are numbers between -90 and 90.');
      }
    }

    // trigger an error if lon is out of range (assuming it's provided)
    if (typeof processedQueryParams.lon === "number") {
      if (processedQueryParams.lon < -180 ||
          processedQueryParams.lon > 180) {
        err('Invalid longitude. Valid longitudes are numbers between -180 and 180.');
      }
    }

    // trigger an error if there are any unrecognized parameters
    Object.keys(req.query).forEach(k => {
      if (!recognizedParams.includes(k)) {
        err("Unrecognized parameter: '" + encodeURIComponent(k) + "'");
      }
    });    


    // perform necessary requests
    if (!errors.length) {

      let { lat, lon } = processedQueryParams;
      let apiResult = await getChsaDataForLatLon(lat, lon);

      try {
        result = JSON.parse(apiResult);
        if (!result.numberMatched) {
          err("That point appears to be outside of BC. Please choose a latitude/longitude combination that is inside of BC and ensure that the latitude and longitude values haven't accidentally been swapped.");
        } else {
          if (result.features &&
              result.features.length &&
              result.features[0].properties &&
              result.features[0].properties.CMNTY_HLTH_SERV_AREA_NAME) {
            result = result.features[0].properties.CMNTY_HLTH_SERV_AREA_NAME;
            success = true;
          } else {
            err("The upstream API returned an unexpected response. Please try again later or contact the website administrator.")
          }
        }
      } catch (e) {
        err("An unknown error occurred."); // @todo the API probably returned XML instead, and that error message might be useful, but this is good enough for now
      }
    }


    if (!errors.length && success) {
      res.send(JSON.stringify({ success, result }));
    } else {
      res.send(JSON.stringify({ success, errors }, null))
    }
  }
};