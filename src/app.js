const express = require("express");
const app = express();

app.use((req, res) => {
  res.send("hello from the servever");
});

app.listen(4010, () => {
  console.log("Server is running on port 4010");
});
