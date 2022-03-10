const express = require("express");
const app = express();

var Imap = require("imap"),
  inspect = require("util").inspect;

app.use(express.static("./methods-public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, msg: "please provide name value" });
  }

  try {
    var imap = new Imap({
      user: email,
      password: password,
      host: "mail.metropolitan.ac.rs",
      port: 993,
      tls: true,
    });

    imap.once("error", function (err) {
      return res.status(400).json({ success: false, msg: "data is wrong" });
    });
    imap.once("ready", function () {
      return res.status(200).json({ success: true, msg: "ti si car" });
    });
    imap.connect();
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("listening: 5000");
});
