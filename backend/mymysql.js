var mysql = require('mysql');
console.log("load mysql");
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cbm'
});
connection.connect();

//writes sensor data to DB
function writeDB(data, callback){
  connection.query("INSERT INTO sensorvalues SET ?", data, function(err,rows,fields){
  if(err){
    callback(err,false);
  }else{
    callback(err,true);
  }
  });
}

//Read Wrapper
function readDB(query,callback){
  connection.query(query, function(err, rows, fields) {
  if(err){
    callback(err,rows);
  }else{
    callback(err,rows);
  }
  });
}

module.exports.writeDB = writeDB;
module.exports.readDB = readDB;
