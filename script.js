var skobblerKey = "1071b1a66d18a54cc861930a397ed442";
var googleKey = "AIzaSyAFkA1mS07PF2d_B9nIfgoGdBamtMAolQI";

function httpGet(theUrl, cors) {
	//console.log(theUrl);
	var xmlHttp = new XMLHttpRequest();
	
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	//xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
	xmlHttp.send( null );
	return xmlHttp.responseText;
  //return $.get(theUrl, function(data) { return data; });
}

//httpGet("//1071b1a66d18a54cc861930a397ed442.tor.skobbler.net/tor/RSngx/calcroute/json/20_5/en/1071b1a66d18a54cc861930a397ed442?start=53.2431482,6.4081044&dest=53.3016754,6.5998288&profile=bicycle" , false);

//console.log(httpGet('http://1071b1a66d18a54cc861930a397ed442.tor.skobbler.net/tor/RSngx/calcroute/json/20_5/en/1071b1a66d18a54cc861930a397ed442?start=53.2431482,6.4081044&dest=53.3016754,6.5998288&profile=bicycle'));

function weatherForecastLatLong(lat, lon) {
	var key = "53737e31378c16da320326248ae3df11";
	var url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + key;
	return httpGet(url, false);
}

function weatherLatLong(lat, lon) {
	var key = "53737e31378c16da320326248ae3df11";
	var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=" + key;
	return httpGet(url, false);
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
	var geocode = JSON.parse(httpGet("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleKey, false));
	console.log(geocode);
	return geocode.results[0].geometry.location;
}

function drawRoute(routeArr) {
	var coordss = [];
	
	for (var i = 0; i < routeArr.length, i++) {
		var coord = [];
		coord.push(routeArr[i].y);
		coord.push(routeArr[i].x);
		coords.push(coord);
	}
	
	var polyline = L.polyline(coordss, {color: 'red'}).addTo(map);
	map.fitBounds(polyline.getBounds());
}

/***** ROUTE PLANNING *****/
function planRoute() {
	vias = [];
	startend = $("#startend").val();
	vias.push($("#via1").val());
	vias.push($("#via2").val());
	vias.push($("#via3").val());
	
	geocodes = [];
	geocodes.push(geocodeRequest(startend));
	for (var i = 0; i < vias.length; i++) {
		geocodes.push(geocodeRequest(vias[i]));
	}
	
	var endcoordinates = {};
	endcoordinates.lat = geocodes[0].lat+0.00001;
	endcoordinates.lng = geocodes[0].lng+0.00001;
	
	var routerequest = "http://1071b1a66d18a54cc861930a397ed442.tor.skobbler.net/tor/RSngx/calcroute/json/20_5/en/1071b1a66d18a54cc861930a397ed442?"
		+ "start=" + geocodes[0].lat + "," + geocodes[0].lng
		+ "&dest=" + endcoordinates.lat + "," + endcoordinates.lng
		+ "&v0=" + geocodes[1].lat + "," + geocodes[1].lng
		+ "&v1=" + geocodes[2].lat + "," + geocodes[2].lng
		+ "&v2=" + geocodes[3].lat + "," + geocodes[3].lng
		+ "&profile=bicycle"
		+ "&advice=yes"
		+ "&points=yes";
	
	var skobblerResponse = JSON.parse(httpGet(routerequest, false));
	
	console.log(skobblerResponse);
	
	routeArray = skobblerResponse.route.routePoints;
	
	drawRoute(routeArray);
	
	numberOfCoordinates = 40;
	
	stepsize = Math.floor(routeArray.length / (numberOfCoordinates + 1));
	
	routeLength = skobblerResponse.route.routelength / 1000;
	
	distancePerStep = routeLength / numberOfCoordinates;
	
	coordinates = [];
	for (var i = 0; i < numberOfCoordinates; i++) {
		var coord = routeArray[i * stepsize];
		coordinates.push({"lat": coord.y, "lng": coord.x});
	}
}
	
	
	// Rondje Amsterdam
	/*
	coordinates.push({"lat": 53.230883, "lng": 6.523121}); // Korrewegwijk
	coordinates.push({"lat": 53.261305, "lng": 6.397679});
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

	distances = [];
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
	distances.push(10.0);
	distances.push(6.6);
}
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

function dateTimeToEpoch(dateTime) {
	secondsSinceEpoch = dateTime.m * 60
		+ (dateTime.h - 9) * 60 * 60
		+ (dateTime.dd - 28) * 60 * 60 * 24;
	return secondsSinceEpoch + epochDT;
}

// Function returns, from the forecast list, the wind at a specific time
function windAtTime(windIndex, time) {
	time = dateTimeToEpoch(time);
	var windinfo = windinfos[windIndex];
	var firstTime = parseInt(windinfo.list[0].dt);
	var firstTimeIndex = 0;
	
	if (time < firstTime) {
		console.log("Current weather required!");
		return {"deg": 0, "speed": 0};
	}
	
	while (time - 10800 > firstTime) {
		firstTime += 10800;
		firstTimeIndex++;
	}
	
	firstWeather = windinfo.list[firstTimeIndex];
	secondWeather = windinfo.list[firstTimeIndex + 1];
	gravitationToFirst = (time - firstTime) / 10800;
	
	winddegAtTime = firstWeather.wind.deg * (1.0 - gravitationToFirst) + secondWeather.wind.deg * gravitationToFirst;
	windspeedAtTime = firstWeather.wind.speed * (1.0 - gravitationToFirst) + secondWeather.wind.speed * gravitationToFirst;
	
	return {"deg": winddegAtTime, "speed": windspeedAtTime};
}

function averageDegrees(deg1, deg2) {
	if ((deg1 < 90 || deg1 > 270) && (deg2 < 90 || deg2 > 270)) {
		return ((deg1 + deg2) % 360) / 2;
	}
	
	return (deg1 + deg2) / 2;
}

// Returns the wind between two points at a certain time
function windBetweenTwoPoints(firstIndex, time) {
	var roadangle = angleBetweenTwoPoints(coordinates[firstIndex], coordinates[firstIndex + 1]);
	var wind1 = windAtTime(firstIndex, time);
	var wind2 = windAtTime(firstIndex + 1, time);
	
	var avgwind = {"deg": averageDegrees(wind1.deg, wind2.deg), "speed": ((wind1.speed + wind2.speed) / 2)};
	
	returnable = {"roaddeg": roadangle, "winddeg": avgwind.deg, "windspeed": avgwind.speed};
	//console.log(time);
	//console.log(returnable);
	return returnable;
}

function calculateWindShares() {
	var totalTail = 0.0;
	var totalHead = 0.0;
	var totalCross = 0.0;

	for (var i = 0; i < coordinates.length - 1; i++) {
		var minutes = Math.round(distancePerStep / avgSpeed * 60);
		var middleTime = addTimeToDateTime(currentTime, {"h": 0, "m": Math.round(minutes / 2)});
		currentTime = addTimeToDateTime(currentTime, {"h": 0, "m": minutes});
		
		var point = windBetweenTwoPoints(i, middleTime);
		
		var degdiff = Math.round(point.roaddeg - point.winddeg + 360) % 360;
		
		if (degdiff > 135 && degdiff < 225) {
			//windType = "tailwind";
			//console.log(windType);
			totalTail += distancePerStep * point.windspeed;
		} else if (degdiff < 45 || degdiff > 315) {
			//windType = "headwind";
			//console.log(windType);
			totalHead += distancePerStep * point.windspeed;
		} else {
			//windType = "crosswind";
			//console.log(windType);
			totalCross += distancePerStep * point.windspeed;
		}
	}
	
	var windSum = totalTail + totalHead + totalCross;
	var percentTail = Math.round(100 * totalTail / windSum);
	var percentHead = Math.round(100 * totalHead / windSum);
	var percentCross = 100 - percentTail - percentHead;
	
	return {"tail": percentTail, "head": percentHead, "cross": percentCross};
}

function displayWindOptimisationResults(prefix, heading, wind) {
	$('#' + prefix + 'Dir').html("Recommended: Start cycling in the direction of " + heading);
	$('#' + prefix + 'Tail').html(wind.tail + "% tailwind").css("width", wind.tail + "%");
	$('#' + prefix + 'Cross').html(wind.cross + "% crosswind").css("width", wind.cross + "%");
	$('#' + prefix + 'Head').html(wind.head + "% headwind").css("width", wind.head + "%");
}

// Returns true if route1 wins, returns false if route2 wins
function originalWasBestRoute(route1, route2) {
	return ((route1.tail - route2.tail) > (route1.head - route2.head));
}

function optimiseWeather () {
	// TIME STUFF
	epochDT = 1475053200;
	epochDateTime = {"yy": 2016, "mm": 9, "dd": 28, "h": 9, "m" : 0};

	startTime = {"yy": 2016, "mm": 9, "dd": 29, "h": 5, "m" : 0};
	currentTime = startTime;
	avgSpeed = $("#speed").val();
	
	// Gather wind information from coordinates using OpenWeatherMap API
	var retries = 0;
	windinfos = [];
	for (var i = 0; i < coordinates.length - 1; i++) {
		var point = coordinates[i];
		weatherResult = weatherForecastLatLong(point.lat, point.lng);
		weatherResult = JSON.parse(weatherResult);
		//console.log(weatherResult);

		if (weatherResult.cod !== "200" && retries < 20) {
			console.log("Wind location " + i + " not found! Retrying...");
			coordinates[i].lat += 0.01;
			coordinates[i].lng += 0.01;

			i--;
			retries++;
			continue;
		}

		windinfos.push(weatherResult);
	}
	windinfos.push(windinfos[0]);
	
	// Display results
	var originalDirectionWinds = calculateWindShares();
	coordinates.reverse();
	windinfos.reverse();
	var reversedDirectionWinds = calculateWindShares();
	
	var originalWins = originalWasBestRoute(originalDirectionWinds, reversedDirectionWinds);
	
	if (originalWins) {
		recHeading = vias[0];
		altHeading = vias[vias.length - 1];
		recWind = originalDirectionWinds;
		altWind = reversedDirectionWinds;
	} else {
		altHeading = vias[0];
		recHeading = vias[vias.length - 1];
		altWind = originalDirectionWinds;
		recWind = reversedDirectionWinds;
	}
	
	displayWindOptimisationResults('rec', recHeading, recWind);
	displayWindOptimisationResults('alt', altHeading, altWind);
	
	/*
	var originalStartHeading = vias[0];
	var reverseStartHeading = vias[vias.length - 1];
	
	console.log("Recommended:");
	if (originalWins) {
		console.log("Start by cycling in the direction of " + originalStartHeading);
	} else {
		console.log("Start by cycling in the direction of " + reverseStartHeading);
	}

	console.log("\nIf you start by cycling in the direction of " + originalStartHeading);
	displayWindOptimisationResults(originalDirection);

	console.log("\nIf you start by cycling in the direction of " + reverseStartHeading);
	displayWindOptimisationResults(reversedDirection);
	*/
}