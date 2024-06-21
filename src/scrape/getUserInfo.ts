import puppeteer, { Page } from "puppeteer";
import { xpaths } from "./xpaths";
import { KaggleProfile, XPathMap, Rank } from "../types";

/**
 * Get the user profile from Kaggle
 * @param userName - Kaggle username
 */
export async function getKaggleuserProfile(
  userName: string
): Promise<KaggleProfile> {
  const url = `https://www.kaggle.com/${userName}`;
  const browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Scroll the page to load all the elements
  await autoScroll(page);
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Initialize the userProfile object
  let userProfile: KaggleProfile = {};

  for (let key in xpaths) {
    const categoryKey = key as keyof XPathMap;
    const xpath = xpaths[categoryKey];

    try {
      // get the element by xpath
      const elementHandle = await page.waitForSelector(`::-p-xpath(${xpath})`, {
        timeout: 10000,
      });
      // get the text content of the element
      const info = await page.evaluate((element: Element | null) => {
        return element ? element.textContent : null;
      }, elementHandle);
      // ensure the text is not null
      if (info == null) {
        throw new Error(`Text not found in selector:${categoryKey}`);
      }
      // ensure the text is a valid rank
      if (!isRank(info)) {
        throw new Error(`Invalid rank:${info} in selector:${categoryKey}`);
      }
      userProfile[categoryKey] = info as Rank;
    } catch (error) {
      console.error(`getUserinfo ${categoryKey} is error.`);
      throw new Error(`${error}`);
    }
  }

  await browser.close();
  return userProfile;
}

/**
 * Scroll the page to load all the elements
 * @param page - Puppeteer page
 */
async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

/**
 * Ensure the text is a valid rank
 * @param info
 * @returns boolean
 */
const isRank = (info: string): info is Rank => {
  const ranks: Rank[] = ["Grandmaster", "Master", "Expert", "Contributor"];
  return ranks.includes(info as Rank);
};
