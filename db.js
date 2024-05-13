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
      try {
        DB.createDB();
        return false;
      } catch (e) {
        throw new Error(e.message);
      }
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
      try {
        DB.createDB();
        return [];
      } catch (e) {
        throw new Error(e.message);
      }
    }

    try {
      data = JSON.parse(data);
      return data;
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }
  }

  static saveTask(title, completed = false, id = 0) {
    id = Number(id);
    if (id < 0 || id !== parseInt(id)) {
      throw new Error("id must be an integer, equal or greater than zero.");
    } else if (typeof title !== "string" || title.length < 3) {
      throw new Error("title must contain at least 3 letters.");
    }

    const task = DB.getTaskByTitle(title);
    if (task && task.id != id) {
      throw new Error("A task exists with this title.");
    }
    let data;
    if (DB.DBExists()) {
      data = fs.readFileSync(filename, "utf-8");
    } else {
      try {
        DB.createDB();
        data = "[]";
      } catch (e) {
        throw new Error(e.message);
      }
    }

    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new Error("Syntax error.\nPlease check the DB file.");
    }

    if (id === 0) {
      if (data.length === 0) {
        id = 1;
      } else {
        id = data[data.length - 1].id + 1;
      }
      data.push({
        id,
        title,
        completed,
      });

      const str = JSON.stringify(data, null, "    ");
      try {
        fs.writeFileSync(filename, str, "utf-8");
        return true;
      } catch (e) {
        throw new Error("Can not save the task.");
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          data[i].title = title;
          data[i].completed = completed;

          const str = JSON.stringify(data, null, "    ");
          try {
            fs.writeFileSync(filename, str, "utf-8");
            return true;
          } catch (e) {
            throw new Error("Can not save the task.");
          }
        }
      }
      throw new Error("Task not found.");
    }
  }




}
