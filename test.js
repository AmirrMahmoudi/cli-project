console.clear();
import "dotenv/config";
import Task from "./task.js";

const t1 =  Task.getTaskById(2);
console.log(t1);

// t1.title = "Learn HTMdsL";
// t1.completed = true;
// t1.save();
// t1.completed = false;
// t1.save();
// console.log(t1);
