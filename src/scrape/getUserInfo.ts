import puppeteer, { Page } from "puppeteer";
import { xpaths } from "./xpaths";
import { KaggleProfile, Rank } from "../types";

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
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Initialize the userProfile object
  let userProfile: KaggleProfile = {};

  for (const key in xpaths) {
    const section = xpaths[key as keyof typeof xpaths];

    const rank = await getTextContentByXpath(page, section.rank);
    const medalCounts = await getMedalCountsForProfile(
      page,
      section.medal_count
    );

    // Initialize the corresponding section in userProfile if not already initialized
    if (key === "Competitions") {
      userProfile.Competitions = {
        rank: rank as Rank,
        medal_counts: medalCounts,
      };
    } else if (key === "Datasets") {
      userProfile.Datasets = {
        rank: rank as Rank,
        medal_counts: medalCounts,
      };
    } else if (key === "Notebooks") {
      userProfile.Notebooks = {
        rank: rank as Rank,
        medal_counts: medalCounts,
      };
    } else if (key === "Discussions") {
      userProfile.Discussions = {
        rank: rank as Rank,
        medal_counts: medalCounts,
      };
    }
  }

  await browser.close();
  return userProfile;
}

/**
 * Get the text content of an element by XPath
 * @param page - The Puppeteer page
 * @param xpath - The XPath of the element
 */
const getTextContentByXpath = async (
  page: Page,
  xpath: string
): Promise<string> => {
  const elementHandle = await page.waitForSelector(`::-p-xpath(${xpath})`);
  const info = await page.evaluate((element: Element | null) => {
    return element ? element.textContent : null;
  }, elementHandle);
  if (info == null) {
    throw new Error(`Text not found for xpath: ${xpath}`);
  }
  return info;
};

/**
 Helper function to get medal counts by XPath
 * @param page - The Puppeteer page
 * @param baseXpath - The base XPath of the medal counts
 */
const getMedalCountsForProfile = async (
  page: Page,
  baseXpath: string
): Promise<{ gold: number; silver: number; bronze: number }> => {
  const medalCounts: { gold: number; silver: number; bronze: number } = {
    gold: 0,
    silver: 0,
    bronze: 0,
  };

  // Function to get medal counts and types
  const getMedalsData = async (
    xpath: string
  ): Promise<{ type: string; count: number }[]> => {
    return await page.evaluate((xpath) => {
      const medalsData: { type: string; count: number }[] = [];
      const result = document.evaluate(
        `${xpath}/div`,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < result.snapshotLength; i++) {
        const container = result.snapshotItem(i) as HTMLElement;
        if (container) {
          const countElement = container.querySelector("span");
          const imgElement = container.querySelector("img");
          const count = countElement
            ? parseInt(countElement.textContent || "0", 10)
            : 0;
          const type = imgElement ? imgElement.title.trim().toLowerCase() : "";
          medalsData.push({ type, count });
        }
      }
      return medalsData;
    }, xpath);
  };

  const medalsData = await getMedalsData(baseXpath);

  medalsData.forEach((medal) => {
    const { type, count } = medal;
    if (type.includes("gold")) {
      medalCounts.gold += isNaN(count) ? 0 : count;
    } else if (type.includes("silver")) {
      medalCounts.silver += isNaN(count) ? 0 : count;
    } else if (type.includes("bronze")) {
      medalCounts.bronze += isNaN(count) ? 0 : count;
    }
  });

  return medalCounts;
};
