var http = require('http');
var express = require('express');
var fs = require('fs');
var jsonwriter = require("./backend/jsonwriter.js");
var sql = require("./backend/mymysql.js");
var app = express();
app.use(express.static('frontend'));
var sensors = [];

//http interface
app.get('/',function(req,res){
	res.sendFile('frontend/indexSaueee.html',{root: __dirname});
});

//grabs sensor data and starts loop
sql.readDB("SELECT * FROM sensors",function(err,sqlData){
	if(!err){
		for(var i=0;i<sqlData.length;i++){
				sensors[i]=sqlData[i];
		}
		setTimeout(sensorDataCallback,10000);
		app.listen(3000, function () {
			console.log('App listening on port 3000!');
		});
	}else{
		console.log("Couldn't read sensor DB");

	}
});

//http interface to deliver sensordata
app.get('/getData',function(req,res){
	calculateData(function(err,data){
		if(err){
			res.send('{"error":"true"}');
		}else{
			res.header("Content-Type", "application/json");
			res.send(data);
		}
	});
});

//Reads valid sensordata from DB and grad them
function calculateData(callback){
	var query = "SELECT rooms.name as 'Room', sensors.type as 'Type', avg(sensorvalues.value) as 'AVGvalue'  from rooms inner join sensors on sensors.room_id=rooms.room_id inner join sensorvalues on sensors.sensor_id=sensorvalues.sensor_id where timest > DATE_SUB(NOW(), INTERVAL 2 MINUTE) group by sensors.type, rooms.name order by rooms.name asc";
	sql.readDB(query,function(err,sqlData){
		if(err){
			callback(err,null);
		}else{
			if(sqlData.length>0){
				var assessed =jsonwriter.assessData(sqlData);
				var graded = jsonwriter.gradeRooms(assessed);
				callback(err,graded);
			}else{
				callback(err,'{"Error": "No Data"}');
			}
		}
	});
}

//Grabs sensor data
function getAndSaveSensorData(sensorNumber){
	//Code is used for testing, use outcommented code to run with real sensors
	json={sensor_id:2,value:55};
	sql.writeDB(json,function(err,ret){
			if(err){
				console.log("Failed writing to DB!");
			}else{
				console.log("Succesfully writen to DB!");
			}
		});
	//~ http.get(sensor[sensorNumber].url,function(err,json){
		//~ if(!err){
			//~ json.sensor_id=sensorNumber;
			//~ mymysql.writeDB(json,function(err,ret){
			//~ if(err){
				//~ log.writeToLogfile("Failed writing to DB!");
			//~ }else{
				//~ log.writeToLogfile("Succesfully writen to DB!");
			//~ }
			//~ });
		//~ }else{
			//~ console.log("Couldn't reach sensor: "+sensorNumber);
		//~ }
	//~ });
}

//loop for sensordata http calls
function sensorDataCallback(){
	for(var i=0;i<sensors.length;i++){
		getAndSaveSensorData(i);
	}
	setTimeout(sensorDataCallback,10000);
}
