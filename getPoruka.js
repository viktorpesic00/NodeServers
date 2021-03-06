const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.static("./methods-public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/getPoruka", (req, res) => {
  console.log("req");
  let rawdata = fs.readFileSync("poruka.json");
  let parsedData = JSON.parse(rawdata);
  console.log(parsedData);
  let data = {
    status: true,
    parsedData,
  };
  return res.status(200).json(data);
});

app.listen(5003, () => {
  console.log("listening: 5003");
});
