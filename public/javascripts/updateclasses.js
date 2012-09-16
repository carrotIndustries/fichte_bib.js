$(document).ready(function() {
	$(".list>tbody>tr:odd").addClass("odd");
	$("form").submit(function() {
		var a= $(this).serializeArray();
		$.post("/do/updateclasses", a, function(data) {
			//alert(data.toSource());
			if(data.status == "error") {
				window.top.status(data.data, "error");
			}
			else {
				window.top.status("Klassen aktualisiert");
			}

		}, "json");
	});
	
	
	

	
	$("#submit").click(function() {
		$("form").submit();
	});
	
	$("#reset").click(function() {
		$("form")[0].reset();
	});
});


