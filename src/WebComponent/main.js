var http = require('http');
var express = require('express');
var request = require('request');
var fs = require('fs');
var cmd = require('node-cmd');
var jsonwriter = require("./backend/jsonwriter.js");
var sql = require("./backend/mymysql.js");
var app = express();
app.use(express.static('frontend'));
var sensors = [];

//http interface
app.get('/',function(req,res){
	res.sendFile('frontend/index.html',{root: __dirname});
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
		res.header("Content-Type", "application/json");
		if(err){
			res.send('{"error":"true"}');
		}else{
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
app.get('/sensors',function(req,res){
	res.header("Content-Type", "application/json");
	res.send('{"temp": 50}');
});

//Grabs sensor data
function getAndSaveSensorData(sensorNumber){
	//Code is used for testing, use outcommented code to run with real sensors
	// json={sensor_id:6,value:55};
	// sql.writeDB(json,function(err,ret){
	// 		if(err){
	// 			console.log("Failed writing to DB!");
	// 		}else{
	// 			console.log("Succesfully writen to DB!");
	// 		}
	// 	});

    cmd.get('curl '+sensors[sensorNumber].url, function(err, data, stderr){
			console.log(data);
			if(!err){
				var sensorValue;
				data=JSON.parse(data);
				if(sensors[sensorNumber].type=='temp'){
						sensorValue = data.temp;
					}
					if(sensors[sensorNumber].type=='light'){
						sensorValue = data.laser+data.door;
					}
					if(sensors[sensorNumber].type=='vol'){
						sensorValue = data.humidity;
					}
					json = '{"sensor_id":'+sensors[sensorNumber].sensor_id+',"value":'+sensorValue+'}';
					json=JSON.parse(json);
					sql.writeDB(json,function(err,ret){
						if(err){
							console.log("Failed writing to DB!");
						}else{
							console.log("Succesfully writen to DB!");
						}
				  });
				}else{
					console.log("Couldn't reach sensor!")
				}
    });
}

//loop for sensordata http calls
function sensorDataCallback(){
	for(var i=0;i<sensors.length;i++){
		getAndSaveSensorData(i);
	}
	setTimeout(sensorDataCallback,5000);
}
