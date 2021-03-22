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

const express = require('express');
const app = express();
const mysql = require('mysql');

app.post("/accessevent", (req, res) => {

  var connection = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    port     : process.env.MYSQL_PORT,
  });

  connection.connect();
  connection.query("insert into accesslogs (time) values (now());", (err,results) => {
    console.log("api access event received");
    res.set("Content-Type", "application/json");
    res.send("{ success: true }");    
    connection.end();    
  });

});

let server = app.listen(8080, () => {
  console.log("Listening on port 8080");
});

// handle sigint and sigterm gracefully

const signals = {
  "SIGINT": "Interrupted",
  "SIGTERM": "Terminated"
};

Object.entries(signals).forEach(([signal, desc]) => {
  process.on(signal, () => {
    console.log(`${desc}. Shutting down...`);

    server.close(() => {
      console.log("Success!")
      process.exit(0);
    });

    setTimeout(() => {
      console.log("Forced shutdown.")
      process.exit(1);
    }, 500);
  });
});