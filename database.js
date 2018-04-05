var mysql = require('mysql')
var squel = require("squel");
const server = require ('./config.json')

var con = mysql.createConnection({
  host: server.server.host,
  user: server.server.user,
  password: server.server.password,
  database: server.server.database
});

// Register user
var addUser  = function ( firstname , lastname, email , password)  {
   var sql = squel.insert()
    .into("SEUSER")
    .set("Email", email)
    .set("first_name", firstname)
    .set("last_name", lastname)
    .set("pw", password)

    return new Promise((resolve, reject) => {
      con.query (sql.toString(), function(err,result) {
        if(err){
          reject("Email already exists.")
        }
        else {
          validateUser(email,password)
          .then(resolve())
          .catch(reject("Could not register user."))
        }
      });
    });
}

// Returns has and wants tables
var getClasses = function () {
  var sql = 'SELECT SEHAS.Email, SEHAS.Course_Number, SEHAS.Section_Number, SECLASS.ClassName, ' +
  'SECLASS.Professor_Name,SECLASS.Start_Time, SECLASS.End_Time, SECLASS.Days, SEUSER.first_name, ' +
  'SEUSER.last_name FROM SEHAS INNER JOIN SECLASS on SEHAS.Course_Number = SECLASS.Course_Number and '+
  'SEHAS.Section_Number = SECLASS.Section_Number INNER JOIN SEUSER on SEHAS.Email = SEUSER.Email'

    return new Promise((resolve , reject) =>
    con.query (sql, function(err,res) {
      if(err) throw err;
      if (res.length === 0)
        reject("Error")
      else{
        User_List = {}
        for (var x of res){
          console.log(x.Course_Number)
          if (x.Email in User_List){
            User_List[x.Email].Has.push({"Course_Number": x.Course_Number ,
                                            "Section_Number" : x.Section_Number,
                                            "ClassName" : x.ClassName,
                                            "Professor_Name": x.Professor_Name,
                                            "Start_Time": x.Start_Time,
                                            "End_Time": x.End_Time,
                                            "Days": x.Days,
                                            "first_name": x.first_name,
                                            "last_name": x.last_name})
          }
          else {
            User_List[x.Email] = {"Wants" : [],
                                  "Has" : [{"Course_Number": x.Course_Number ,
                                            "Section_Number" : x.Section_Number,
                                            "ClassName" : x.ClassName,
                                            "Professor_Name": x.Professor_Name,
                                            "Start_Time": x.Start_Time,
                                            "End_Time": x.End_Time,
                                            "Days": x.Days,
                                            "first_name": x.first_name,
                                            "last_name": x.last_name}]}
          }}
          var sql = 'SELECT SEWANTS.Email, SEWANTS.Course_Number, SEWANTS.Section_Number, SECLASS.ClassName, ' +
          'SECLASS.Professor_Name,SECLASS.Start_Time, SECLASS.End_Time, SECLASS.Days, SEUSER.first_name, ' +
          'SEUSER.last_name FROM SEWANTS INNER JOIN SECLASS on SEWANTS.Course_Number = SECLASS.Course_Number and '+
          'SEWANTS.Section_Number = SECLASS.Section_Number INNER JOIN SEUSER on SEWANTS.Email = SEUSER.Email'
          con.query (sql, function(err,res) {
            if(err) throw err;
            if (res.length === 0)
              reject("Error")
            else{
              for (var x of res){
                console.log(x.Course_Number)
                if (x.Email in User_List){
                  User_List[x.Email].Wants.push({"Course_Number": x.Course_Number ,
                                                  "Section_Number" : x.Section_Number,
                                                  "ClassName" : x.ClassName,
                                                  "Professor_Name": x.Professor_Name,
                                                  "Start_Time": x.Start_Time,
                                                  "End_Time": x.End_Time,
                                                  "Days": x.Days,
                                                  "first_name": x.first_name,
                                                  "last_name": x.last_name})
                }
                else {
                  User_List[x.Email] = {"Wants" : [{"Course_Number": x.Course_Number ,
                                                  "Section_Number" : x.Section_Number,
                                                  "ClassName" : x.ClassName,
                                                  "Professor_Name": x.Professor_Name,
                                                  "Start_Time": x.Start_Time,
                                                  "End_Time": x.End_Time,
                                                  "Days": x.Days,
                                                  "first_name": x.first_name,
                                                  "last_name": x.last_name}]}
                }}
        resolve(User_List)
      }


    }))
}
// Log user in
var validateUser = function (email, password) {
  var sql = squel.select()
    .from("SEUSER")
    .where("Email = \'" + email + "\'  and pw = \'" + password + "\'")

    return new Promise((resolve , reject) =>
    con.query (sql.toString(), function(err,res) {
      if(err) throw err;
      if (res.length === 0)
        reject("Username or password incorrect.")
      else
        resolve(res)

    }));
}
module.exports = {
  addUser: addUser,
  validateUser : validateUser,
  getClasses: getClasses
}
