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
	return httpGet(url);
}

function weatherLatLong(lat, lon) {
	var key = "53737e31378c16da320326248ae3df11";
	var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=" + key;
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
	
	/*
	var routerequest = skobblerRouteRequest
		+ "start=" + coordinates[0].lat + "," + coordinates[0].lng
		+ "&dest=" + endcoordinates.lat + "," + endcoordinates.lng
		+ "&v0=" + coordinates[1].lat + "," + coordinates[1].lng
		+ "&v1=" + coordinates[2].lat + "," + coordinates[2].lng
		+ "&profile=bicycle"
		+ "&advice=yes"
		+ "&points=yes";
	*/
	
	var routerequest = "http://" + skobblerKey + ".tor.skobbler.net/tor/RSngx/calcroute/json/20_5/en/" + skobblerKey + "?"
		+ "start=" + coordinates[0].lat + "," + coordinates[0].lng
		+ "&dest=" + coordinates[1].lat + "," + coordinates[1].lng
		+ "&profile=bicycle";
	
	console.log(httpGet(routerequest));
	//console.log(routerequest);
}

var coordinates = [];
coordinates.push({"lat": 53.231854, "lng": 6.529080});
coordinates.push({"lat": 53.271768, "lng": 6.484025});
coordinates.push({"lat": 53.328955, "lng": 6.519389});
coordinates.push({"lat": 53.320854, "lng": 6.690573});
coordinates.push({"lat": 53.268822, "lng": 6.692517});
coordinates.push({"lat": 53.169356, "lng": 6.617061});
coordinates.push({"lat": 53.231854, "lng": 6.529080});
/*
coordinates.push({"lat": 52.946551, "lng": 4.735070});
coordinates.push({"lat": 52.708098, "lng": 4.674169});
coordinates.push({"lat": 52.453862, "lng": 4.578549});
coordinates.push({"lat": 52.186173, "lng": 4.417890});
*/

var windinfos = [];
/*
for (var i = 0; i < coordinates.length; i++) {
	var point = coordinates[i];
	weatherResult = JSON.parse(weatherLatLong(point.lat, point.lng));
	console.log('{"deg":' + weatherResult.wind.deg + ',"speed":' + weatherResult.wind.speed + '}');
	//windinfos.push({"deg": weatherResult.wind.deg,"speed": weatherResult.wind.speed});
}
*/
/*
windinfos.push({"deg": 225,"speed": 7.71});
windinfos.push({"deg": 225,"speed": 3.08});
windinfos.push({"deg": 190,"speed": 5.14});
windinfos.push({"deg": 190,"speed": 5.14});
*/

function dsin(x) {
	return Math.sin(x / 180 * Math.PI); 
}

function dcos(x) {
	return Math.cos(x / 180 * Math.PI); 
}

function datan2(x, y) {
	return Math.atan2(x, y) * 180 / Math.PI; 
}

windinfos.push({"deg":222,"speed":2.06});
windinfos.push({"deg":222,"speed":2.57});
windinfos.push({"deg":131,"speed":2.57});
windinfos.push({"deg":212,"speed":1.54});
windinfos.push({"deg":212,"speed":1.54});
windinfos.push({"deg":222,"speed":2.06});
windinfos.push({"deg":222,"speed":2.06});

function delta(a,b) {
	return Math.abs(a-b);
}

function angleBetweenTwoPoints(point1, point2) {
	p1lat = point1.lat / 180 * Math.PI;
	p2lat = point2.lat / 180 * Math.PI;
	p1lng = point1.lng / 180 * Math.PI;
	p2lng = point2.lng / 180 * Math.PI;
	
	var delta = Math.abs(p1lng - p2lng);
	
	var X = Math.cos(p2lat) * Math.sin(delta);
	var Y = Math.cos(p1lat) * Math.sin(p2lat) - Math.sin(p1lat) * Math.cos(p2lat) * Math.cos(delta);
	
	var angle = Math.atan2(X, Y) / 0.0174533;
	
	if (p2lng < p1lng) {
		angle = 360 - angle;
	}
	
	return angle;
}

function windBetweenTwoPoints(point1, point2, wind1, wind2) {
	var roadangle = angleBetweenTwoPoints(point1, point2);
	var avgwind = {"deg": ((wind1.deg + wind2.deg) / 2), "speed": ((wind1.speed + wind2.speed) / 2)};
	
	returnable = {"roaddeg": roadangle, "winddeg": avgwind.deg, "windspeed": avgwind.speed};
	console.log(returnable);
	return returnable;
}

// Tjaart method
/*
sumcxpos = 0;
sumcxneg = 0;
sumcypos = 0;
sumcyneg = 0;
sumx = 0;
sumy = 0;

for (var i = 0; i < coordinates.length - 1; i++) {
	var point = windBetweenTwoPoints(coordinates[i], coordinates[i+1], windinfos[i], windinfos[i+1]);
	
	cx = dcos(point.winddeg - point.roaddeg) * point.windspeed;
	cy = dsin(point.winddeg - point.roaddeg) * point.windspeed;
	
	sumcxpos += cx > 0 ? cx : 0;
  sumcxneg += cx < 0 ? cx : 0;
  sumcypos += cy > 0 ? cy : 0;
  sumcyneg += cy < 0 ? cy : 0;
  sumx += Math.abs(cx);
  sumy += Math.abs(cy);
}

//calculate coefficients
var cxposc = sumcxpos / sumx; //headwind
var cxnegc = sumcxneg / sumx; //tailwind
var cyposc = sumcypos / sumy; //crosswind from left
var cynegc = sumcyneg / sumy; //crosswind from right

console.log(cxposc);
console.log(cxnegc);
console.log(cyposc);
console.log(cynegc);
*/

for (var i = 0; i < coordinates.length - 1; i++) {
	var point = windBetweenTwoPoints(coordinates[i], coordinates[i+1], windinfos[i], windinfos[i+1]);
	
	var degdiff = Math.round(point.roaddeg - point.winddeg + 360) % 360;
	if (degdiff > 135 && degdiff < 225) {
		console.log("meewind");
	} else if (degdiff < 45 || degdiff > 315) {
		console.log("tegenwind");
	} else {
		console.log("zijwind");
	}
}




//console.log(angleBetweenTwoPoints({"lat":39.099912, "lng":-94.581213}, {"lat":38.627089, "lng":-90.200203}));
/*
console.log("");
console.log(angleBetweenTwoPoints({"lat": 1, "lng" : 0},{"lat": 1, "lng" : 2}));
console.log(angleBetweenTwoPoints({"lat": 2, "lng" : 0},{"lat": 0, "lng" : 2}));
console.log(angleBetweenTwoPoints({"lat": 2, "lng" : 1},{"lat": 0, "lng" : 1}));
console.log(angleBetweenTwoPoints({"lat": 2, "lng" : 2},{"lat": 0, "lng" : 0}));
console.log(angleBetweenTwoPoints({"lat": 1, "lng" : 2},{"lat": 1, "lng" : 0}));
console.log(angleBetweenTwoPoints({"lat": 0, "lng" : 2},{"lat": 2, "lng" : 0}));
console.log(angleBetweenTwoPoints({"lat": 0, "lng" : 1},{"lat": 2, "lng" : 1}));
console.log(angleBetweenTwoPoints({"lat": 0, "lng" : 0},{"lat": 2, "lng" : 2}));
*/