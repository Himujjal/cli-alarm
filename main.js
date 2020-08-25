import readline from "readline";
import DB from "./db";
import { fancyTimeFormat, timeModifier } from "./utils";
import { runMusic } from "./play";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const help = () => {
  console.log("==\nWelcome to the ultimate timer application!\n==");
  console.log("COMMANDS:");

  console.log("`get yesterday` -- to get all entries from yesterday to today");
  console.log("`delete <id>|all` -- to delete entry with the particular id");
  console.log("`start <minutes>` -- to start the timer for <minutes> minutes");
  console.log("`update <id>,<startDate>,<endDate>` -- to update the entry");
  console.log("`help` to show this menu");
  console.log("`exit` -- to exit");

  process.stdout.write("|>|> ");
};

help();

const db = new DB("./timers.db");
db.createTableIfNotExists("timers");

const deleteRow = async (id) => {
  const deleteRes = await db.deleteRow(id);
  return deleteRes;
};

const deleteAll = async () => {
  await db.deleteAll();
};

/**
 * @param {string} variable
 */
const updateRow = async (variable) => {
  const [id, start, end] = variable.split(",");

  const updateRes = await db.updateTime(
    id.trim(),
    new Date(parseInt(start.trim())),
    new Date(parseInt(end.trim()))
  );
  return updateRes;
};

const printToConsole = (time) => {
  console.clear();
  console.log(fancyTimeFormat(time));
  readline.cursorTo(process.stdout, 0, 0);
};

/**
 * @param {number} minutes
 */
const start = async (minutes) => {
  minutes = parseFloat(minutes);
  let startTime = new Date();
  let time = 0;

  try {
    const dbInsertRes = await db.insertTime(startTime, new Date());
    const rowId = dbInsertRes.data.id;
    if (rowId) {
      let interval = setInterval(async () => {
        time += 1;
        printToConsole(time);
        if (time === minutes * 60) {
          await db.updateTime(
            rowId,
            startTime,
            new Date(startTime.getTime() + time * 1000)
          );
          await runMusic();
          console.clear();
          console.log(`---- SESSION DONE for ${fancyTimeFormat(time)}! ----`);
          process.stdout.write("|>|> ");
          clearInterval(interval);
        }
      }, 1000);
    }
  } catch (err) {
    console.error(err);
  }
};

/**
 * Display rows w.r.t time
 * @param {string|number} [time]
 */
const getRows = async (time) => {
  time = parseInt(time ? time : "0");
  const getRowsRes = await db.getRowsByTime(time);
  console.log();
  console.log(
    getRowsRes.data
      .map((row) => {
        const start = new Date(row.start);
        const end = new Date(row.end);
        return `${
          row.id
        } >> START: ${start.toLocaleString()} || END: ${end.toLocaleString()} || TIME: ${timeModifier(
          (end - start) / 1000
        )}`;
      })
      .join("\n")
  );
  process.stdout.write("|>|> ");
};

rl.on("line", function (line) {
  const firstCommand = line.trim();
  if (firstCommand === "exit") return rl.close();
  if (firstCommand === "help") return help();
  if (firstCommand === "cls" || line.trim() === "clear") console.clear();

  const [command, variable] = line.trim().split(" ");

  if (command === "delete" && variable != null) {
    if (variable === "all") deleteAll();
    else deleteRow(variable);
  }

  if (command === "update" && variable != null) {
    updateRow(variable);
  }

  if (command === "start" && variable != null) {
    start(variable);
  }

  if (command === "get") {
    getRows(variable);
  }

  process.stdout.write("|>|> ");
});
