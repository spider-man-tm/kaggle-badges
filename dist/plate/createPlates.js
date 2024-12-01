"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlate = createPlate;
const jsdom_1 = require("jsdom");
const svg_js_1 = require("@svgdotjs/svg.js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const gradients_1 = require("./gradients");
const animation_1 = require("./animation");
const medals_1 = require("./medals");
const utils_1 = require("../utils");
/**
 * Create a plate for each category in the Kaggle profile
 * @param profile The Kaggle profile data
 */
async function createPlate(profile) {
    // This directory will be created in the root of the project
    const projectRoot = process.cwd();
    const platesDirBase = path.join(projectRoot, "kaggle-plates");
    // Create the plate for each category
    for (const key in profile) {
        if (profile[key]) {
            const category = key;
            const section = profile[category];
            for (const color of ["white", "black"]) {
                if (section && section.rank) {
                    const rank = section.rank;
                    const goldCount = section.medal_counts.gold;
                    const silverCount = section.medal_counts.silver;
                    const bronzeCount = section.medal_counts.bronze;
                    const order = section.order.order;
                    const saveDir = path.join(platesDirBase, `${category}`);
                    (0, utils_1.ensureDirectoryExistence)(saveDir);
                    const saveFilePath = path.join(saveDir, `${color}.svg`);
                    createPlateBase(saveFilePath, category, rank, goldCount, silverCount, bronzeCount, order, color);
                }
            }
        }
    }
}
/**
 * Create the base SVG plate for a category
 * @param saveFilePath
 * @param category
 * @param rank
 * @param goldCount
 * @param silverCount
 * @param bronzeCount
 * @param backGround
 */
async function createPlateBase(saveFilePath, category, rank, goldCount, silverCount, bronzeCount, order, backGround = "white") {
    try {
        // Create a DOM window and document using jsdom
        const { window } = new jsdom_1.JSDOM("<!DOCTYPE html><html><body></body></html>");
        const { document } = window;
        (0, svg_js_1.registerWindow)(window, document);
        // Create SVG canvas and cast it to Svg type
        const canvas = (0, svg_js_1.SVG)().addTo(document.body).size(95, 147);
        // Add a rectangle to outline the entire canvas
        canvas
            .rect(95, 147)
            .stroke({ color: "#d3d3d3", width: 2 })
            .fill(backGround)
            .radius(7); // Adds rounded corners with a radius
        // Load the Kaggle logo SVG
        const logoSVG = await loadExternalSVG(`https://www.kaggle.com/static/images/tiers/${rank.toLowerCase()}.svg`);
        const logo = canvas.nested().svg(logoSVG).move(27, 30);
        const defs = canvas.defs();
        medals_1.medals.forEach((medal) => {
            const gradient = (0, gradients_1.createGradient)(defs, `${medal.type}Gradient`, medal.stops);
            (0, animation_1.addAnimation)(gradient, "x1", "50%", "0%", "4s");
            (0, animation_1.addAnimation)(gradient, "y1", "50%", "0%", "4s");
            canvas.circle(16).fill(`url(#${gradient.id()})`).move(medal.x, medal.y);
        });
        let svgData = canvas.svg();
        let titleX = 0;
        let fontColor = "white";
        if (category == "Competitions") {
            titleX = 6;
        }
        else if (category == "Datasets") {
            titleX = 19;
        }
        else if (category == "Notebooks") {
            titleX = 13.4;
        }
        else if (category == "Discussions") {
            titleX = 9.5;
        }
        if (backGround === "black") {
            fontColor = "white";
        }
        else if (backGround === "white") {
            fontColor = "black";
        }
        let newText = `<text x="${titleX}" y="18" font-family="'Ubuntu','Helvetica', 'Arial', sans-serif" font-weight="bold" font-size="13" fill="${fontColor}">${category}</text>`;
        for (let i = 0; i < 3; i++) {
            let medalCountFontColor = medals_1.medals[i].stops[0].color;
            let medalCount = 0;
            if (i == 0) {
                medalCount = goldCount;
            }
            else if (i == 1) {
                medalCount = silverCount;
            }
            else {
                medalCount = bronzeCount;
            }
            const x_point = medalCount < 10 ? medals_1.medals[i].x + 4.5 : medals_1.medals[i].x;
            const y_point = 111;
            newText += `<text x="${x_point}" y="${y_point}" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="${medalCountFontColor}">${medalCount}</text>`;
        }
        let _x = 0;
        let _order = "";
        if (order == "") {
            _x = 10;
            _order = "Not ranked";
        }
        else if (order.length == 1) {
            _x = 35;
            _order = addOrdinalSuffix(order);
        }
        else if (order.length == 2) {
            _x = 32;
            _order = addOrdinalSuffix(order);
        }
        else if (order.length == 3) {
            _x = 29;
            _order = addOrdinalSuffix(order);
        }
        else if (order.length == 5) {
            _x = 22;
            _order = addOrdinalSuffix(order);
        }
        else if (order.length == 6) {
            _x = 18;
            _order = addOrdinalSuffix(order);
        }
        else if (order.length == 7) {
            _x = 14;
            _order = addOrdinalSuffix(order);
        }
        newText += `<text x="${_x}" y="135" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-weight="bold" font-size="14" fill="${fontColor}">${_order}</text>`;
        const insertPosition = svgData.lastIndexOf("</svg>");
        if (insertPosition !== -1) {
            svgData =
                svgData.slice(0, insertPosition) +
                    newText +
                    svgData.slice(insertPosition);
        }
        // Save SVG to file
        fs.writeFileSync(saveFilePath, svgData);
    }
    catch (error) {
        console.error("Error creating the plate:", error);
    }
}
/**
 * Load the SVG content from an external URL
 * @param url The URL to fetch the SVG content from
 */
async function loadExternalSVG(url) {
    try {
        const response = await (0, node_fetch_1.default)(url);
        const svgText = await response.text();
        return svgText;
    }
    catch (error) {
        console.error(`Error fetching the SVG content from the URL: ${url}`);
        throw error;
    }
}
/**
 * Add the ordinal suffix to a number
 * @param numStr The number as a string
 */
function addOrdinalSuffix(numStr) {
    // Remove commas from the input string
    numStr = numStr.replace(/,/g, "");
    // Check for invalid input (non-numeric strings)
    if (isNaN(Number(numStr))) {
        throw new Error("Invalid input: Not a number");
    }
    const num = parseInt(numStr, 10);
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;
    let suffix = "th";
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        // Special cases for 11th, 12th, 13th
        suffix = "th";
    }
    else {
        switch (lastDigit) {
            case 1:
                suffix = "st";
                break;
            case 2:
                suffix = "nd";
                break;
            case 3:
                suffix = "rd";
                break;
        }
    }
    // Add commas to the number
    const formattedNum = num.toLocaleString();
    return `${formattedNum}${suffix}`;
}
