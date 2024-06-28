import * as fs from "fs";

/**
 * Recursively create directory if it doesn't exist
 * @param dir - Directory path to create
 */
export function ensureDirectoryExistence(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}
