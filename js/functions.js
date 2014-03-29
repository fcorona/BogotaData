var xmlhttp;
var xmlhttp2;
var xmlhttp3;

var checked = [];
var attrNamesArr = [];
var attrValuesArr = [];
var results;

var colorsArray = [[155,30,255],[12,200,180],[200,22,190],[24,180,210],[50,180,80]];

function indicadorOnOff(indicador_id){
	var isChecked = document.getElementById(indicador_id).checked;
	if(!isChecked){
		var index = checked.indexOf(indicador_id);
		if(index > -1){
			checked.splice(index,1);
		}
	}else{
		checked.push(indicador_id);
	}
	dibujar();
}

function getDatasets(){
	limpiarTodo();
	//document.getElementById("myList").update();
	var tags = document.getElementById("tags").value;
	tags = encodeURIComponent(tags);
	results = true;
	var page = 1;
	document.getElementById("myList").innerHTML = "<ul>";
	while(results){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=hayResultados;
		var url = "http://api.bogotacomovamos.org/datasets?page="+page+"&tags=&name="+tags;
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		page++;
	}
	document.getElementById("myList").innerHTML += "</ul>";
}

function hayResultados(){
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		var htmlDom = xmlhttp.responseText;
		var indices = getIndicesOf("api/datas/",htmlDom,true);
		if(indices.length > 0){
			listarDatasets(htmlDom,indices);
		}else{
			results = false;
		}
	}
}

function listarDatasets(htmlDom,indices){
	//document.getElementById("myList").innerHTML = "";
	var htmlDiv = "";
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		//var htmlDom = xmlhttp.responseText;
		//var indices = getIndicesOf("api/datas/",htmlDom,true);
		var ids = [];
		for (var i = 0; i < indices.length; i++) {
			var start = indices[i]+10, end = indices[i]+16;
			ids.push(htmlDom.substring(start,end));
			var toCut = ids[i].indexOf('/');
			ids[i] = ids[i].substring(0,toCut);
		}
		if(ids.length > 0){
			for(var i = 0; i < ids.length; i++){
				xmlhttp2 = new XMLHttpRequest();
				xmlhttp2.onreadystatechange=function(){
					var json = JSON.parse(xmlhttp2.responseText);
					htmlDiv += "<li><b><a href='http://api.bogotacomovamos.org/api/datas/"+json._id+"/?key=whatever' target='blank'>"+json.name+"</a>:</b> "+json.description+" ("+json.measureType+") <input type='checkbox' id='"+json._id+"' value='Dibujar' onclick='indicadorOnOff(this.id)'></li>";
				};
				xmlhttp2.open("GET","http://api.bogotacomovamos.org/api/datas/"+ids[i]+"/?key=whatever",false);
				xmlhttp2.send();
			}
		}else{
			htmlDiv = "No hay resultados.";
		}
	}
	document.getElementById("myList").innerHTML += htmlDiv;
}

function getIndicesOf(searchStr, str, caseSensitive) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function dibujar(){
	
	attrNamesArr = [];
	attrValuesArr = [];
	for(var i=0; i<checked.length; i++){
		xmlhttp3 = new XMLHttpRequest();
		xmlhttp3.onreadystatechange=recolectarDatos;
		xmlhttp3.open("GET","http://api.bogotacomovamos.org/api/datas/"+checked[i]+"/?key=whatever",false);
		xmlhttp3.send();
	}

	
	var htmlCanvas = "";
	htmlCanvas += "<canvas id='chart1' width='600' height='400'></canvas>";
	document.getElementById("myChart").innerHTML = htmlCanvas;
	document.getElementById("myChartLegend").innerHTML = "<b>Leyenda</b><br>";
	var ctx = document.getElementById("chart1").getContext("2d");
	var r, g, b, datasetsArr = [];
	for(var i=0; i<attrNamesArr.length; i++){
		if(i>=5){
			r = Math.floor(Math.random()*100)+155;
			g = Math.floor(Math.random()*100)+155;
			b = Math.floor(Math.random()*100)+155;
		}else{
			r = colorsArray[i][0];
			g = colorsArray[i][1];
			b = colorsArray[i][2];
		}
		datasetsArr.push({
			fillColor : "rgba("+r+","+g+","+b+",0.35)",
			strokeColor : "rgba("+r+","+g+","+b+",1)",
			pointColor : "rgba("+r+","+g+","+b+",1)",
			pointStrokeColor : "#fff",
			data : attrValuesArr[i]
		});
		document.getElementById("myChartLegend").innerHTML += "<span style='color:rgba("+r+","+g+","+b+",1);'>Graph("+i+")</span><br>";
	}
	var data = {
		labels : attrNames,
		datasets : datasetsArr
	}
	var myNewChart = new Chart(ctx).Line(data);
}

function recolectarDatos(){
	document.getElementById("myChart").innerHTML = "";
	var json = JSON.parse(xmlhttp3.responseText);

	attrNames = [];
	attrValues = [];
	for(var key in json.datas){
		var attrName = key;
		var attrValue = json.datas[key];
		if (attrValue==='null') attrValue = 0;
		attrNames.push(attrName);
		attrValues.push(attrValue);
	}

	attrNamesArr.push(attrNames);
	attrValuesArr.push(attrValues);
}

function limpiarTodo(){
	checked = [];
	attrNamesArr = [];
	attrValuesArr = [];
	document.getElementById("myChart").innerHTML = "";
	document.getElementById("myChartLegend").innerHTML = "";
	document.getElementById("myList").innerHTML = "";
}