const express = require('express');
const app = express();

app.get("/", async (req, res) => {
  res.send(JSON.stringify(process.env, null, 2));
});

app.listen(8080, () => {
  console.log("Listening on port 8080");
});