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
/*
 var addUser  = function (username , password)  {

}

module.exports = {
  addUser: addUser
}
*/
