console.log("hoi");

function httpGet(theUrl) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	return xmlHttp.responseText;
}

function weatherForecastLatLong(lat, lon) {
	key = "53737e31378c16da320326248ae3df11";
	url = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + key;
	console.log(url);
	//console.log("http://api.openweathermap.org/data/2.5/forecast?lat=53.330986&lon=6.518513&appid=53737e31378c16da320326248ae3df11")
	return httpGet(url);
}

//console.log(weatherForecastLatLong(53.330986, 6.518513));
//console.log(httpGet("http://api.openweathermap.org/data/2.5/forecast?lat=53.330986&lon=6.518513&appid=53737e31378c16da320326248ae3df11"));

