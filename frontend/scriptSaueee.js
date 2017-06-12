
function getData(url){
	getJSON(url,
	function(err, data) {
 	 if (err != null) {
  	  alert('No Data'S);
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
	json = JSON.parse(json);
	var divParent = document.createElement('div');
	divParent.id ='rooms';
	divParent.className='row jsInserted';
	document.getElementById('main').appendChild(divParent);

	//Process data
	for(var i=0;i<json.rooms.length;i++){
		  var temp="No data";
			var vol="No data";
			var light="No data";
		  for(var j=0;j<json.rooms[i].data.length;j++){
				if(json.rooms[i].data[j].type=="temp"){
					temp=json.rooms[i].data[j].AVGvalue;
					temp=Math.floor(temp);
				}
				if(json.rooms[i].data[j].type=="vol"){
					vol=json.rooms[i].data[j].AVGvalue;
					vol=Math.floor(vol);
				}
				if(json.rooms[i].data[j].type=="light"){
					light=json.rooms[i].data[j].AVGvalue;
					light=Math.floor(light);
				}
			}
			var volBew=" ";
			if(vol!="No data"){
				volBew= bewerteVol(vol);
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
			divModal.innerHTML ='<div class="modal-dialog"><div class="modal-content"><div class="modal-header"  style="background-color:'+modalColor+';>'+
					'<button type="button" class="close" data-dismiss="modal">&times;</button>'+
					'<h4 class="modal-title">Raum: '+json.rooms[i].name+'</h4>'+
					'</div><div class="modal-body"><p></p><div class="container col-sm-3 col-md-4 col-lg-4"></div><div class="container col-sm-6 col-md-4 col-lg-4">'+
					'<div class="panel panel-default"><div class="panel-body"><div class="row"><div class="col-sm-3 col-md-3 col-lg-3"><i class="material-icons icon">volume_up</i></div><div class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-8 col-md-8 col-lg-8 value">'+vol+' Dezibel ~'+volBew+'</div></div></div></div><div class="panel panel-default"><div class="panel-body"><div class="row"><div class="col-sm-3 col-md-3 col-lg-3">  <i class="material-icons icon">ac_unit</i></div><div'+ 'class="col-sm-1 col-md-1 col-lg-1"></div><div class="col-sm-8 col-md-8 col-lg-8 value">'+temp+' °C</div></div></div></div><div class="panel panel-default"><div class="panel-body"><div class="row"><div class="col-sm-3 col-md-3 col-lg-3"><i class="material-icons icon">people</i></div>  <div class="col-sm-1 col-md-1 col-lg-1"></div>  <div class="col-sm-8 col-md-8 col-lg-8 value">'+light+' Personen</div>  </div>  </div>    </div>  </div>  <div class="container col-sm-3 col-md-4'+ 'col-lg-4"></div></div>'+
					'</div></div>';
			document.getElementById('forModals').appendChild(divModal);
		}

}
//
function bewerteVol(vol){
	if(vol<10){

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
}

// getData('/getData');
createRooms('{"rooms":[{"name":"101","data":[{"type":"temp","AVGvalue":55},{"type":"vol","AVGvalue":45},{"type":"light","AVGvalue":55}],"Grade":"red"},{"name":"101","data":[{"type":"temp","AVGvalue":55}],"Grade":"red"},{"name":"102","data":[{"type":"temp","AVGvalue":55}],"Grade":"green"},{"name":"103","data":[{"type":"temp","AVGvalue":55}],"Grade":"orange"},{"name":"101","data":[{"type":"temp","AVGvalue":55}],"Grade":"red"}]}');
