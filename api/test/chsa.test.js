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

const chai = require('chai');
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require('../app');
const fetch = require('node-fetch');

chai.should();
chai.use(chaiHttp);

describe('API', function() {

  it('should respond with 404 at root', () => {
    chai.request(app).get('/').end(function (err, res) {
      res.status.should.equal(404);
    });
  });


  it('should respond with 200 at /api/v1/chsa', () => {
    chai.request(app).get('/api/v1/chsa').end(function (err, res) {
      res.status.should.equal(200);
    });
  }); 


  it('should respond with errors if no lat/lon params were provided', () => {
    chai.request(app).get('/api/v1/chsa').end(function (err, res) {
      let j = JSON.parse(res.text);
      expect(j.errors).to.have.length.greaterThanOrEqual(2);
    });
  });

  // lat lon combinations that should fail
  [
    [{ lat: 0, lon: 0 }] // test null island
  ]
  .forEach(([{ lat, lon }, result]) => {
    it(`should respond with error for ${lat},${lon}`, () => {
      chai.request(app).get('/api/v1/chsa').end(function (err, res) {
        let j = JSON.parse(res.text);
        expect(j.errors).to.have.length.greaterThanOrEqual(2);
      });
    });
  });


});