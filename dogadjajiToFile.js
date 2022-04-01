const fs = require("fs");

const puppeteer = require("puppeteer");

// setInterval(function () {
//   run();
// }, 0001);

run();

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
      if (err) console.log("err");
      console.log("complete");
    });

    console.log(data);
    // console.log(Date.now.getSeconds);

    await browser.close();
  })();
}
