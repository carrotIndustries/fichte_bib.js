function status(text, mode) {
	if(mode == "error") {
		$("div.status").css("background-color", "#C40000");
	}
	else {
		$("div.status").css("background-color", "green");
	}
	if(text == "Validation failed") {
		text="Überprüfung fehlgeschlagen";
	}
	if(text == "denied") {
		text = "Verboten";
	}
	$("div.status").html(text).fadeIn("fast").delay(1000).fadeOut("fast");
}
