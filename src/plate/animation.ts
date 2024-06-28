import { SVGElement } from "../types";

export function addAnimation(
  element: SVGElement,
  attributeName: string,
  from: string | number,
  to: string | number,
  dur: string
) {
  const animate = element.element("animate", {
    attributeName,
    from,
    to,
    dur,
    repeatCount: "indefinite",
  });
  element.add(animate);
}
