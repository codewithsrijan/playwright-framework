import fs from "fs";
import path from "path";
import { createLogger, transports, format, type Logger } from "winston";

const parentDirectory = path.resolve(__dirname);
const logDirectory = path.join(parentDirectory, "logs");

try {
  if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
    console.log("Logs directory created successfully.");
  } else {
    console.log("Logs directory already exists.");
  }
} catch (error: unknown) {
  console.log("Error creating logs directory:", error);
}

const options: Intl.DateTimeFormatOptions = {
  timeZone: "Asia/Kolkata",
  hour12: false,
};
const IST_time = new Date().toLocaleString("en-US", options);
const date = IST_time.split(",")[0].trim();

const [month, day, year] = date.split("/");
const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

const playwrightTimestamp = formattedDate;

const logFileName = `playwright_${playwrightTimestamp}.log`;
const logFilePath = path.join(logDirectory, logFileName);

export const logger: Logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.simple(),
  ),
  transports: [new transports.Console(), new transports.File({ filename: logFilePath })],
});
