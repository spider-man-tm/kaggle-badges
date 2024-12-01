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
exports.createBadge = createBadge;
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const color_1 = require("./color");
const utils_1 = require("../utils");
/**
 * Create the badge for each category
 * @param profile - Kaggle profile data
 */
async function createBadge(profile) {
    // This directory will be created in the root of the project
    const projectRoot = process.cwd();
    const badgesDirBase = path.join(projectRoot, "kaggle-badges");
    // Create the badge for each category
    for (const key in profile) {
        if (profile[key]) {
            const category = key;
            const section = profile[category];
            if (section && section.rank) {
                const rank = section.rank;
                const iconUrl = `https://www.kaggle.com/static/images/tiers/${rank.toLowerCase()}.svg`;
                const color = color_1.colorMap[rank];
                const styles = ["flat-square", "plastic"];
                const textColors = ["white", "black"];
                for (const style of styles) {
                    for (const textColor of textColors) {
                        const saveDir = path.join(badgesDirBase, `${category}Rank`);
                        const saveFilePath = path.join(saveDir, `${style}-${textColor}.svg`);
                        (0, utils_1.ensureDirectoryExistence)(saveDir);
                        await createBadgeBase(iconUrl, saveFilePath, category, rank, color, textColor, style);
                    }
                }
            }
        }
    }
}
/**
 * Create the badge by fetching the SVG content from the URL
 * @param iconUrl
 * @param saveFilePath
 * @param category
 * @param rank
 * @param color
 * @param labelColor
 * @param style
 */
async function createBadgeBase(iconUrl, saveFilePath, category, rank, color, labelColor, style) {
    try {
        // Fetch the SVG content from the URL
        const svgResponse = await axios_1.default.get(iconUrl, {
            responseType: "arraybuffer",
        });
        if (svgResponse.status !== 200) {
            throw new Error(`Error fetching the SVG content from the URL: ${iconUrl}`);
        }
        // Shield.io API requires the SVG content to be base64 encoded
        const base64SVG = Buffer.from(svgResponse.data).toString("base64");
        const url = `https://img.shields.io/badge/Kaggle-${category}_${rank}-${color}.svg?logo=data:image/svg%2bxml;base64,` +
            base64SVG +
            `&labelColor=${labelColor}&style=${style}`;
        // Fetch the SVG content from the URL
        const response = await axios_1.default.get(url, { responseType: "arraybuffer" });
        if (response.status == 200) {
            // Save the SVG content to a file
            fs.writeFileSync(saveFilePath, response.data);
        }
        else {
            throw new Error(`Error fetching the SVG content from the URL: ${url}`);
        }
    }
    catch (error) {
        throw new Error(`createBadgeBase Error: ${error}`);
    }
}
