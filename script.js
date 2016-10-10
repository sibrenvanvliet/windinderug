var skobblerKey = "1071b1a66d18a54cc861930a397ed442";
var googleKey = "AIzaSyAFkA1mS07PF2d_B9nIfgoGdBamtMAolQI";
var weatherKey = "53737e31378c16da320326248ae3df11";

function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	$("#warningProtection").hide();
	return xmlHttp.responseText;
}

function weatherForecastLatLong(lat, lon) {
	var url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + weatherKey;
	return httpGet(url);
}

function weatherLatLong(lat, lon) {
	var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=" + weatherKey;
	return httpGet(url);
}

function gotoPage(page) {
	$("#routeplanpage1").hide();
	$("#routeplanpage2").hide();
	$("#routeplanpage3").hide();
	$("#routeplanpage" + page).show();
}

function geocodeRequest(address) {
	address = address.split(' ').join('+');
	var geocode = JSON.parse(httpGet("https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=" + googleKey));
	console.log(geocode);
	return geocode.results[0].geometry.location;
}

function drawRoute(routeArr) {
	var coords = [];
	
	for (var i = 0; i < routeArr.length; i++) {
		var coord = [];
		coord.push(routeArr[i].y);
		coord.push(routeArr[i].x);
		coords.push(coord);
	}
	
	var polyline = L.polyline(coords, {color: 'blue'}).addTo(map);
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
	
	var skobblerResponse = JSON.parse(httpGet(routerequest));
	
	console.log(skobblerResponse);
	
	routeArray = skobblerResponse.route.routePoints;
	
	drawRoute(routeArray);
	
	numberOfCoordinates = 20;
	
	stepsize = Math.floor(routeArray.length / (numberOfCoordinates + 1));
	
	routeLength = skobblerResponse.route.routelength / 1000;
	
	distancePerStep = routeLength / numberOfCoordinates;
	
	//console.log(routeArray);
	
	coordinates = [];
	for (var i = 0; i < numberOfCoordinates; i++) {
		var coord = routeArray[i * stepsize];
		coordinates.push({"lat": coord.y, "lng": coord.x});
	}
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

$(document).ready(function(){
	$("#warningJquery").hide();
	$("#routeplanpage2").hide();
	$("#routeplanpage3").hide();
	var testResponse = httpGet("http://1071b1a66d18a54cc861930a397ed442.tor.skobbler.net/tor/RSngx/calcroute/json/20_5/en/1071b1a66d18a54cc861930a397ed442");
}); 

function validateTimeSpeed() {
	currentDate = new Date();
	
	startM = parseInt($("#starttimeM").val());
	startH = parseInt($("#starttimeH").val());
	startD = parseInt($("select[id=starttimeD]").val());
	avgSpeed = parseInt($("#speed").val());
	speedunit = $("#speedunit").val();
	startDstring = $("#starttimeD").val();
	
	if (isNaN(startH) || isNaN(startM) || startH < 0 || startH > 23 || startM < 0 || startM > 59) {
		alert("Please enter a proper starting time (0:00 - 23:59).");
		return;
	}
	
	currentTime = Date.now(); // current time in UTC
	startTime = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate() + startD, startH, startM + currentDate.getTimezoneOffset() + 1); // entered time in UTC
	calculationTime = startTime;
	
	if (startTime < currentTime) {
		alert("Please enter a start time that is not before the current time.");
		return;
	}
	
	if (isNaN(avgSpeed)) {
		alert("Please enter a number (>0) for your expected average speed.");
		return;
	}
	
	if (avgSpeed < 1) {
		alert("Your expected average speed should be at least 1 " + speedunit + ".");
		return;
	}
	
	if (speedunit === "mph") {
		avgSpeed *= 1.60934;
	}
	
	// Everything is okay, so go to the next page
	console.log("currentTime:" + currentTime);
	console.log("startTime:" + startTime);
	gotoPage(3);
	optimiseWeather();
}

// Function returns, from the forecast list, the wind at a specific time
function windAtTime(windIndex, time) {
	var windinfo = windinfos[windIndex].forecast;
	console.log(windinfo);
	var firstTime = parseInt(windinfo.list[0].dt) * 1000;
	
	console.log("I want the weather for " + time);
	console.log("firstTime: " + firstTime);
	
	if (time < firstTime) {
		console.log("Current weather required!");
		if (windinfos[windIndex].current === 0) {
			var point = coordinates[windIndex];
			weatherResult = weatherLatLong(point.lat, point.lng);
			weatherResult = JSON.parse(weatherResult);
			console.log(weatherResult);
			windinfos[windIndex].current = weatherResult;
			
			if (windIndex === 0) {
				windinfos[windinfos.length - 1].current = weatherResult;
			}
		}
		
		console.log(windinfos[windIndex].current);
		
		firstWeather = windinfos[windIndex].current;
		secondWeather = windinfo.list[0];
		firstTime -= 10800000;
	} else {
		var firstTimeIndex = 0;
		while (time - 10800000 > firstTime) {
			firstTime += 10800000;
			firstTimeIndex++;
		}
		
		firstWeather = windinfo.list[firstTimeIndex];
		secondWeather = windinfo.list[firstTimeIndex + 1];
	}
	
	gravitationToFirst = (time - firstTime) / 10800000;
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
	
	return {"roaddeg": roadangle, "winddeg": avgwind.deg, "windspeed": avgwind.speed};
}

function calculateWindShares() {
	var totalTail = 0.0;
	var totalHead = 0.0;
	var totalCross = 0.0;

	for (var i = 0; i < coordinates.length - 1; i++) {
		var milliseconds = Math.round(distancePerStep / avgSpeed * 3600000);
		var middleTime = calculationTime + milliseconds / 2;
		calculationTime += milliseconds;
		
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
	$('#' + prefix + 'Dir').html("Start cycling in the direction of " + heading);
	$('#' + prefix + 'Tail').html(wind.tail + "% tailwind").css("width", wind.tail + "%");
	$('#' + prefix + 'Cross').html(wind.cross + "% crosswind").css("width", wind.cross + "%");
	$('#' + prefix + 'Head').html(wind.head + "% headwind").css("width", wind.head + "%");
}

// Returns true if route1 wins, returns false if route2 wins
function originalWasBestRoute(route1, route2) {
	return ((route1.tail - route2.tail) > (route1.head - route2.head));
}

function optimiseWeather () {
	// Gather wind information from coordinates using OpenWeatherMap API
	var retries = 0;
	windinfos = [];
	for (var i = 0; i < coordinates.length - 1; i++) {
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

		windinfos.push({"forecast": weatherResult, "current": 0});
	}
	windinfos.push(windinfos[0]);
	
	// Display results
	routeDuration = Math.round(routeLength / avgSpeed * 60);
	
	console.log("calculationTime for original direction: " + calculationTime);
	var originalDirectionWinds = calculateWindShares();
	coordinates.reverse();
	windinfos.reverse();
	calculationTime = startTime;
	console.log("calculationTime for reversed direction: " + calculationTime);
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
	$("#msgOptim").html("Your route has been optimised.");
	$("#routeInfo").html("Starting " + startDstring + " at " + startH + ":" + (startM < 10 ? "0" : "") + startM + "h.<br />" 
		+ "Distance: " + ((speedunit === kmh) ? (routeLength.toFixed(1) + " kilometres. ") : ((routeLength/1.60934).toFixed(1) + "miles. "))
		+ "Duration: " + Math.floor(routeDuration/60) + "h" + ((routeDuration % 60) < 10 ? "0" : "") + (routeDuration % 60) + "m.");
}