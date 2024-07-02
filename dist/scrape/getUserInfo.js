"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKaggleuserProfile = getKaggleuserProfile;
const puppeteer_1 = __importDefault(require("puppeteer"));
const xpaths_1 = require("./xpaths");
/**
 * Get the user profile from Kaggle
 * @param userName - Kaggle username
 */
async function getKaggleuserProfile(userName) {
    const url = `https://www.kaggle.com/${userName}`;
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // check xpaths and xpaths_sub
    const using_xpaths = await checkXpaths(page, xpaths_1.xpaths, xpaths_1.xpaths_sub);
    // Initialize the userProfile object
    let userProfile = {};
    for (const key in using_xpaths) {
        const section = using_xpaths[key];
        const rank = await getTextContentByXpath(page, section.rank);
        const medalCounts = await getMedalCountsForProfile(page, section.medal_count);
        // Initialize the corresponding section in userProfile if not already initialized
        if (key === "Competitions") {
            userProfile.Competitions = {
                rank: rank,
                medal_counts: medalCounts,
            };
        }
        else if (key === "Datasets") {
            userProfile.Datasets = {
                rank: rank,
                medal_counts: medalCounts,
            };
        }
        else if (key === "Notebooks") {
            userProfile.Notebooks = {
                rank: rank,
                medal_counts: medalCounts,
            };
        }
        else if (key === "Discussions") {
            userProfile.Discussions = {
                rank: rank,
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
const getTextContentByXpath = async (page, xpath) => {
    const elementHandle = await page.waitForSelector(`::-p-xpath(${xpath})`);
    const info = await page.evaluate((element) => {
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
const getMedalCountsForProfile = async (page, baseXpath) => {
    const medalCounts = {
        gold: 0,
        silver: 0,
        bronze: 0,
    };
    // Function to get medal counts and types
    const getMedalsData = async (xpath) => {
        return await page.evaluate((xpath) => {
            const medalsData = [];
            const result = document.evaluate(`${xpath}/div`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < result.snapshotLength; i++) {
                const container = result.snapshotItem(i);
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
        }
        else if (type.includes("silver")) {
            medalCounts.silver += isNaN(count) ? 0 : count;
        }
        else if (type.includes("bronze")) {
            medalCounts.bronze += isNaN(count) ? 0 : count;
        }
    });
    return medalCounts;
};
/**
 * Check xpaths and xpaths_sub
 * @param page - The Puppeteer page
 * @param xpaths - The xpaths object
 * @param xpaths_sub - The xpaths_sub object
 */
const checkXpaths = async (page, xpaths, xpaths_sub) => {
    // check xpaths and xpaths_sub
    const xpath_1 = xpaths["Competitions"].rank;
    const xpath_2 = xpaths_sub["Competitions"].rank;
    let using_xpaths = xpaths;
    try {
        await getTextContentByXpath(page, xpath_1);
    }
    catch (error) {
        using_xpaths = xpaths_sub;
        try {
            await getTextContentByXpath(page, xpath_2);
        }
        catch (error) {
            throw new Error("No valid xpath found");
        }
    }
    return using_xpaths;
};
