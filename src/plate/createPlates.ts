import { JSDOM } from "jsdom";
import { SVG, Svg, registerWindow } from "@svgdotjs/svg.js";
import fs from "fs";
import fetch from "node-fetch";
import { createGradient } from "./gradients";
import { addAnimation } from "./animation";
import { medals } from "./medals";

async function loadExternalSVG(url: string): Promise<string> {
  const response = await fetch(url);
  const svgText = await response.text();
  return svgText;
}

async function main() {
  // Create a DOM window and document using jsdom
  const { window } = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  const { document } = window;

  // Type casting to resolve the TypeScript type error
  registerWindow(window as unknown as Window & typeof globalThis, document);

  // Create SVG canvas and cast it to Svg type
  const canvas = SVG().addTo(document.body).size(85, 120) as Svg;

  // Add a rectangle to outline the entire canvas
  canvas
    .rect(85, 120)
    .stroke({ color: "#d3d3d3", width: 2 })
    .fill("none")
    .radius(7); // Adds rounded corners with a radius

  // Load the Kaggle logo SVG
  const logoSVG = await loadExternalSVG(
    "https://www.kaggle.com/static/images/tiers/master.svg"
  );

  // Add the logo to the canvas
  const logo = canvas.nested().svg(logoSVG).move(22, 30);

  // Define gradients for metallic effect
  const defs = canvas.defs();

  medals.forEach((medal) => {
    const gradient = createGradient(defs, `${medal.type}Gradient`, medal.stops);
    addAnimation(gradient, "x1", "100%", "0%", "3s");
    addAnimation(gradient, "y1", "100%", "0%", "3s");
    canvas.circle(16).fill(`url(#${gradient.id()})`).move(medal.x, medal.y);
  });

  let svgData = canvas.svg();
  const newText = `
    <text x="3.4" y="18" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-weight="bold" font-size="13" fill="black">Competitions</text>
    <text x="15.3" y="111" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="#AD7615">2</text>
    <text x="38.3" y="111" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="#838280">2</text>
    <text x="61.3" y="111" font-family="'Ubuntu', 'Helvetica', 'Arial', sans-serif" font-size="13" fill="#8E5B3D">2</text>
  `;
  const insertPosition = svgData.lastIndexOf("</svg>");
  if (insertPosition !== -1) {
    svgData =
      svgData.slice(0, insertPosition) +
      newText +
      svgData.slice(insertPosition);
  }

  // Save SVG to file
  fs.writeFileSync("output.svg", svgData);

  // Log output path
  console.log("SVG file generated at output.svg");
}

main();
