//Limit for room grading
const TEMP_RED_MIN = 40;
const TEMP_ORANGE_MIN = 101;
const VOL_RED_MIN = 50;
const VOL_ORANGE_MIN = 101;
const LIGHT_RED_MIN = 50;
const LIGHT_ORANGE_MIN = 50;

//grade rooms and insert the result in json
function gradeRooms(json,callback){
	var inserted=false;
	var counter=0;
	for(var i=0;i<json.rooms.length;i++){
		counter=0;
		inserted=false;
		while(!inserted&&(counter<json.rooms[i].data.length)){
			if((json.rooms[i].data[counter].type=='temp'&&json.rooms[i].data[counter].AVGvalue>TEMP_RED_MIN)||
			(json.rooms[i].data[counter].type=='vol'&&json.rooms[i].data[counter].AVGvalue>VOL_RED_MIN)||
			(json.rooms[i].data[counter].type=='light'&&json.rooms[i].data[counter].AVGvalue>LIGHT_RED_MIN)){
				json.rooms[i].Grade='red';
				inserted=true;
			}else{
				if((json.rooms[i].data[counter].type=='temp'&&json.rooms[i].data[counter].AVGvalue>TEMP_ORANGE_MIN)||
				(json.rooms[i].data[counter].type=='vol'&&json.rooms[i].data[counter].AVGvalue>VOL_ORANGE_MIN)||
				(json.rooms[i].data[counter].type=='light'&&json.rooms[i].data[counter].AVGvalue>LIGHT_ORANGE_MIN)){
					json.rooms[i].Grade='orange';
					inserted=true;
				}
			}
			counter++;
		}
		if(inserted==false){
			json.rooms[i].Grade='green';
		}
	}
	return JSON.stringify(json);
}

//Format SQLArray in JSON
function assessData(sqlData){
	actualRoom=sqlData[0].Room;
	var rooms ={};
	rooms['rooms']=[];
	data=[];
	if(sqlData.length>0){
		for(var i=0;i<sqlData.length;i++){
			if(actualRoom==sqlData[i].Room){
				var dataObj={type:sqlData[i].Type,AVGvalue: sqlData[i].AVGvalue};
				data.push(dataObj);
			}else{
				var roomObj={name:sqlData[i-1].Room,data}
				rooms['rooms'].push(roomObj);
				data=[];
				dataObj={type:sqlData[i].Type,AVGvalue: sqlData[i].AVGvalue};
				data.push(dataObj);
				actualRoom=sqlData[i].Room;
			}
			if(sqlData.length-1==i){
				var roomObj={name:sqlData[i].Room,data}
				rooms['rooms'].push(roomObj);
			}
		}
	}
	return rooms;
}

//formatiert array zu json
//~ function assessData(sqlData,callback){
	//~ var responseJson = [];
	//~ var actualRoom = sqlData[0].Room;
	//~ responseJson=responseJson+'{"Rooms":[{"name": "'+sqlData[0].Room+'", "data": [{"type": "'+sqlData[0].Type+'", "AVGvalue": "'+sqlData[0].AVGvalue+'"}';
	//~ if(sqlData.length>1){
		//~ for(var i=1;i<sqlData.length;i++){
			//~ if(actualRoom==sqlData[i].Room){
				//~ responseJson=responseJson+',{"type": "'+sqlData[i].Type+'", "AVGvalue": "'+sqlData[i].AVGvalue+'"}';
			//~ }else{
				//~ responseJson=responseJson+']}';
				//~ responseJson=responseJson+', '+'{"name": "'+sqlData[i].Room+'","data":[{"type": "'+sqlData[i].Type+'", "AVGvalue": "'+sqlData[i].AVGvalue+'"}';
				//~ if(i==sqlData.length-1){
					//~ responseJson=responseJson+']}]}';
				//~ }
			//~ }
		//~ }
	//~ }else{
		//~ responseJson=responseJson+']}]}';
	//~ }
	//~ return responseJson;
//~ }

module.exports.assessData = assessData;
module.exports.gradeRooms = gradeRooms;
