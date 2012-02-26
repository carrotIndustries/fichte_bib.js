
$(document).ready(function(){
	$("form").submit(function() {
		var t= {};
		var a = $(this).serializeArray();
		for(x in a) {
			t[a[x].name] = a[x].value;
		}
		$("input[type=text]").removeClass("error");
		if(t._id) {
			var url = "/do/update/pupil";
		}
		else {
			var url = "/do/add/pupil";
		}
		
		$.post(url, t, function(data) {
			//alert(data.toSource());
			if(data.status == "error") {
				if(data.data == "alreadyexists") {
					window.top.status("Es gibt diese Kartennumber bereits", "error");
					$("input[name=card]").addClass("error");
				}
				else {	
					for(x in data.data.errors) {
						$("input[name="+x+"]").addClass("error");
					}
				}
				window.top.status(data.data.message, "error");
			}
			else {
				//$("span.success").fadeIn(100).delay(1000).fadeOut();
				if(t._id) {
					window.top.status("Schüler wurde gespeichert", null);
					window.top.list();
					window.top.killPopup();
				}
				else {
					status("Schüler wurde hinzugefügt", null);
					$("#generate").click();
				}
				$("form")[0].reset();
			}

		}, "json");
		
	});
	$("#submit").click(function() {
		$("form").submit();
	});
	
	$("#reset").click(function() {
		$("form")[0].reset();
	});
	
	$("#generate").click(function() {
		generateCode("4711", function(code) {
			$("input[name=card]").val(code);
		});
	});
	
	$("#close").click(function() {
		window.top.killPopup();
	});
	
	$("#fetch").click(function() {
		fetchISBN($("input[name=isbn]").val());
	});
	
	$("form").keypress(function(event) {
		if(event.which == 13) {
			$("form").submit();
			event.preventDefault();
		}
		
	});

});
