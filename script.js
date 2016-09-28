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

/***** ROUTE PLANNING *****/

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
// Rondje Amsterdam
coordinates.push({"lat": 53.230883, "lng": 6.523121}); // Korrewegwijk
coordinates.push({"lat": 53.261305, "lng": 6.397679});
/*
coordinates.push({"lat": 53.265829, "lng": 6.252694});
coordinates.push({"lat": 53.255020, "lng": 6.122838});
coordinates.push({"lat": 53.221569, "lng": 5.991301});
coordinates.push({"lat": 53.223078, "lng": 5.840853}); // Camminghabruen
coordinates.push({"lat": 53.206105, "lng": 5.695556});
coordinates.push({"lat": 53.187111, "lng": 5.551941});
coordinates.push({"lat": 53.171032, "lng": 5.416849});
coordinates.push({"lat": 53.089963, "lng": 5.370761});
coordinates.push({"lat": 53.042436, "lng": 5.247926}); // Makkum
coordinates.push({"lat": 52.983336, "lng": 5.135314});
coordinates.push({"lat": 52.921999, "lng": 5.036997});
coordinates.push({"lat": 52.838503, "lng": 5.024240});
coordinates.push({"lat": 52.759837, "lng": 5.040955});
coordinates.push({"lat": 52.679942, "lng": 5.031217}); // Gemeente Hoorn
coordinates.push({"lat": 52.608783, "lng": 5.004752}); // Gemeente Koggenland
coordinates.push({"lat": 52.529558, "lng": 4.956675});
coordinates.push({"lat": 52.444589, "lng": 4.949828}); // Landsmeer
coordinates.push({"lat": 52.371346, "lng": 4.964627});
coordinates.push({"lat": 52.330725, "lng": 5.065764}); // Weesp
coordinates.push({"lat": 52.354392, "lng": 5.133428});
coordinates.push({"lat": 52.415714, "lng": 5.205585});
coordinates.push({"lat": 52.464066, "lng": 5.325429});
coordinates.push({"lat": 52.516339, "lng": 5.442286});
coordinates.push({"lat": 52.566705, "lng": 5.519038}); // Lelystad
coordinates.push({"lat": 52.610013, "lng": 5.641877});
coordinates.push({"lat": 52.650536, "lng": 5.722788});
coordinates.push({"lat": 52.716596, "lng": 5.779643});
coordinates.push({"lat": 52.793334, "lng": 5.839287});
coordinates.push({"lat": 52.852241, "lng": 5.938124}); // Oldemarkt
coordinates.push({"lat": 52.898143, "lng": 6.063415});
coordinates.push({"lat": 52.953926, "lng": 6.179021});
coordinates.push({"lat": 53.018621, "lng": 6.250857});
coordinates.push({"lat": 53.073156, "lng": 6.331768}); // Een
coordinates.push({"lat": 53.155135, "lng": 6.369819});
coordinates.push({"lat": 53.206443, "lng": 6.456753});
coordinates.push({"lat": 53.230883, "lng": 6.523121});
*/
/*
// Rondje Stedum
coordinates.push({"lat": 53.231854, "lng": 6.529080});
coordinates.push({"lat": 53.271768, "lng": 6.484025});
coordinates.push({"lat": 53.328955, "lng": 6.519389});
coordinates.push({"lat": 53.320854, "lng": 6.690573});
coordinates.push({"lat": 53.268822, "lng": 6.692517});
coordinates.push({"lat": 53.169356, "lng": 6.617061});
coordinates.push({"lat": 53.231854, "lng": 6.529080});
*/
/*
// Westkust
coordinates.push({"lat": 52.946551, "lng": 4.735070});
coordinates.push({"lat": 52.708098, "lng": 4.674169});
coordinates.push({"lat": 52.453862, "lng": 4.578549});
coordinates.push({"lat": 52.186173, "lng": 4.417890});
*/

var distances = [];
distances.push(10.0);
/*
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(10.0);
distances.push(6.6);
*/

/***** We now have a list of coordinates and the road distance between them *****/
/***** WEATHER DATA GATHERING *****/

// Gather wind information from coordinates using OpenWeatherMap API
var retries = 0;
var windinfos = [];
for (var i = 0; i < coordinates.length; i++) {
	var point = coordinates[i];
	weatherResult = weatherForecastLatLong(point.lat, point.lng);
	weatherResult = JSON.parse(weatherResult);
	console.log(weatherResult);
	
	if (weatherResult.cod !== "200" && retries < 20) {
		console.log("Wind location " + i + " not found! Retrying...");
		coordinates[i].lat += 0.01;
		coordinates[i].lng += 0.01;
		
		i--;
		retries++;
		continue;
	}
	
	//console.log('{"deg":' + weatherResult.wind.deg + ',"speed":' + weatherResult.wind.speed + '}');
	//windinfos.push({"deg": weatherResult.wind.deg,"speed": weatherResult.wind.speed});
	//console.log(weatherResult);
}
//windinfos.push(windinfos[0]); deze zo weer terug!!!!!!!

/*
windinfos.push({"deg": 225,"speed": 7.71});
windinfos.push({"deg": 225,"speed": 3.08});
windinfos.push({"deg": 190,"speed": 5.14});
windinfos.push({"deg": 190,"speed": 5.14});
*/
/*
windinfos.push({"deg":222,"speed":2.06});
windinfos.push({"deg":222,"speed":2.57});
windinfos.push({"deg":131,"speed":2.57});
windinfos.push({"deg":212,"speed":1.54});
windinfos.push({"deg":212,"speed":1.54});
windinfos.push({"deg":222,"speed":2.06});
windinfos.push({"deg":222,"speed":2.06});
*/

var epochDT = 1475053200;
var epochDateTime = {"yy": 2016, "mm": 9, "dd": 28, "h": 9, "m" : 0};

//var firstForecast = ;

function dateTimeToEpoch(dateTime) {
	secondsSinceEpoch = dateTime.m * 60
		+ (dateTime.h - 9) * 60 * 60
		+ (dateTime.dd - 28) * 60 * 60 * 24;
	return secondsSinceEpoch + epochDT;
}

var startTime = {"yy": 2016, "mm": 9, "dd": 29, "h": 5, "m" : 0};
var currentTime = startTime;
var avgSpeed = 20;

function addTimeToDateTime(dateTime, time) {
	
	return {"yy": dateTime.yy, "mm": dateTime.mm, "dd": dateTime.dd, "h": (dateTime.h + time.h + Math.floor((dateTime.m + time.m) / 60)), "m": ((dateTime.m + time.m) % 60)}
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

function windBetweenTwoPoints(point1, point2, wind1, wind2, time) {
	var roadangle = angleBetweenTwoPoints(point1, point2);
	var avgwind = {"deg": ((wind1.deg + wind2.deg) / 2), "speed": ((wind1.speed + wind2.speed) / 2)};
	
	returnable = {"roaddeg": roadangle, "winddeg": avgwind.deg, "windspeed": avgwind.speed};
	console.log(returnable);
	return returnable;
}

var totalTail = 0.0;
var totalHead = 0.0;
var totalCross = 0.0;

for (var i = 0; i < coordinates.length - 1; i++) {
	var minutes = Math.round(distances[i] / avgSpeed * 60);
	var middleTime = addTimeToDateTime(currentTime, {"h": 0, "m": Math.round(minutes / 2)});
	currentTime = addTimeToDateTime(currentTime, {"h": 0, "m": minutes});
	
	console.log(dateTimeToEpoch(currentTime));
	/*
	
	var degdiff = Math.round(point.roaddeg - point.winddeg + 360) % 360;
	
	if (degdiff > 135 && degdiff < 225) {
		windType = "tailwind";
		console.log(windType);
		totalTail += point.windspeed;
	} else if (degdiff < 45 || degdiff > 315) {
		windType = "headwind";
		console.log(windType);
		totalHead += point.windspeed;
	} else {
		windType = "crosswind";
		console.log(windType);
		totalCross += point.windspeed;
	}
	*/
}

var windSum = totalTail + totalHead + totalCross;
var percentTail = Math.round(100 * totalTail / windSum);
var percentHead = Math.round(100 * totalHead / windSum);
var percentCross = 100 - percentTail - percentHead;

console.log("\n");
console.log(percentTail + "% tailwind");
console.log(percentHead + "% headwind");
console.log(percentCross + "% crosswind");

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