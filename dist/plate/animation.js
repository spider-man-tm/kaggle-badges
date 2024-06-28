"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAnimation = addAnimation;
/**
 * Add an animation to an SVG element
 * @param element The SVG element to animate
 * @param attributeName The attribute to animate
 * @param from The start value of the attribute
 * @param to The end value of the attribute
 * @param dur The duration of the animation
 */
function addAnimation(element, attributeName, from, to, dur) {
    const animate = element.element("animate", {
        attributeName,
        from,
        to,
        dur,
        repeatCount: "indefinite",
    });
    element.add(animate);
}
