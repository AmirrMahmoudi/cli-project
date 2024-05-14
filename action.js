import fs from "fs";

import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";

import { parse, stringify } from "csv/sync";

import DB from "./db.js";
import Task from "./task.js";

const error = chalk.redBright.bold;
const warn = chalk.yellowBright.bold;
const success = chalk.greenBright.bold;

export default class Action {
  static list() {
    const tasks = Task.getAllTasks(true);
    if (tasks.length) {
      console.table(tasks);
    } else {
      console.log(warn("There is not any task."));
    }
  }

  static async add() {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter task title:",
        validate: (value) => {
          if (value.length < 3) {
            return "tThe title must contain at least 3 letters.";
          }
          return true;
        },
      },

      {
        type: "confirm",
        name: "completed",
        message: "Is this task completed?",
        default: false,
      },
    ]);

    try {
      const task = new Task(answers.title, answers.completed);
      task.save();
      console.log(success("New task saved successfully."));
    } catch (e) {
      console.log(error(e.message));
    }
  }

  static async delete() {
    const tasks = Task.getAllTasks();
    const choices = [];

    for (let task of tasks) {
      choices.push(task.title);
    }
    const answer = await inquirer.prompt({
      type: "list",
      name: "title",
      message: "Select a task do delete",
      choices,
    });

    const task = Task.getTaskByTitle(answer.title);
    try {
      DB.deleteTask(task.id);
      console.log(success("Selected task deleted successfully."));
    } catch (e) {
      console.log(error(e.message));
    }
  }

  static async deleteAll() {
    const answer = await inquirer.prompt({
      type: "confirm",
      name: "result",
      message: "Are you sure for delete all tasks?",
    });
    if (answer.result) {
      try {
        DB.resetDB();
        console.log(success("All tasks deleted successfully."));
      } catch (e) {
        console.log(error(e.message));
      }
    }
  }
}
