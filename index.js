const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    'https://www.google.com/search?q=+"software+developer"+"Yangon" "@gmail.com" -intitle:"profiles" -inurl:"dir/+"+site:mm.linkedin.com/'
  );

  const className = "VwiC3b.yXK7lf.lVm3ye.r025kc.hJNv6b.Hdw6tb";
  await page.waitForSelector(`.${className}`);

  const spanTexts = await page.evaluate((className) => {
    const elements = document.querySelectorAll(`.${className}`);

    const childElements = [];
    elements.forEach((element) => {
      const spanElement = element.querySelector("span");

      if (spanElement) {
        childElements.push(spanElement.innerText);
      }
    });

    return childElements;
  }, className);

  const emails = spanTexts.flatMap((text) => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    return (text.match(emailRegex) || []).map((email) => email.toLowerCase());
  });

  console.log(emails);

  fs.writeFileSync("./scrape.txt", emails.join("\n"), (err) => {
    if (err) console.log(err);
  });

  await browser.close();
})();
