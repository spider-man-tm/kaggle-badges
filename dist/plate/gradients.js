"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGradient = createGradient;
/**
 * Create a gradient for the SVG
 */
function createGradient(defs, id, stops) {
    const gradient = defs
        .gradient("linear", (add) => {
        stops.forEach((stop) => {
            add.stop(stop.offset, stop.color);
        });
    })
        .attr({ x1: "0%", y1: "0%", x2: "100%", y2: "100%" })
        .id(id);
    return gradient;
}
