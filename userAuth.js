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
    return res.status(200).json({ success: false, message: "email is empty" });
  }
  if (!password) {
    return res
      .status(200)
      .json({ success: false, message: "password is empty" });
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
      return res
        .status(200)
        .json({ success: false, message: "Email or Password is not correct" });
    });
    imap.once("ready", function () {
      return res
        .status(200)
        .json({ success: true, message: "Logged in succesfuly" });
    });
    imap.connect();
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("listening: 5000");
});
