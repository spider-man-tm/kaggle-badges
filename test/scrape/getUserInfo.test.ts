import { getKaggleuserProfile } from "../../src/scrape/getUserInfo";

jest.setTimeout(120000);

describe("getKaggleuserProfile userName: spidermandance", () => {
  it("should return a valid user profile for spidermandance", async () => {
    const userName = "spidermandance";
    const userProfile = await getKaggleuserProfile(userName);
    const CompetitionsRank = userProfile.Competitions?.rank;
    expect(CompetitionsRank).toEqual("Master");
  });
});

describe("getKaggleuserProfile userName: bestfitting", () => {
  it("should return a valid user profile for bestfitting", async () => {
    const userName = "bestfitting";
    const userProfile = await getKaggleuserProfile(userName);
    const CompetitionsRank = userProfile.Competitions?.rank;
    expect(CompetitionsRank).toEqual("Grandmaster");
  });
});
