import fs from "fs";

import chalk from "chalk";

const filename = process.env.DB_FILE;
const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class DB {
  static createDB() {
    if (fs.existsSync(filename)) {
      console.log(warn("DB file already exists."));
      return false;
    }
    try {
      fs.writeFileSync(filename, "[]", "utf-8");
      console.log(success("DB file created successfully."));
      return true;
    } catch (e) {
      throw new Error("Can not write in " + filename);
    }
  }

  static resetDB() {
    try {
      fs.writeFileSync(filename, "[]", "utf-8");
      console.log("DB file reset to empty.");
      return true;
    } catch (e) {
      throw new Error("Cant not write in " + filename);
    }
  }

  static DBExists() {
    if (fs.existsSync(filename)) {
      return true;
    } else {
      return false;
    }
  }

  static getTaskById(id) {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    } else {
      DB.createDB();
      return false;
    }

    try {
      data = JSON.parse(data);
      const task = data.find((t) => t.id === Number(id));
      return task ? task : false;
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }
  }

  static getTaskByTitle(title) {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    } else {
      DB.createDB();
      return false;
    }
    try {
      data = JSON.parse(data);
      const task = data.find((t) => t.title === title);
      return task ? task : false;
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }
  }

  static getAllTasks() {
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    } else {
      DB.createDB();
      return [];
    }

    try {
      data = JSON.parse(data);
      return data;
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }
  }
}
