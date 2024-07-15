export type Rank = "Grandmaster" | "Master" | "Expert" | "Contributor";
export type Category =
  | "Competitions"
  | "Datasets"
  | "Notebooks"
  | "Discussions";
export type MedalCounts = { gold: number; silver: number; bronze: number };

/**
 * Color map for each rank
 * @type {ColorMap}
 * @property {string} Grandmaster - Color for Grandmaster rank
 * @property {string} Master - Color for Master rank
 * @property {string} Expert - Color for Expert rank
 * @property {string} Contributor - Color for Contributor rank
 */
export interface ColorMap {
  Grandmaster: string;
  Master: string;
  Expert: string;
  Contributor: string;
}

/**
 * Kaggle profile data
 * @type {KaggleProfile}
 * @property { rank: Rank, medal_counts: MedalCounts } Competitions - Competitions data
 * @property { rank: Rank, medal_counts: MedalCounts } Datasets - Datasets data
 * @property { rank: Rank, medal_counts: MedalCounts } Notebooks - Notebooks data
 * @property { rank: Rank, medal_counts: MedalCounts } Discussions - Discussions data
 */
export interface KaggleProfile {
  Competitions?: { rank: Rank; medal_counts: MedalCounts };
  Datasets?: { rank: Rank; medal_counts: MedalCounts };
  Notebooks?: { rank: Rank; medal_counts: MedalCounts };
  Discussions?: { rank: Rank; medal_counts: MedalCounts };
}

interface Xpath {
  rank: string;
  medal_count: string;
}

/**
 * Xpaths for each category
 */
export interface Xpaths {
  Competitions: Xpath;
  Datasets: Xpath;
  Notebooks: Xpath;
  Discussions: Xpath;
}

/**
 * Badge data
 * @type {Badge}
 * @property {Category} category - Category of the badge
 * @property {Rank} rank - Rank of the badge
 * @property {string} color - Background color of the badge
 */
export interface Badge {
  category: Category;
  rank: Rank;
  color: ColorMap[Rank];
}

export interface ColorStop {
  offset: number;
  color: string;
}

/**
 * Medal Image Settings
 */
export interface Medal {
  type: string;
  stops: ColorStop[];
  x: number;
  y: number;
}

/**
 * SVG gradient
 */
export interface Gradient {
  gradient: (
    type: string,
    callback: (add: { stop: (offset: number, color: string) => void }) => void
  ) => { attr: (attributes: object) => { id: (id: string) => any } };
}

/**
 * SVG animatino attributes
 */
export interface AnimateAttributes {
  attributeName: string;
  from: string | number;
  to: string | number;
  dur: string;
  repeatCount: string;
}

/**
 * SVG element
 */
export interface SVGElement {
  element: (name: string, attributes: AnimateAttributes) => any;
  add: (child: any) => void;
}
