import * as core from "@actions/core";
import * as github from "@actions/github";
import { getKaggleuserProfile } from "./scrape/getUserInfo";
import { createBadge } from "./badge/createBadges";
import { createPlate } from "./plate/createPlates";

async function run() {
  try {
    const userName = process.env.INPUT_USER_NAME;
    if (!userName) {
      throw new Error("User name is not defined");
    }
    // get the user profile
    const userProfile = await getKaggleuserProfile(userName);
    console.log(userProfile);
    // create the badge
    await createBadge(userProfile);
    await createPlate(userProfile);
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
}

run();

export { run };
