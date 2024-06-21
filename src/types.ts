export type Rank = "Grandmaster" | "Master" | "Expert" | "Contributor";
export type Category =
  | "Competitions"
  | "Datasets"
  | "Notebooks"
  | "Discussions";

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
 * @property {Rank} Competitions - Competitions rank
 * @property {Rank} Datasets - Datasets rank
 * @property {Rank} Notebooks - Notebooks rank
 * @property {Rank} Discussions - Discussions rank
 */
export interface KaggleProfile {
  Competitions?: Rank;
  Datasets?: Rank;
  Notebooks?: Rank;
  Discussions?: Rank;
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

/**
 * XPath map for each category
 * @type {XPathMap}
 * @property {string} Competitions - XPath for Competitions
 * @property {string} Datasets - XPath for Datasets
 * @property {string} Notebooks - XPath for Notebooks
 * @property {string} Discussions - XPath for Discussions
 */
export interface XPathMap {
  Competitions: string;
  Datasets: string;
  Notebooks: string;
  Discussions: string;
}
