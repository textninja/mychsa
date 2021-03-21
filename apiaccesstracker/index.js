const express = require('express');
const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(8080, () => {
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