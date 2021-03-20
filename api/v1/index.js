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

const { Router } = require('express');
const glob = require('glob');
const path = require('path');

const routes = Router();


/**
 *
 * For every javascript in the ./routes directory,
 * create an endpoint at the corresponding relative path,
 * using exported callbacks named after http endpoints
 * (i.e. get, post, put, etc., but really only get at the moment)
 *
 * E.g. for ./routes/chsa.js, which has an export adhering to the
 * following structure, we create a route for GET requests to /chsa.
 * This can then be mounted, for example, at /api/v1/chsa
 * 
 * Example export structure:
 * 
 *    { get: (req, res) => . . . }
 *
 * @todo support endpoints that use http methods other than get
 */

let routeDir = path.resolve(path.join(__dirname, "routes"));
let routeFiles = glob.sync(`${routeDir}/**/*.js`);

routeFiles.forEach((file) => {
  const routeData = require(file);
  const routePath = file.substr(routeDir.length).slice(0,-3);


  if (routeData.get) {
    routes.get(routePath, routeData.get);
  }
});


module.exports = routes;