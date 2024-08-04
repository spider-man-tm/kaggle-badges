import puppeteer from "puppeteer";

async function getChromiumVersion(): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const version = await browser.version();
  await browser.close();
  return version;
}

describe("getChromiumVersion", () => {
  it("should return a valid version of Chromium", async () => {
    const version = await getChromiumVersion();
    expect(version).toMatch('Chrome/126.0.6478.63');
  });
});
