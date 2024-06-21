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
    // Scroll the page to load all the elements
    await autoScroll(page);
    await new Promise((resolve) => setTimeout(resolve, 10000));
    // Initialize the userProfile object
    let userProfile = {};
    for (let key in xpaths_1.xpaths) {
        const categoryKey = key;
        const xpath = xpaths_1.xpaths[categoryKey];
        try {
            // get the element by xpath
            const elementHandle = await page.waitForSelector(`::-p-xpath(${xpath})`, {
                timeout: 10000,
            });
            // get the text content of the element
            const info = await page.evaluate((element) => {
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
            userProfile[categoryKey] = info;
        }
        catch (error) {
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
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
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
const isRank = (info) => {
    const ranks = ["Grandmaster", "Master", "Expert", "Contributor"];
    return ranks.includes(info);
};
