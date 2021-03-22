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