var imaps = require("imap-simple");
var htmlToText = require("html-to-text");

var config = {
  imap: {
    user: "Test@metropolitan.ac.rs",
    password: "Testmet21",
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
            date: dates[i].toDateString(),
          };
          messagesList.push(message);
        }

        console.log(messagesList);
        // console.log(dates);

        // function convertDate(inputFormat) {
        //   function pad(s) {
        //     return s < 10 ? "0" + s : s;
        //   }
        //   var d = new Date(inputFormat);
        //   return [
        //     pad(d.getDate()),
        //     pad(d.getMonth() + 1),
        //     d.getFullYear(),
        //   ].join("/");
        // }

        // function getDisplayDate(year, month, day) {
        //   today = new Date();
        //   today.setHours(0);
        //   today.setMinutes(0);
        //   today.setSeconds(0);
        //   today.setMilliseconds(0);
        //   compDate = new Date(year, month - 1, day); // month - 1 because January == 0
        //   diff = today.getTime() - compDate.getTime(); // get the difference between today(at 00:00:00) and the date
        //   if (compDate.getTime() == today.getTime()) {
        //     return "Danas";
        //   } else if (diff <= 24 * 60 * 60 * 1000) {
        //     return "Juce";
        //   } else {
        //     return compDate.toDateString(); // or format it what ever way you want
        //   }
        // }

        // var date = convertDate(dates[0]);

        // console.log(
        //   getDisplayDate(
        //     date.split("/")[2],
        //     date.split("/")[1],
        //     date.split("/")[0]
        //   )
        // );
      });
  });
});
