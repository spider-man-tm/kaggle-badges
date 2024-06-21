import { getKaggleuserProfile } from "../../src/scrape/getUserInfo";
import { KaggleProfile } from "../../src/types";

jest.setTimeout(120000);

describe("getKaggleuserProfile userName: spidermandance", () => {
  it("should return a valid user profile for spidermandance", async () => {
    const userName = "spidermandance";
    const expectedProfile: KaggleProfile = {
      Competitions: "Master",
      Datasets: "Contributor",
      Notebooks: "Expert",
      Discussions: "Contributor",
    };

    const userProfile = await getKaggleuserProfile(userName);

    expect(userProfile).toEqual(expectedProfile);
  });
});

describe("getKaggleuserProfile userName: bestfitting", () => {
  it("should return a valid user profile for bestfitting", async () => {
    const userName = "bestfitting";
    const expectedProfile: KaggleProfile = {
      Competitions: "Grandmaster",
      Datasets: "Contributor",
      Notebooks: "Contributor",
      Discussions: "Expert",
    };

    const userProfile = await getKaggleuserProfile(userName);

    expect(userProfile).toEqual(expectedProfile);
  });
});
