var mysql = require('mysql')

var con = mysql.createConnection({
  host: "ocelot.aul.fiu.edu",
  user: "spr17_fkais001",
  password: "5727468",
  database: "spr17_fkais001"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  //var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
  //con.query (sql, function(err,result) {
  //  if(err) throw err;
  //  console.log("table created");
  //});
});
