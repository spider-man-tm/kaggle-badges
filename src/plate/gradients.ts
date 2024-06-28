import { Gradient, ColorStop } from "../types";

export function createGradient(defs: Gradient, id: string, stops: ColorStop[]) {
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
