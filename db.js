import sqlite3 from "sqlite3";

class DB {
  /**
   * @type {sqlite3.Database?}
   */
  db = null;

  /**
   * @param {string} fileName File in which the data is stored Example: `./<example_file>.db`
   */
  constructor(fileName) {
    this.db = new sqlite3.Database(fileName, (err) => {
      if (err) return console.log("ERROR Opening Database!", err);
      // console.log("Connected to the in-memory SQLite database");
    });
  }

  /**
   * CREATE A TABLE
   * @param {string} [$table]
   * @return {Promise<import('./index.d').TMessage>}
   */
  createTableIfNotExists = ($table) => {
    let query = `CREATE TABLE IF NOT EXISTS ${$table} (
      id TEXT PRIMARY KEY UNIQUE,
      start INT NOT NULL,
      end INT DEFAULT 0
    );`;

    return new Promise((resolve, reject) => {
      this.db.get(query, (err) => {
        if (err) reject(this.mess(false, null, err));
        resolve(this.mess(true, null, null));
      });
    });
  };

  /**
   * Get all rows
   * @param {number} [$limit]
   * @return {Promise<import('./index').TDBRow[]>}
   */
  getAllRows = ($limit) => {
    // GET ALL ENTRIES
    let query = "SELECT id, start, end FROM timers;";

    query = $limit != null ? `${query} limit=$limit` : query;
    let obj = $limit != null ? { $limit } : {};

    return new Promise((resolve, reject) => {
      this.db.all(query, obj, (err, rows) => {
        if (err) reject(this.mess(false, null, err.message));
        resolve(this.mess(true, rows, null));
      });
    });
  };

  /**
   * Get rows by recent time
   * @param {number} $time
   * @return {Promise<import('./index').TDBRow[]>}
   */
  getRowsByTime = async ($time) => {
    let query = `SELECT id, start, end FROM timers WHERE end > $time;`;

    return new Promise((resolve, reject) => {
      this.db.all(query, { $time }, (err, rows) => {
        if (err) reject(this.mess(false, null, err.message));
        resolve(this.mess(true, rows, null));
      });
    });
  };

  /**
   * Delete all into the table
   * @param {string} $id
   * @return {Promise<import('./index').TMessage>}
   */
  deleteRow = ($id) => {
    let query = `DELETE FROM timers WHERE (id=$id);`;
    return new Promise((resolve, reject) => {
      this.db.get(query, { $id }, (err) => {
        if (err) reject(this.mess(false, null, err.message));
        resolve(this.mess(true, null, null));
      });
    });
  };

  deleteAll = () => {
    let query = `DELETE FROM timers`;
    return new Promise((resolve, reject) => {
      this.db.run(query, (err) => {
        if (err) reject(this.mess(false, null, err.message));
        resolve(this.mess(true, null, null));
      });
    });
  };

  /**
   * RETURNS AN UNIQUE STRING
   * @return {string}
   */
  id = () => {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  /**
   * Message modifier
   * @param {boolean} success
   * @param {any}  data
   * @param {any} error
   */
  mess = (success, data, error) => ({
    success,
    data,
    error,
  });

  /**
   * Get a single row
   * @param {string} $id
   * @return {Promise<import('./index').TDBRow>}
   */
  getASingleRow = ($id) => {
    let query = `SELECT id, start, end FROM timers where id=$id;`;
    return new Promise((resolve, reject) => {
      this.db.get(query, { $id }, (err, row) => {
        if (err) reject(this.mess(false, null, err.message));
        resolve(this.mess(true, row, null));
      });
    });
  };

  /**
   * Insert row into the table
   * @param {Date} start
   * @param {Date} end
   * @return {Promise<string>} returns the id
   */
  insertTime = (start, end) => {
    let query = `INSERT INTO timers (id, start, end) VALUES ($id, $start, $end);`;
    return new Promise((resolve, reject) => {
      const $id = this.id();
      this.db.get(
        query,
        {
          $id,
          $start: start.getTime(),
          $end: end.getTime(),
        },
        (err) => {
          if (err) reject(this.mess(false, null, err.message));
          resolve(this.mess(true, { id: $id }, null));
        }
      );
    });
  };

  /**
   * Update Time
   * @param {string} $id
   * @param {number} $start
   * @param {number} $end
   */

  updateTime = ($id, $start, $end) => {
    $start = new Date($start).getTime();
    $end = new Date($end).getTime();

    let query = `UPDATE timers SET start=$start, end=$end WHERE id=$id`;
    return new Promise((resolve, reject) => {
      this.db.run(query, { $id, $start, $end }, (err) => {
        if (err) reject(this.mess(false, null, err.message));
        resolve(this.mess(true, null, null));
      });
    });
  };

  close() {
    this.db.close((err) => {
      if (err) return console.log("Error in closing the database", err);
      console.log("Successfully closed the database");
    });
  }
}

export default DB;
