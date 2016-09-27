console.log("hoi");

var skobblerKey = "1071b1a66d18a54cc861930a397ed442";
var googleKey = "AIzaSyAFkA1mS07PF2d_B9nIfgoGdBamtMAolQI";

function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

function weatherForecastLatLong(lat, lon) {
	var key = "53737e31378c16da320326248ae3df11";
	var url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + key;
	console.log(url);
	//console.log("http://api.openweathermap.org/data/2.5/forecast?lat=53.330986&lon=6.518513&appid=53737e31378c16da320326248ae3df11")
	return httpGet(url);
}

//console.log(weatherForecastLatLong(53.330986, 6.518513));
//console.log(httpGet("http://api.openweathermap.org/data/2.5/forecast?lat=53.330986&lon=6.518513&appid=53737e31378c16da320326248ae3df11"));

$(document).ready(function(){
	$("#routeplanpage2").hide();
	$("#routeplanpage3").hide();
}); 

function gotoPage(page) {
	$("#routeplanpage1").hide();
	$("#routeplanpage2").hide();
	$("#routeplanpage3").hide();
	$("#routeplanpage" + page).show();
}

var skobblerRouteRequest = "http://" + skobblerKey + ".tor.skobbler.net/tor/RSngx/calcroute/json/20_5/en/" + skobblerKey + "?";

function geocodeRequest(address) {
	address = address.split(' ').join('+');
	var geocode = JSON.parse(httpGet("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleKey));
	return geocode.results[0].geometry.location;
}

function planRoute() {
	startend = $("#startend").val();
	via1 = $("#via1").val();
	via2 = $("#via2").val();
	
	var coordinates = [];
	
	coordinates.push(geocodeRequest(startend));
	coordinates.push(geocodeRequest(via1));
	coordinates.push(geocodeRequest(via2));
	
	
	var endcoordinates = {};
	endcoordinates.lat = coordinates[0].lat+0.1;
	endcoordinates.lng = coordinates[0].lng+0.1;
	
	var routerequest = skobblerRouteRequest
		+ "start=" + coordinates[0].lat + "," + coordinates[0].lng
		+ "&dest=" + endcoordinates.lat + "," + endcoordinates.lng
		+ "&v0=" + coordinates[1].lat + "," + coordinates[1].lng
		+ "&v1=" + coordinates[2].lat + "," + coordinates[2].lng
		+ "&profile=bicycle"
		+ "&advice=yes"
		+ "&points=yes";
	
	console.log(httpGet(routerequest));
}