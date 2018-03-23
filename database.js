var mysql = require('mysql')
var squel = require("squel");
const server = require ('./config.json')

var con = mysql.createConnection({
  host: server.server.host,
  user: server.server.user,
  password: server.server.password,
  database: server.server.database
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = squel.select();
  sql.from("SECLASS")
  sql.where("Course_Number = 'CAP 4104'")
  con.query (sql.toString(), function(err,result) {
    if(err) throw err;
    console.log("query executed");
    console.log(result);
  });
});

 var addUser  = function (email , password, firstname , lastname)  {
   var sql = squel.insert()
    .into("SEUSER")
    .set("Email", email)
    .set("first_name", firstname)
    .set("last_name", lastname)
    .set("password", password)
    con.query (sql.toString(), function(err,result) {
      if(err) throw err;
      console.log("query executed");
      console.log(result);
    });
}

var validateUser = function (email, password) {
  var sql = squel.select()
    .from("SEUSER")
    .where("Email = \'{0}\'  and password = \'{1}\.".format(email,password))
    con.query (sql.toString(), function(err,result) {
      if(err) throw err;
      console.log("query executed");
      console.log(result);
    });
}

module.exports = {
  addUser: addUser
}
