import DB from "./db.js";

console.log("----- DB Test -----");

const dbTest = async () => {
  try {
    const db = new DB("./timers.db", "timers");

    const createDbRes = await db.createTableIfNotExists("timers");
    console.log("Create DB: ", createDbRes);

    // const deleteRowResult = await deleteRow(null);
    // console.log(deleteRowResult);
    const getAllRowsResult = await db.getRowsByTime(0);
    console.log(
      "Get All Rows:",
      getAllRowsResult
      // .data.map((row) => ({
      //   ...row,
      //   start: new Date(row.start).toLocaleString(),
      //   end: new Date(row.end).toLocaleString(),
      // }))
    );

    // const insertTimerRes = await db.insertTime(new Date(), new Date());
    // console.log("INSERT TIMER: ", insertTimerRes);
  } catch (err) {
    console.error(`ERROR:`, err);
  }
};

dbTest();
