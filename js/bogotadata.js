var xmlhttp, xmlhttp2;
var checkedDatasetsIds = [];
var attrNamesArr = [];
var attrValuesArr = [];

function searchAvailableDatasets(){
	var tags = document.getElementById("searchTxt").value;
	tags = encodeURIComponent(tags);
	results = true;
	var page = 1;
	document.getElementById("list").innerHTML = "";
	while(results){
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange=isThereADatasetInAPI;
		var url = "http://api.bogotacomovamos.org/datasets?page="+page+"&tags=&name="+tags;
		xmlhttp.open("GET",url,false);
		xmlhttp.send();
		page++;
	}
}

function isThereADatasetInAPI(){
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
		var htmlDom = xmlhttp.responseText;
		var indices = getIndicesOf("api/datas/",htmlDom,true);
		if(indices.length > 0){
			listDatasets(htmlDom,indices);
		}else{
			results = false;
		}
	}
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

function listDatasets(htmlDom,indices){
	var htmlDiv = "";
	if (xmlhttp.readyState==4 && xmlhttp.status==200)
	{
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
					htmlDiv += "<input type='checkbox' name='datasetsGroup' id='"+json._id+"' onclick='clickedDataset(this.id)'><label for='"+json._id+"'>"+json.name+"</label><br>";
				};
				xmlhttp2.open("GET","http://api.bogotacomovamos.org/api/datas/"+ids[i]+"/?key=MrNrVJeCH5H2T8ERbUeZ9wSae5VlXDAZTsScShZ5J29IkkWbSb",false);
				xmlhttp2.send();
			}
		}else{
			htmlDiv = "No hay resultados.";
		}
	}
	document.getElementById("list").innerHTML += htmlDiv;
}

function clickedDataset(indicador_id){
	var isChecked = document.getElementById(indicador_id).checked;
	if(!isChecked){
		var index = checkedDatasetsIds.indexOf(indicador_id);
		if(index > -1){
			checkedDatasetsIds.splice(index,1);
		}
	}else{
		checkedDatasetsIds.push(indicador_id);
	}
	drawDatasets();
}

function drawDatasets(){
	attrNamesArr = [];
	attrValuesArr = [];
	for(var i=0; i<checkedDatasetsIds.length; i++){
		xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange=recolectarDatos;
		xmlhttp2.open("GET","http://api.bogotacomovamos.org/api/datas/"+checkedDatasetsIds[i]+"/?key=MrNrVJeCH5H2T8ERbUeZ9wSae5VlXDAZTsScShZ5J29IkkWbSb",false);
		xmlhttp2.send();
	}

	
	var htmlCanvas = "";
	htmlCanvas += "<canvas id='chart1' width='600' height='400'></canvas>";
	document.getElementById("myChart").innerHTML = htmlCanvas;
	//document.getElementById("myChartLegend").innerHTML = "<b>Leyenda</b><br>";
	var ctx = document.getElementById("chart1").getContext("2d");
	var r, g, b, datasetsArr = [];
	for(var i=0; i<attrNamesArr.length; i++){
		r = Math.floor(Math.random()*200);
		g = Math.floor(Math.random()*200);
		b = Math.floor(Math.random()*200);
		datasetsArr.push({
			fillColor : "rgba("+r+","+g+","+b+",0.35)",
			strokeColor : "rgba("+r+","+g+","+b+",1)",
			pointColor : "rgba("+r+","+g+","+b+",1)",
			pointStrokeColor : "#fff",
			data : attrValuesArr[i]
		});
		//document.getElementById("myChartLegend").innerHTML += "<span style='color:rgba("+r+","+g+","+b+",1);'>Graph("+i+")</span><br>";
	}
	var data = {
		labels : attrNames,
		datasets : datasetsArr
	}
	var myNewChart = new Chart(ctx).Line(data);
}

function recolectarDatos(){
	document.getElementById("myChart").innerHTML = "";
	var json = JSON.parse(xmlhttp2.responseText);

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

function generateUrlToShare(){
	var title = document.getElementById("title").value;
	if(title===""){
		title = "Sin título";
	}
	title = encodeURIComponent(title);
	var description = document.getElementById("description").value;
	if(description===""){
		description = "Sin título";
	}
	description = encodeURIComponent(description);
	var url = "http://bogotadata.kaputlab.co/ver.html?title="+title+"&description="+description+"&ids=[";
	for(var i=0; i<checkedDatasetsIds.length; i++){
		url += checkedDatasetsIds[i];
		if(i!=checkedDatasetsIds.length-1){
			url += ",";
		}else{
			url += "]";
		}
	}

	alert(url);

	var shareBtn = document.getElementById("shareBtn");
	shareBtn.setAttribute("data-clipboard-text",url);
	var shareFbBtn = document.getElementById("shareFbBtn");
	shareFbBtn.setAttribute("data-href",url);
	var shareTwBtn = document.getElementById("shareTwBtn");
	shareTwBtn.setAttribute("data-url",url);
	shareTwBtn.setAttribute("data-text","Revisa estas comparaciones: "+url);
}