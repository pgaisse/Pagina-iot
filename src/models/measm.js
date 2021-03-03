var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'patoch2202',
  database : 'iot'
});
 
connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  return connection;
});

exports.connection=   connection;