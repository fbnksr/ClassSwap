var mysql = require('mysql');
var squel = require("squel");
var nodemail = require('nodemailer');
const server = require ('./config.json')

var con = mysql.createConnection({
  host: server.server.host,
  user: server.server.user,
  password: server.server.password,
  database: server.server.database
});

var appendHasUser  = function (classList)  {
   var sql = squel.insert()
    .into("SEHAS")
    .setFieldsRows(classList)
    return new Promise((resolve, reject) => {
      con.query (sql.toString(), function(err,result) {
        if(err){
          reject()
        }
        else {
          resolve()
        }
      });
    });
}

var listClasses = function () {
  var sql = squel.select()
   .from("SECLASS")
   .setFieldsRows(classList)
   return new Promise((resolve, reject) => {
     con.query (sql.toString(), function(err,result) {
       if(err){
         reject()
       }
       else {
         resolve()
       }
     });
   });
}

var sendEmail = function (emailInfo) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: mail.mail.address,
      pass: mail.mail.password
    }
  });
  var mailOptions = {
  from: mail.mail.address,
  to: 'myfriend@yahoo.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}


var removeHasUser  = function (classList)  {
  var email = classList[0].Email
  var classes =  []
  for (relation of classList){
    classes.push(relation.Course_Number)
  }
  var sql = squel.remove()
            .from("SEHAS")
            .where("Email = ? and Course_Number in ?", email, classes)
  return new Promise((resolve, reject) => {
    con.query (sql.toString(), function(err,result) {
      if(err){
        reject()
      }
      else {
        resolve()
      }
    });
  });
}

var removeWantsUser  = function (classList)  {
  var email = classList[0].Email
  var classes =  []
  for (relation of classList){
    classes.push(relation.Course_Number)
  }
  var sql = squel.remove()
            .from("SEWANTS")
            .where("Email = ? and Course_Number in ?", email, classes)
  return new Promise((resolve, reject) => {
    con.query (sql.toString(), function(err,result) {
      if(err){
        reject()
      }
      else {
        resolve()
      }
    });
  });
}


var appendWantsUser  = function (classList)  {
   var sql = squel.insert()
    .into("SEWANTS")
    .setFieldsRows(classList)
    return new Promise((resolve, reject) => {
      con.query (sql.toString(), function(err,result) {
        if(err){
          reject()
        }
        else {
          resolve()
        }
      });
    });
}

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

function capFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Returns has and wants tables
var getClasses = function () {
  var sql = 'SELECT SEHAS.Email, SEHAS.Course_Number, SEHAS.Section_Number, SECLASS.ClassName, ' +
  'SECLASS.Professor_Name,SECLASS.Start_Time, SECLASS.End_Time, SECLASS.Days, SEUSER.first_name, ' +
  'SEUSER.last_name FROM SEHAS INNER JOIN SECLASS on SEHAS.Course_Number = SECLASS.Course_Number and '+
  'SEHAS.Section_Number = SECLASS.Section_Number INNER JOIN SEUSER on SEHAS.Email = SEUSER.Email'

    return new Promise((resolve , reject) =>
    con.query (sql, function(err,res)
    {
      if(err) throw err;
      if (res.length === 0)
        reject("Error")
      else
      {
        User_List = {}
        for (var x of res)
        {
          if (x.Email in User_List)
          {
            User_List[x.Email].Has.push({"Course_Number": x.Course_Number ,
                                            "Section_Number" : x.Section_Number,
                                            "ClassName" : x.ClassName,
                                            "Professor_Name": x.Professor_Name,
                                            "Start_Time": x.Start_Time,
                                            "End_Time": x.End_Time,
                                            "Days": x.Days})
          }
          else
          {
            User_List[x.Email] = {"Display_Name": capFirstLetter(x.first_name) + " " + x.last_name.charAt(0).toUpperCase() + ".",
                                  "Wants" : [],
                                  "Has" : [{"Course_Number": x.Course_Number ,
                                            "Section_Number" : x.Section_Number,
                                            "ClassName" : x.ClassName,
                                            "Professor_Name": x.Professor_Name,
                                            "Start_Time": x.Start_Time,
                                            "End_Time": x.End_Time,
                                            "Days": x.Days}]}
          }
        }
        var sql = 'SELECT SEWANTS.Email, SEWANTS.Course_Number, SEWANTS.Section_Number, SECLASS.ClassName, ' +
        'SECLASS.Professor_Name,SECLASS.Start_Time, SECLASS.End_Time, SECLASS.Days, SEUSER.first_name, ' +
        'SEUSER.last_name FROM SEWANTS INNER JOIN SECLASS on SEWANTS.Course_Number = SECLASS.Course_Number and '+
        'SEWANTS.Section_Number = SECLASS.Section_Number INNER JOIN SEUSER on SEWANTS.Email = SEUSER.Email'
        con.query (sql, function(err,res)
        {
          if(err) throw err;
          if (res.length === 0)
            reject("Error")
          else
          {
            for (var x of res)
            {
              User_List[x.Email].Wants.push({"Course_Number": x.Course_Number ,
                                              "Section_Number" : x.Section_Number,
                                              "ClassName" : x.ClassName,
                                              "Professor_Name": x.Professor_Name,
                                              "Start_Time": x.Start_Time,
                                              "End_Time": x.End_Time,
                                              "Days": x.Days})
             }
            }
            resolve(User_List)
          })
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
  listClasses: listClasses,
  appendHasUser : appendHasUser,
  removeHasUser : removeHasUser,
  removeWantsUser : removeWantsUser,
  appendWantsUser : appendWantsUser,
  addUser: addUser,
  validateUser : validateUser,
  getClasses: getClasses
}
