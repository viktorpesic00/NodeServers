const fs = require("fs");

const puppeteer = require("puppeteer");

setInterval(function () {
  run();
}, 6000);

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
      if (err) console.log("err");
      console.log("complete");
    });

    console.log(data);

    await browser.close();
  })();
}
