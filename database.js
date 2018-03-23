var mysql = require('mysql')
var squel = require("squel");
const server = require ('./config.json')

var con = mysql.createConnection({
  host: server.server.host,
  user: server.server.user,
  password: server.server.password,
  database: server.server.database
});

 var addUser  = function ( firstname , lastname, email , password)  {
   var sql = squel.insert()
    .into("SEUSER")
    .set("Email", email)
    .set("first_name", firstname)
    .set("last_name", lastname)
    .set("password", password)
    con.query (sql.toString(), function(err,result) {
      if(err) throw err;
      validateUser(email,password)
    });
}

var validateUser = function (email, password) {
  var sql = squel.select()
    .from("SEUSER")
    .where("Email = \'"+email+"\'  and pw = \'"+password+"\'")

    return new Promise((resolve , result) =>

    con.query (sql.toString(), function(err,res) {
      if(err) throw err;
      if (result == [])
        reject("User Not Found")
      else
        resolve(res)

    }));
}

module.exports = {
  addUser: addUser,
  validateUser : validateUser
}
