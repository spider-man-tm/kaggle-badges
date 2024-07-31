import { JSDOM } from "jsdom";
import { SVG, Svg, registerWindow } from "@svgdotjs/svg.js";
import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";
import { KaggleProfile } from "../types";
import { createGradient } from "./gradients";
import { addAnimation } from "./animation";
import { medals } from "./medals";
import { ensureDirectoryExistence } from "../utils";

/**
 * Create a plate for each category in the Kaggle profile
 * @param profile The Kaggle profile data
 */
export async function createPlate(profile: KaggleProfile) {
  // This directory will be created in the root of the project
  const projectRoot = process.cwd();
  const platesDirBase = path.join(projectRoot, "kaggle-plates");

  // Create the plate for each category
  for (const key in profile) {
    if (profile[key as keyof KaggleProfile]) {
      const category = key as keyof KaggleProfile;
      const section = profile[category];

      for (const color of ["white", "black"]) {
        if (section && section.rank) {
          const rank = section.rank;
          const goldCount = section.medal_counts.gold;
          const silverCount = section.medal_counts.silver;
          const bronzeCount = section.medal_counts.bronze;
          const order = section.order.order;
          const saveDir = path.join(platesDirBase, `${category}`);
          ensureDirectoryExistence(saveDir);
          const saveFilePath = path.join(saveDir, `${color}.svg`);
          createPlateBase(
            saveFilePath,
            category,
            rank,
            goldCount,
            silverCount,
            bronzeCount,
            order,
            color as "white" | "black"
          );
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
async function createPlateBase(
  saveFilePath: string,
  category: string,
  rank: string,
  goldCount: number,
  silverCount: number,
  bronzeCount: number,
  order: string,
  backGround: "white" | "black" = "white"
) {
  try {
    // Create a DOM window and document using jsdom
    const { window } = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    const { document } = window;
    registerWindow(window as unknown as Window & typeof globalThis, document);

    // Create SVG canvas and cast it to Svg type
    const canvas = SVG().addTo(document.body).size(95, 147) as Svg;

    // Add a rectangle to outline the entire canvas
    canvas
      .rect(95, 147)
      .stroke({ color: "#d3d3d3", width: 2 })
      .fill(backGround)
      .radius(7); // Adds rounded corners with a radius

    // Load the Kaggle logo SVG
    const logoSVG = await loadExternalSVG(
      `https://www.kaggle.com/static/images/tiers/${rank.toLowerCase()}.svg`
    );
    const logo = canvas.nested().svg(logoSVG).move(27, 30);
    const defs = canvas.defs();

    medals.forEach((medal) => {
      const gradient = createGradient(
        defs,
        `${medal.type}Gradient`,
        medal.stops
      );
      addAnimation(gradient, "x1", "50%", "0%", "4s");
      addAnimation(gradient, "y1", "50%", "0%", "4s");
      canvas.circle(16).fill(`url(#${gradient.id()})`).move(medal.x, medal.y);
    });

    let svgData = canvas.svg();
    let titleX = 0;
    let fontColor = "white";
    if (category == "Competitions") {
      titleX = 6;
    } else if (category == "Datasets") {
      titleX = 19;
    } else if (category == "Notebooks") {
      titleX = 13.4;
    } else if (category == "Discussions") {
      titleX = 9.5;
    }
    if (backGround === "black") {
      fontColor = "white";
    } else if (backGround === "white") {
      fontColor = "black";
    }

    let newText = `<text x="${titleX}" y="18" font-family="'Ubuntu','Helvetica', 'Arial', sans-serif" font-weight="bold" font-size="13" fill="${fontColor}">${category}</text>`;
    for (let i = 0; i < 3; i++) {
      let medalCountFontColor = medals[i].stops[0].color;
      let medalCount = 0;
      if (i == 0) {
        medalCount = goldCount;
      } else if (i == 1) {
        medalCount = silverCount;
      } else {
        medalCount = bronzeCount;
      }
      const x_point = medalCount < 10 ? medals[i].x + 4.5 : medals[i].x;
      const y_point = 111;

      newText += `<text x="${x_point}" y="${y_point}" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="${medalCountFontColor}">${medalCount}</text>`;
    }

    let _x = 0;
    let _order = "";
    if (order == "") {
      _x = 10;
      _order = "Not ranked";
    } else if (order.length == 1) {
      _x = 35;
      _order = addOrdinalSuffix(order);
    } else if (order.length == 2) {
      _x = 32;
      _order = addOrdinalSuffix(order);
    } else if (order.length == 3) {
      _x = 29;
      _order = addOrdinalSuffix(order);
    } else if (order.length == 5) {
      _x = 22;
      _order = addOrdinalSuffix(order);
    } else if (order.length == 6) {
      _x = 18;
      _order = addOrdinalSuffix(order);
    } else if (order.length == 7) {
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
  } catch (error) {
    console.error("Error creating the plate:", error);
  }
}

/**
 * Load the SVG content from an external URL
 * @param url The URL to fetch the SVG content from
 */
async function loadExternalSVG(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const svgText = await response.text();
    return svgText;
  } catch (error) {
    console.error(`Error fetching the SVG content from the URL: ${url}`);
    throw error;
  }
}

/**
 * Add the ordinal suffix to a number
 * @param numStr The number as a string
 */
function addOrdinalSuffix(numStr: string): string {
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
  } else {
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
