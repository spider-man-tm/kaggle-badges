import axios from "axios";
import { Rank } from "../../src/types";

describe("Kaggle SVG API", () => {
  const ranks: Rank[] = ["Grandmaster", "Master", "Expert", "Contributor"];

  ranks.forEach((rank) => {
    test(`API should return 200 for ${rank}`, async () => {
      const url = `https://www.kaggle.com/static/images/tiers/${rank.toLowerCase()}.svg`;
      const response = await axios.get(url);
      expect(response.status).toBe(200);
    });
  });
});
