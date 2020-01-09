const express = require("express");
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const app = express();
const expressip = require('express-ip');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressip().getIpInfoMiddleware);
// app.use(express.static("public"));
// app.use(express.json());




const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

let newdata = {};
let arrOfData = [];
let insideArr = [];

// creating connection
const connection = mysql.createConnection({
  host: '172.30.11.51',
  user: 'root',
  password: 'wonderfulday',
  database: 'attendancemanagement'
});


const pool = mysql.createPool({
  host: '172.30.11.51',
  user: 'root',
  password: 'wonderfulday',
  database: 'attendancemanagement'
});


// checking for connection

// function connectDb() {
// connection.connect(err => {
//   if (err) {
//     console.log("connection error");
//     setInterval(() => {
//       connection.on('error', connection.connect()); // probably worth adding timeout / throttle / etc
//     }, 1000);
//     // return err
//   }
//   console.log(connection)
// });
// }

// getting response for connection

app.post("/api", async (request, response) => {
  console.log("I got a request!");
  newdata = request.body;
  funnyObjects = newdata[Object.keys(newdata)[0]].descriptors;
  //console.log(j);
  //console.log(Object.keys(j).length);
  await response.end();

  for (let i = 0; i < funnyObjects.length; i++) {
    insideArr = [];
    //console.log(funnyObjects[i])
    for (let j = 0; j < 128; j++) {
      insideArr.push(funnyObjects[i][j]);
    }
    arrOfData.push(insideArr);
  }

  newdata[Object.keys(newdata)[0]].descriptors = arrOfData;
  console.log(newdata);

  var obj = {
    table: []
  };

  var json = JSON.stringify(obj, null, 2);

  const fs = require("fs");

  await fs.readFile(
    "client/src/descriptors/bnk48_1.json",
    "utf8",
    async function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        obj = JSON.parse(data); //now it an object
        obj.table.push(newdata); //add some data
        json = JSON.stringify(obj, null, 2); //convert it back to json
        await fs.writeFile(
          "client/src/descriptors/bnk48_1.json",
          json,
          "utf8",
          err => {
            if (err) console.log("Error writing file:", err);
          }
        ); // write it back
      }
    }
  );
});

// Sql queries start

const selectAll = 'SELECT * FROM attendancemanagement.entries;';

const user_name_with_Grade = 'SELECT module_id as moduleName,count(grade) as marks, email ,username from edxapp.courseware_studentmodule,edxapp.auth_user where grade = 1 && edxapp.auth_user.id = courseware_studentmodule.student_id group by username;'

const user_name_with_Grade_and_CodeScore = 'SELECT module_id as moduleName,count(grade) as marks,student_code_grade, email ,username from edxapp.courseware_studentmodule,edxapp.auth_user,edxapp.courseware_studentmodule_code where grade = 1 && edxapp.auth_user.id = courseware_studentmodule.student_id && edxapp.auth_user.id = edxapp.courseware_studentmodule_code.student_id group by username;'

const allUsers = 'select username, email from edxapp.auth_user';

const getUserId = `SELECT id from edxapp.auth_user WHERE userName = ?;`;
const postUserCodeOutput = `Update edxapp.courseware_studentmodule_code,edxapp.auth_user set edxapp.courseware_studentmodule_code.student_id = ?,edxapp.courseware_studentmodule_code.student_code_module_id = ?,edxapp.courseware_studentmodule_code.student_code_language = ?,edxapp.courseware_studentmodule_code.student_code = ?,edxapp.courseware_studentmodule_code.student_code_output = ?,edxapp.courseware_studentmodule_code.student_code_test_cases_passed = ?,edxapp.courseware_studentmodule_code.code_total_test_cases = ?,edxapp.courseware_studentmodule_code.student_code_max_grade = 5 * ?,edxapp.courseware_studentmodule_code.student_code_grade = 5 * ? WHERE edxapp.courseware_studentmodule_code.student_name = ? && edxapp.auth_user.userName = ?;`

const insertUser = `INSERT INTO attendancemanagement.entriestest (EmailID,Name,LocationInfo,EntryType,EntryDateTime,IPAddress,Remarks,Timezone) 
VALUES (?,?,?,?,?,?,?,?)`

const insertUsers = `INSERT INTO edxapp.auth_user (password,last_login,is_superuser,username,email,is_staff,is_active,date_joined) VALUES (?,?,?,?,?,?,?,?)`


// const insertData = "INSERT INTO edxapp.auth_user (password,last_login,is_superuser,username,email,is_staff,is_active,date_joined) VALUES %L returning *"
// const insertDataArray=[];

// insertDataArray.push([password,last_login,is_superuser,username,email,is_staff,is_active,date_joined]);

// queries end


app.post("/api/postData", function (request, response) {
  const today = new Date();
  var req = request.body;
  pool.query(insertUser, [req.emailId, req.name, req.location, req.entryType, today, req.ipAdd, req.Remarks, req.timezone], (err, result) => {
    if (err) {
      return response.send({
        status: 400,
        error: err
      });
    }
    else {
      return response.send({
        status: 200,
        result: result
      });
    }
  });

});

app.get('/getIP', function (req, res) {
  const ipInfo = req.ipInfo;
  var message = `Hey, you are browsing from ${ipInfo.city}, ${ipInfo.country}`;
  res.send(message);
});

app.post('/insertUserData', (req, res) => {
  var users = req.body;
  // for (var i = 1; i < users.length; i++) {
  //     let user = [];
  //     user = users[i];
  //     connection.query(insertUsers, ['pbkdf2_sha256$36000$cNeRLNb60DGR$X/q14LslEgPooqjS1oGXyUIY1yHhbWlutbieWvy9BLc=', today, 0, user[1], user[2], 0, 1, today], (err, result) => {
  //         if (err) {
  //             return res.send(err);
  //         }
  //         else {
  //             return res.json({
  //                 result
  //             });
  //         }
  //     });
  // }
})