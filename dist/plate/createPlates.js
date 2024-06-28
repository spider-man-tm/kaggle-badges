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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
                    const saveDir = path.join(platesDirBase, `${category}`);
                    (0, utils_1.ensureDirectoryExistence)(saveDir);
                    const saveFilePath = path.join(saveDir, `${color}.svg`);
                    createPlateBase(saveFilePath, category, rank, goldCount, silverCount, bronzeCount, color);
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
async function createPlateBase(saveFilePath, category, rank, goldCount, silverCount, bronzeCount, backGround = "white") {
    try {
        // Create a DOM window and document using jsdom
        const { window } = new jsdom_1.JSDOM("<!DOCTYPE html><html><body></body></html>");
        const { document } = window;
        (0, svg_js_1.registerWindow)(window, document);
        // Create SVG canvas and cast it to Svg type
        const canvas = (0, svg_js_1.SVG)().addTo(document.body).size(95, 120);
        // Add a rectangle to outline the entire canvas
        canvas
            .rect(95, 120)
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
        const newText = `
      <text x="${titleX}" y="18" font-family="'Ubuntu','Helvetica', 'Arial', sans-serif" font-weight="bold" font-size="13" fill="${fontColor}">${category}</text>
      <text x="20.3" y="111" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="#AD7615">${goldCount}</text>
      <text x="43.3" y="111" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="#838280">${silverCount}</text>
      <text x="66.3" y="111" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="#8E5B3D">${bronzeCount}</text>
    `;
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
