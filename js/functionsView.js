window.onload = onLoadFunc;

var ids;
var datas;
var datasLabels;

function onLoadFunc(){
	var params = getSearchParameters();
	for(var key in params){
		var keyStr = key;
		var valueStr = params[key];
		document.getElementById("params").innerHTML += "key: ("+keyStr+") value:("+valueStr+")<br>";
		switch(keyStr){
			case 'title':
			document.getElementById("title").innerHTML = decodeURIComponent(valueStr);
			break;
			case 'description':
			document.getElementById("description").innerHTML = decodeURIComponent(valueStr);
			break;
			case 'ids':
			ids = JSON.parse(valueStr);
			var items = "";
			for(var i=0; i<ids.length; i++){
				items += "<li>"+ids[i]+"</li>";
			}
			document.getElementById("ids").innerHTML = "<ul>"+items+"</ul>";
			pintarChart();
			break;
		}
	}
}

function getSearchParameters() {
	var prmstr = window.location.search.substr(1);
	return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
	var params = {};
	var prmarr = prmstr.split("&");
	for ( var i = 0; i < prmarr.length; i++) {
		var tmparr = prmarr[i].split("=");
		params[tmparr[0]] = tmparr[1];
	}
	return params;
}

function pintarChart(){
	if(ids.length>0){
		halarDatos();
		var htmlCanvas = "";
		htmlCanvas += "<canvas id='chart1' width='500' height='400'></canvas>";
		document.getElementById("chart").innerHTML = htmlCanvas;
		document.getElementById("chartLegend").innerHTML = "<b>Leyenda</b><br>";
		var ctx = document.getElementById("chart1").getContext("2d");
		var r, g, b, datasetsArr = [];
		for(var i=0; i<datas.length; i++){
			r = Math.floor(Math.random()*255);
			g = Math.floor(Math.random()*255);
			b = Math.floor(Math.random()*255);
			datasetsArr.push({
				fillColor : "rgba("+r+","+g+","+b+",0.35)",
				strokeColor : "rgba("+r+","+g+","+b+",1)",
				pointColor : "rgba("+r+","+g+","+b+",1)",
				pointStrokeColor : "#fff",
				data : getDatasFromJson(datas[i])
			});
			document.getElementById("chartLegend").innerHTML += "<span style='color:rgba("+r+","+g+","+b+",1);'>"+datas[i].name+"</span><br>";
		}
		var data = {
			labels : datasLabels,
			datasets : datasetsArr
		}
		var myNewChart = new Chart(ctx).Line(data);
	}
}

function getDatasFromJson(json){
	var datasThisJson = [];
	for(key in json.datas){
		var value = json.datas[key];
		datasThisJson.push(value);
	}
	return datasThisJson;
}

function halarDatos(){
	datas = [];
	datasLabels = [];
	var xmlhttp;
	var labels = false;
	for(var i=0; i<ids.length; i++){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=function(){
			var thisData = JSON.parse(xmlhttp.responseText);
			if(!labels){
				for(key in thisData.datas){
					var keyStr = key;
					datasLabels.push(keyStr);
				}
				labels = true;
			}
			datas.push(thisData);
		};
		xmlhttp.open("GET","http://api.bogotacomovamos.org/api/datas/"+ids[i]+"/?key=whatever",false);
		xmlhttp.send();
	}
}