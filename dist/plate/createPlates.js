"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsdom_1 = require("jsdom");
const svg_js_1 = require("@svgdotjs/svg.js");
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const gradients_1 = require("./gradients");
const animation_1 = require("./animation");
const medals_1 = require("./medals");
async function loadExternalSVG(url) {
    const response = await (0, node_fetch_1.default)(url);
    const svgText = await response.text();
    return svgText;
}
async function main() {
    // Create a DOM window and document using jsdom
    const { window } = new jsdom_1.JSDOM("<!DOCTYPE html><html><body></body></html>");
    const { document } = window;
    // Type casting to resolve the TypeScript type error
    (0, svg_js_1.registerWindow)(window, document);
    // Create SVG canvas and cast it to Svg type
    const canvas = (0, svg_js_1.SVG)().addTo(document.body).size(85, 120);
    // Add a rectangle to outline the entire canvas
    canvas
        .rect(85, 120)
        .stroke({ color: "#d3d3d3", width: 2 })
        .fill("none")
        .radius(7); // Adds rounded corners with a radius
    // Load the Kaggle logo SVG
    const logoSVG = await loadExternalSVG("https://www.kaggle.com/static/images/tiers/master.svg");
    // Add the logo to the canvas
    const logo = canvas.nested().svg(logoSVG).move(22, 30);
    // Define gradients for metallic effect
    const defs = canvas.defs();
    medals_1.medals.forEach((medal) => {
        const gradient = (0, gradients_1.createGradient)(defs, `${medal.type}Gradient`, medal.stops);
        (0, animation_1.addAnimation)(gradient, "x1", "100%", "0%", "3s");
        (0, animation_1.addAnimation)(gradient, "y1", "100%", "0%", "3s");
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
    fs_1.default.writeFileSync("output.svg", svgData);
    // Log output path
    console.log("SVG file generated at output.svg");
}
main();
