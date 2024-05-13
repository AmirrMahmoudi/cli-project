console.clear();
import "dotenv/config";
import DB from "./db.js";

const data1 = [
  {
    id: 1,
    title: "Learn C#",
    completed: true,
  },
  {
    id: 2,
    title: "Learn MATLAB",
    completed: false,
  },
];
const data2 = '[{"id":1,"title":"Learn Java","completed":true}]';
DB.insertBulkData(data1);

DB.deleteTask(1);
