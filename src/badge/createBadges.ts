import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { KaggleProfile } from "../types";
import { colorMap } from "./color";
import { ensureDirectoryExistence } from "../utils";

/**
 * Create the badge for each category
 * @param profile - Kaggle profile data
 */
export async function createBadge(profile: KaggleProfile) {
  // This directory will be created in the root of the project
  const projectRoot = process.cwd();
  const badgesDirBase = path.join(projectRoot, "kaggle-badges");

  // Create the badge for each category
  for (const key in profile) {
    if (profile[key as keyof KaggleProfile]) {
      const category = key as keyof KaggleProfile;
      const section = profile[category];

      if (section && section.rank) {
        const rank = section.rank;
        const iconUrl = `https://www.kaggle.com/static/images/tiers/${rank.toLowerCase()}.svg`;
        const color = colorMap[rank];

        const styles = ["flat-square", "plastic"];
        const textColors = ["white", "black"];

        for (const style of styles) {
          for (const textColor of textColors) {
            const saveDir = path.join(badgesDirBase, `${category}Rank`);
            const saveFilePath = path.join(
              saveDir,
              `${style}-${textColor}.svg`
            );

            ensureDirectoryExistence(saveDir);
            await createBadgeBase(
              iconUrl,
              saveFilePath,
              category,
              rank,
              color,
              textColor,
              style
            );
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
async function createBadgeBase(
  iconUrl: string,
  saveFilePath: string,
  category: string,
  rank: string,
  color: string,
  labelColor: string,
  style: string
) {
  try {
    // Fetch the SVG content from the URL
    const svgResponse = await axios.get(iconUrl, {
      responseType: "arraybuffer",
    });
    if (svgResponse.status !== 200) {
      throw new Error(
        `Error fetching the SVG content from the URL: ${iconUrl}`
      );
    }

    // Shield.io API requires the SVG content to be base64 encoded
    const base64SVG = Buffer.from(svgResponse.data).toString("base64");
    const url =
      `https://img.shields.io/badge/Kaggle-${category}_${rank}-${color}.svg?logo=data:image/svg%2bxml;base64,` +
      base64SVG +
      `&labelColor=${labelColor}&style=${style}`;

    // Fetch the SVG content from the URL
    const response = await axios.get(url, { responseType: "arraybuffer" });
    if (response.status == 200) {
      // Save the SVG content to a file
      fs.writeFileSync(saveFilePath, response.data);
    } else {
      throw new Error(`Error fetching the SVG content from the URL: ${url}`);
    }
  } catch (error) {
    throw new Error(`createBadgeBase Error: ${error}`);
  }
}
