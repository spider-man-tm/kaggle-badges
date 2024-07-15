import { Medal } from "../types";

/**
 * The medals to display on the plate
 */
export const medals: Medal[] = [
  {
    type: "gold",
    stops: [
      { offset: 0, color: "#AD7615" },
      { offset: 0.5, color: "#FFF700" },
      { offset: 1, color: "#AD7615" },
    ],
    x: 16,
    y: 82,
  },
  {
    type: "silver",
    stops: [
      { offset: 0, color: "#838280" },
      { offset: 0.5, color: "#E0E0E0" },
      { offset: 1, color: "#838280" },
    ],
    x: 39,
    y: 82,
  },
  {
    type: "bronze",
    stops: [
      { offset: 0, color: "#8E5B3D" },
      { offset: 0.5, color: "#E9B582" },
      { offset: 1, color: "#8E5B3D" },
    ],
    x: 62,
    y: 82,
  },
];
