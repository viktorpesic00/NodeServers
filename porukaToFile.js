const fs = require("fs");

const puppeteer = require("puppeteer");
const URL = "https://marketing.metropolitan.ac.rs/poruke/";

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

      let naslovi = document.getElementsByClassName("naslov-t");

      for (let naslov of naslovi) {
        naslovList.push(naslov.textContent);
      }

      return {
        naslovList,
      };
    });

    fs.writeFile("poruka.json", JSON.stringify(data), function (err) {
      if (err) console.log("err");
      console.log("complete");
    });

    console.log(data);

    await browser.close();
  })();
}
