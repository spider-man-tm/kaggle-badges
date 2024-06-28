"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAnimation = addAnimation;
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
