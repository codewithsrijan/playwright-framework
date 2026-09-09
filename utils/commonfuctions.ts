import fs from "fs";
import path from "path";
import ENV from "./env.js";

let combinedData: { data: unknown[] } = {
  data: [],
};

function getPath(frameworkPath: string, fileName: string): string | undefined {
  let filePath: string | undefined;
  try {
    const absolutePath = path.resolve(__dirname, "");
    const directoryPath = path.dirname(absolutePath);
    filePath = path.join(directoryPath, frameworkPath, fileName);
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      // logger.info("File location is incorrect");
    } else {
      // logger.info(error);
    }
  }

  return filePath;
}

async function readDatafromJsonFile(
  filePath: string,
): Promise<unknown | undefined> {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data) as unknown;
  } catch {
    // logger.error("Error reading JSON file due to error:", err);
    return undefined;
  }
}

function convertToValidFilename(inputString: string): string {
  const invalidCharsRegex = /[^a-zA-Z0-9_.]+/g;
  const filename = inputString.replace(invalidCharsRegex, "_");
  return filename;
}

async function appendDataToFile(
  fileName: string,
  data: unknown,
): Promise<void> {
  const fileData = JSON.stringify(data);
  const filePath = getPath("test-data", fileName);
  if (!filePath) {
    throw new Error("appendDataToFile: could not resolve file path");
  }
  fs.appendFileSync(filePath, fileData, "utf8");
  console.log("Data has been appended to", filePath);
}

async function combineData(newData: unknown): Promise<string> {
  combinedData.data.push(newData);
  const dataString = JSON.stringify(combinedData, null, 2);
  return dataString;
}

async function getDomainFromURL(): Promise<string | null> {
  const baseUrl = ENV.BASE_URL;
  if (!baseUrl) {
    return null;
  }
  const match = baseUrl.match(/https:\/\/([^.]+)\./);
  if (match && match.length > 1) {
    return match[1];
  }
  return null;
}

async function generateRandomId(length: number): Promise<string> {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function writeFile(filePath: string, data: string): Promise<void> {
  try {
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const dir = path.dirname(resolvedPath);
    fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(resolvedPath, data, { encoding: "utf8" });
    console.log(
      "File has been written/overwritten successfully at:",
      resolvedPath,
    );
  } catch (err: unknown) {
    console.error("Error writing file:", err);
    throw err;
  }
}

async function readFile(filePath: string): Promise<string> {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read file ${filePath}: ${message}`);
  }
}

export const commonFunctions = {
  getPath,
  readDatafromJsonFile,
  appendDataToFile,
  convertToValidFilename,
  combineData,
  writeFile,
  readFile,
  getDomainFromURL,
  generateRandomId,
};
