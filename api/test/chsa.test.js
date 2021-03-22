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
    [{ lat: 0, lon: 0 }], // test null island
    [{ lat: "asdf", lon: "foobar" }], // garbage input
    [{ lat: 51.613105869480606, lon: -129.16662513534297}] // out at sea
  ]
  .forEach(([{ lat, lon }, result]) => {
    it(`should respond with error for ${lat},${lon}`, () => {
      chai.request(app).get(`/api/v1/chsa?lat=${lat}&lon=${lon}`).end(function (err, res) {
        let j = JSON.parse(res.text);
        expect(j.errors).to.have.length.greaterThanOrEqual(1);
      });
    });
  });


  // spot test a couple of locations
  [
    [
      "/api/v1/chsa?lat=52.37254609262492&lon=-126.75565124477541",
      {"success":true,"result":"Bella Coola Valley"}
    ],

    [
      "/api/v1/chsa?lat=53.64491982000028&lon=-123.3486644999843",
      {"success":true,"result":"Prince George Southwest Rural"}
    ]    
  ]
  .forEach( 
    ([path, expectedResult]) => {

      it(`should return the correct value for ${path}`, () => {

        chai.request(app).get(path).end(function (err, res) {

          let j = JSON.parse(res.text);
          expect(j).to.deep.equal(expectedResult);

        });

      });

    }
  );


});