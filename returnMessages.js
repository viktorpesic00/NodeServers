const express = require("express");
var imaps = require("imap-simple");
//var htmlToText = require("html-to-text");
const app = express();

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
  var config = {
    imap: {
      user: email,
      password: password,
      host: "mail.metropolitan.ac.rs",
      port: 993,
      tls: true,
      authTimeout: 3000,
    },
  };

  imaps.connect(config).then(function (connection) {
    return connection.openBox("INBOX").then(function () {
      var searchCriteria = ["UNSEEN"];

      var fetchOptions = {
        bodies: ["HEADER", "TEXT"],
        markSeen: false,
      };

      return connection
        .search(searchCriteria, fetchOptions)
        .then(function (results) {
          var subjects = results.map(function (res) {
            return res.parts.filter(function (part) {
              return part.which === "HEADER";
            })[0].body.subject[0];
          });

          var froms = results.map(function (res) {
            return res.parts.filter(function (part) {
              return part.which === "HEADER";
            })[0].body.from[0];
          });

          var dates = results.map(function (res) {
            return res.parts.filter(function (part) {
              return part.which === "HEADER";
            })[0].body.date[0];
          });

          var messagesList = [];

          let from = "";

          for (let i = 0; i < subjects.length; i++) {
            if (froms[i].includes("<")) {
              if (froms[i].indexOf("<") != 0) {
                from = froms[i].substring(0, froms[i].indexOf("<") - 1);
              }
            } else {
              from = froms[i];
            }

            var message = {
              subject: subjects[i],
              from: from,
              date: dates[i],
            };
            messagesList.push(message);
          }
          messagesList.reverse();
          console.log(messagesList.slice(0, 3));

          return res.status(200).json(messagesList.slice(0, 3));
        });
    });
  });
});

app.listen(5000, () => {
  console.log("listening: 5000");
});
