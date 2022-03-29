const fs = require("fs");

const puppeteer = require("puppeteer");
const URL = "https://www.metropolitan.ac.rs/dogadjaji-app/";

setInterval(function () {
  run();
}, 6000);

function run() {
  (async () => {
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

    await browser.close();
  })();
}