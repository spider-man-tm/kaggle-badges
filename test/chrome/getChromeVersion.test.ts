import puppeteer from "puppeteer";

async function getChromiumVersion(): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const version = await browser.version();
  await browser.close();
  return version;
}

describe("getChromiumVersion", () => {
  it("should return a valid version of Chromium", async () => {
    const version = await getChromiumVersion();
    expect(version).toMatch("Chrome/131.0.6778.85");
  });
});
