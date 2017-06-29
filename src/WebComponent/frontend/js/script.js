const DEBUG = 1;

function getData(url){
	getJSON(url,
	function(err, data) {
 	 if (err != null) {
  	  alert('No Data');
  	} else {
  	 createRooms(data);
  	}
	});
}

//call url for sensor data
function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    // xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
};

//Creates and inserts Rooms and Modals in HTML File for data
function createRooms(json){
	//create parent div
	json2 = JSON.parse(json);
  json = '{"rooms":[{"name":"101","data":[{"type":"temp","AVGvalue":55,"grade":"orange"},{"type":"vol","AVGvalue":45,"grade":"green"},{"type":"light","AVGvalue":28,"grade":"red"}],"Grade":"red"},{"name":"A008","data":[{"type":"temp","AVGvalue":27,"grade":"orange"},{"type":"vol","AVGvalue":40,"grade":"orange"},{"type":"light","AVGvalue":8,"grade":"green"}],"Grade":"orange"},{"name":"A010","data":[{"type":"temp","AVGvalue":22,"grade":"green"},{"type":"vol","AVGvalue":15,"grade":"green"},{"type":"light","AVGvalue":4,"grade":"green"}],"Grade":"green"},{"name":"A206","data":[{"type":"temp","AVGvalue":30,"grade":"red"},{"type":"vol","AVGvalue":60,"grade":"red"},{"type":"light","AVGvalue":45,"grade":"red"}],"Grade":"red"},{"name":"A212","data":[{"type":"temp","AVGvalue":24,"grade":"green"},{"type":"vol","AVGvalue":35,"grade":"orange"},{"type":"light","AVGvalue":24,"grade":"orange"}],"Grade":"orange"}]}'
  json = JSON.parse(json);
	json.rooms[0]=json2.rooms[0];
	var divParent = document.createElement('div');
	divParent.id ='rooms';
	divParent.className='row jsInserted';
	document.getElementById('main').appendChild(divParent);

	//Process data
	for(var i=0;i<json.rooms.length;i++){
		var temp="No data";
		var vol="No data";
		var light="No data";
		var tempColor;
		var volColor;
		var lightColor;
		tempColor="transparent";
		volColor="transparent";
		lightColor="transparent";
		for(var j=0;j<json.rooms[i].data.length;j++){
			if(json.rooms[i].data[j].type=="temp"){
				temp=json.rooms[i].data[j].AVGvalue;
				temp=Math.floor(temp);
				tempColor=json.rooms[i].data[j].grade;
			}
			if(json.rooms[i].data[j].type=="vol"){
				vol=json.rooms[i].data[j].AVGvalue;
				vol=Math.floor(vol);
				volColor=json.rooms[i].data[j].grade;
			}
			if(json.rooms[i].data[j].type=="light"){
				light=json.rooms[i].data[j].AVGvalue;
				light=Math.floor(light);
				lightColor=json.rooms[i].data[j].grade;
			}
		}
		if(typeof lightColor== 'undefined'){
			lightColor='transparent';
		}
		if(typeof volColor== 'undefined'){
			volColor='transparent';
		}
		if(typeof tempColor== 'undefined'){
			tempColor='transparent';
		}

			var volBew=" ";
			if(vol!="No data"){
				volBew= bewerteVol(vol);
			}
			var activity=" ";
			if(light!="No data"){
				activity= bewerteLight(light);
			}
			var modalcolor='';
	    var div = document.createElement('div');
	    div.className = 'col-sm-3 custom';
			if(json.rooms[i].Grade=='red'){
				div.style.backgroundColor = "#cc0000";
				modalColor='#cc0000';
			}if(json.rooms[i].Grade=='orange'){
				div.style.backgroundColor = "#ff9933";
				modalColor='#ff9933';
			}if(json.rooms[i].Grade=='green'){
				div.style.backgroundColor = "#009933";
				modalColor='#009933';
			}
			//insert room div in HTML File
			div.setAttribute("data-toggle", "modal");
			div.setAttribute("data-target", "#room"+i);
	    div.innerHTML = '<h3>Raum '+json.rooms[i].name+'</h3>';
	    document.getElementById('rooms').appendChild(div);

			//Create and insert Modal to HTML file
			var divModal = document.createElement('div');
			divModal.setAttribute("id","room"+i);
			divModal.setAttribute("class","modal fade");
			divModal.setAttribute("role","dialog");
			divModal.innerHTML ='<style>#room'+i+' #volColor{background-color: '+volColor+';} #room'+i+' #tempColor{background-color: '+tempColor+';} #room'+i+' #lightColor{background-color: '+lightColor+';}</style><div class="modal-dialog"><div class="modal-content"><div class="modal-header" style="background-color:'+modalColor+';>'+
					'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
					'<h4 class="modal-title">Raum: '+json.rooms[i].name+'</h4></div><div class="modal-body"><p></p><div class="container col-sm-3 col-md-4 col-lg-4"></div><div class="container col-sm-6 col-md-4 col-lg-4">'+
					'<div class="panel panel-default" id="volColor"><div class="panel-body" ><div class="row" ><div class="col-sm-3 col-md-3 col-lg-3" ><i class="material-icons icon">wb_cloudy</i></div><div class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-8 col-md-8 col-lg-8 value">'+vol+' Dezibel ~'+volBew+'</div></div></div></div><div class="panel panel-default" id="tempColor"><div class="panel-body"><div class="row"><div class="col-sm-3 col-md-3 col-lg-3">'+
					'<i class="material-icons icon">ac_unit</i></div><div  class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-8 col-md-8 col-lg-8 value" >'+temp+' °C</div></div></div></div><div class="panel panel-default" id="lightColor"><div class="panel-body"><div class="row"><div class="col-sm-3 col-md-3 col-lg-3"><i class="material-icons icon">people</i></div>  <div class="col-sm-1 col-md-1 col-lg-1"></div>'+
					'<div class="col-sm-8 col-md-8 col-lg-8 value">'+activity+'</div>  </div>  </div>    </div>  </div>  <div class="container col-sm-3 col-md-4  col-lg-4"></div></div></div></div>';
			document.getElementById('forModals').appendChild(divModal);
		}

}
//grade light and convert to text
function bewerteLight(light){
	if(light<5){
		return "Keine Aktivität";
	}
	if(light>=5&&light<10){
		return "Wenig Aktivität";
	}
	if(light>=10&&light<15){
		return "Mäßige Aktivität";
	}
	if(light>=15&&light<25){
		return "Viel Aktivität";
	}
	if(light>=25&&light<70){
		return "Sehr Viel Aktivität"
	}
	return "No Data";
}

//grade vol and convert to text
function bewerteVol(vol){
	if(vol<10){
		return "Atmen";
	}
	if(vol>=10&&vol<20){
		return "Mückenflug";
	}
	if(vol>=20&&vol<30){
		return "Uhrticken";
	}
	if(vol>=30&&vol<40){
		return "Vogelgezwitscher";
	}
	if(vol>=40&&vol<50){
		return "Bürolautstärke"
	}
	if(vol>=50&&vol<60){
		return "Fernseher"
	}
	if(vol>=70&&vol<80){
		return "Staubsauger"
	}
	if(vol>=80&&vol<90){
		return "Rasenmäher"
	}
	if(vol>=90&&vol<100){
		return "Kreissäge"
	}
	if(vol>=100){
		return "Rock-Konzert"
	}
	return "No Data";
}

if(DEBUG==1){
	createRooms('{"rooms":[{"name":"101","data":[{"type":"temp","AVGvalue":55,"grade":"orange"},{"type":"vol","AVGvalue":45,"grade":"green"},{"type":"light","AVGvalue":20,"grade":"red"}],"Grade":"red"},{"name":"101","data":[{"type":"temp","AVGvalue":55}],"Grade":"red"},{"name":"102","data":[{"type":"temp","AVGvalue":55}],"Grade":"green"},{"name":"103","data":[{"type":"temp","AVGvalue":55}],"Grade":"orange"},{"name":"101","data":[{"type":"temp","AVGvalue":55}],"Grade":"red"}]}');
}else{
	getData('/getData');
}
