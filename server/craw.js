const puppeteer = require("puppeteer");

async function run(uri) {
  try {

    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(uri, { waitUntil: "load" });

    const IMG_SELECTOR = ".listing_thumbs_image img";

    const retrievedData = await page.evaluate(async sel => {
      window.scrollBy(0, document.body.scrollHeight);

      let imgSrcList;
      await new Promise(resolve => {
        setTimeout(() => {
          const eles = document.querySelectorAll(sel);
          imgSrcList = Array.from(eles)
            .slice(0, -1)
            .map(img => img.src);

          resolve();
        }, 60000);
      });

      return imgSrcList;
    }, IMG_SELECTOR);

    await browser.close();

    return retrievedData;
  }
  catch (error) {
  }
}

module.exports = run;
