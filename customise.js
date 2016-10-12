function setCookie(cname, cvalue) {
	document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
		}
	}
	return "";
}

function confirmCustomisation() {
	setCookie("logoImage", $("#logoImage").val());
	setCookie("pageTitle", $("#pageTitle").val());
	setCookie("backgroundColour", $("#backgroundColour").val());
	setCookie("textColour", $("#textColour").val());
	setCookie("linkColour", $("#linkColour").val());
	
	document.location.href = "index.html";
}

function resetDefaults() {
	$("#pageTitle").val("Weather adaptive cycling");
	$("#logoImage").val("default.jpg");
	$("#backgroundColour").val("#FFFFFF");
	$("#textColour").val("#333333");
	$("#linkColour").val("#337AB7");
}

$(document).ready(function(){
	$("#pageTitle").val(getCookie("pageTitle"));
	$("#logoImage").val(getCookie("logoImage"));
	$("#backgroundColour").val(getCookie("backgroundColour"));
	$("#textColour").val(getCookie("textColour"));
	$("#linkColour").val(getCookie("linkColour"));
}); 

/*


console.log(document.cookie);
console.log(getCookie("pageTitle"));
*/