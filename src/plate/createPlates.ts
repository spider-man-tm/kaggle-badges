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
  backGround: "white" | "black" = "white"
) {
  try {
    // Create a DOM window and document using jsdom
    const { window } = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    const { document } = window;
    registerWindow(window as unknown as Window & typeof globalThis, document);

    // Create SVG canvas and cast it to Svg type
    const canvas = SVG().addTo(document.body).size(95, 120) as Svg;

    // Add a rectangle to outline the entire canvas
    canvas
      .rect(95, 120)
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
