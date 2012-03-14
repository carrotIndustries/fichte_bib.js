$(document).ready(function() {
	$("#printcodes").click(function() {
		$.ajax({
			type: "GET",
			url: "/print/pack",
			dataType: "json",
			success: function (data) {
				if(data.status == "ok") {
					status("Wird gedruckt");
				}
				else {
					status(data.data, "error");
				}
			}
		});
	});
	
		$("#printpupils").click(function() {
		$.ajax({
			type: "GET",
			url: "/print/pupils",
			dataType: "json",
			success: function (data) {
				if(data.status == "ok") {
					status("Wird gedruckt");
				}
				else {
					status(data.data, "error");
				}
			}
		});
	});
});
