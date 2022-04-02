const express = require("express");
var imaps = require("imap-simple");
const puppeteer = require("puppeteer");
const app = express();
const fs = require("fs");

var Imap = require("imap"),
  inspect = require("util").inspect;

app.use(express.static("./methods-public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/auth", (req, res) => {
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

app.get("/getPoruka", (req, res) => {
  //  console.log("req");
  let rawdata = fs.readFileSync("poruka.json");
  let parsedData = JSON.parse(rawdata);
  // console.log(parsedData);
  let data = {
    status: true,
    parsedData,
  };
  return res.status(200).json(data);
});

app.post("/returnMessages", (req, res) => {
  // console.log(req.body);
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
          //   console.log(messagesList.slice(0, 3));

          return res.status(200).json(messagesList.slice(0, 3));
        });
    });
  });
});

app.get("/getObavestenja", (req, res) => {
  // console.log("req");
  let rawdata = fs.readFileSync("obavestenja.json");
  let parsedData = JSON.parse(rawdata);
  // console.log(parsedData);
  let data = {
    status: true,
    parsedData,
  };
  return res.status(200).json(data);
});

app.get("/getDogadjaji", (req, res) => {
  // console.log("req");
  let rawdata = fs.readFileSync("dogadjaji.json");
  let parsedData = JSON.parse(rawdata);
  // console.log(parsedData);
  let data = {
    status: true,
    parsedData,
  };
  return res.status(200).json(data);
});

app.get("/getIgSlike", (req, res) => {
  //  console.log("req");
  let rawdata = fs.readFileSync("igSlike.json");
  let parsedData = JSON.parse(rawdata);
  // console.log(parsedData);
  let data = {
    status: true,
    parsedData,
  };
  return res.status(200).json(data);
});

app.listen(80, () => {
  console.log("listening: 80");
});

setInterval(function () {
  getObavestenja();
}, 5000);
setInterval(function () {}, 7000);
setInterval(function () {
  getInstagramSlike();
}, 17000);
setInterval(function () {
  getPoruka();
}, 4000);

function getObavestenja() {
  const URL = "https://marketing.metropolitan.ac.rs/notifikacije/";
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: "networkidle0" });

    let data = await page.evaluate(() => {
      let naslovList = [];
      let tekstList = [];

      let naslovi = document.getElementsByClassName("naslov-t");
      let objave = document.getElementsByClassName("tekst-t");

      for (let naslov of naslovi) {
        naslovList.push(naslov.textContent);
      }

      for (let tekst of objave) {
        tekstList.push(tekst.textContent);
      }

      return {
        naslovList,
        tekstList,
      };
    });

    fs.writeFile("obavestenja.json", JSON.stringify(data), function (err) {
      if (err) console.log("Ucitavanje obavestenja:  err" + err);
      console.log("Ucitavanje obavestenja: complete");
    });

    //console.log(data);

    await browser.close();
  })();
}

function getDogadjaji() {
  const URL = "https://www.metropolitan.ac.rs/dogadjaji-app/";
  (async () => {
    //// console.log(Date.now.getSeconds);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: "networkidle0" });

    let data = await page.evaluate(() => {
      let naslovList = [];
      let datumList = [];
      let fotkeList = [];
      let objaveList = [];

      let naslovi = document.getElementsByClassName("naslov-t");
      let datumi = document.getElementsByClassName("datum-odrzavanja");
      let fotke = document.getElementsByClassName("fotka-url");
      let objave = document.getElementsByClassName("objava-url");

      for (let naslov of naslovi) {
        naslovList.push(naslov.textContent);
      }

      for (let datum of datumi) {
        datumList.push(datum.textContent);
      }

      for (let fotka of fotke) {
        fotkeList.push(fotka.textContent);
      }

      for (let objava of objave) {
        objaveList.push(objava.textContent);
      }

      return {
        naslovList,
        datumList,
        fotkeList,
        objaveList,
      };
    });

    fs.writeFile("dogadjaji.json", JSON.stringify(data), function (err) {
      if (err) console.log("Ucitavanje dogadjaja: err" + err);
      console.log("Ucitavanje dogadjaja: complete");
    });

    //console.log(data);
    // console.log(Date.now.getSeconds);

    await browser.close();
  })();
}
function getInstagramSlike() {
  const URL = "https://www.picuki.com/profile/univerzitet_metropolitan";
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: "networkidle0" });

    let data = await page.evaluate(() => {
      let slikeList = [];

      slike = document.getElementsByClassName("post-image");

      let slika1 = slike[0].src;
      let slika2 = slike[1].src;
      let slika3 = slike[2].src;
      let slika4 = slike[3].src;

      slikeList.push(slika1);
      slikeList.push(slika2);
      slikeList.push(slika3);
      slikeList.push(slika4);

      return {
        slikeList,
      };
    });

    fs.writeFile("igSlike.json", JSON.stringify(data), function (err) {
      if (err) console.log("Ucitavanje Ig slika:  err " + err);
      console.log("Ucitavanje Ig slika: complete");
    });

    //console.log(data);

    await browser.close();
  })();
}
function getPoruka() {
  const URL = "https://marketing.metropolitan.ac.rs/poruke/";
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: "networkidle0" });

    let data = await page.evaluate(() => {
      let naslovList = [];

      let naslovi = document.getElementsByClassName("naslov-t");

      for (let naslov of naslovi) {
        naslovList.push(naslov.textContent);
      }

      return {
        naslovList,
      };
    });

    fs.writeFile("poruka.json", JSON.stringify(data), function (err) {
      if (err) console.log("Ucitavanje poruka: err" + err);
      console.log("Ucitavanje poruka: complete");
    });

    //console.log(data);

    await browser.close();
  })();
}
