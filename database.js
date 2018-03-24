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

// Check if user already exists in database
var checkUserExist = function (email) {
  var sql = squel.select()
    .from("SEUSER")
    .where("Email = \'" + email + "\'")

    return new Promise((resolve , reject) =>
    con.query (sql.toString(), function(err,res) {
      if(err) throw err;
      if (res.length === 0)
        resolve(res)
      else
        reject("Email already exists.")
    }));
}

module.exports = {
  addUser: addUser,
  validateUser : validateUser,
  addUser: addUser
}
