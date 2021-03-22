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

const fetch = require('node-fetch');

/**
 * fetch results of response 
 * @param  float lat
 *   the latitude
 * @param  float lon
 *   the longitude
 * @return json returns the json received from the openmaps API call
 */
async function getChsaDataForLatLon(lat, lon) {
  let params = new URLSearchParams;

  [
    ["service", "WFS"],
    ["version", "1.0.0"],
    ["request", "GetFeature"],
    ["typeName", "pub:WHSE_ADMIN_BOUNDARIES.BCHA_CMNTY_HEALTH_SERV_AREA_SP"],
    ["srsname", "EPSG:4326"],
    ["cql_filter", `INTERSECTS(SHAPE,SRID=4326;POINT(${[lon, lat].join(" ").replace(/[^-\d\. ]/g, "")}))`],
    ["propertyName", "CMNTY_HLTH_SERV_AREA_CODE,CMNTY_HLTH_SERV_AREA_NAME"],
    ["outputFormat", "application/json"]

  ].forEach(([k,v]) => {
    params.set(k, v);
  });

  console.log("Sending request to https://openmaps.gov.bc.ca/geo/pub/ows?" + params);

  let result = await fetch("https://openmaps.gov.bc.ca/geo/pub/ows?" + params);

  return result.text();
}


module.exports = getChsaDataForLatLon;



// (async () => {

  
  
//   Unmatched example (e.g. for 0, 0):

// {"type":"FeatureCollection","features":[],"totalFeatures":0,"numberMatched":0,"numberReturned":0,"timeStamp":"2021-03-21T05:42:55.744Z","crs":null}


//   Error example (e.g. for empty strings) - note the returned XML!
//   getChsaDataForLatLon("", "");

// <?xml version="1.0" ?>
// <ServiceExceptionReport
//    version="1.2.0"
//    xmlns="http://www.opengis.net/ogc"
//    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
//    xsi:schemaLocation="http://www.opengis.net/ogc http://schemas.opengis.net/wfs/1.0.0/OGC-exception.xsd">
//    <ServiceException>
//       Could not parse CQL filter list.
// org.geotools.filter.LiteralExpressionImpl cannot be cast to org.locationtech.jts.geom.Coordinate Parsing : INTERSECTS(SHAPE,SRID=4326;POINT)).
// </ServiceException></ServiceExceptionReport>


//   Error example for network problems. Throws FetchError with error.code set to ENOTFOUND




   


//   let result = await getChsaDataForLatLon("","").catch(function (e) {
//     console.log(e.code);
//   });
//   console.log(result);

// })();