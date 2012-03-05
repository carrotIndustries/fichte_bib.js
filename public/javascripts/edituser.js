
$(document).ready(function(){
	$("form").submit(function() {
		var t= {};
		var a = $(this).serializeArray();
		for(x in a) {
			t[a[x].name] = a[x].value;
		}
		$("input[type=text]").removeClass("error");
		t.permissions = $("select[name=permissions]").val();
		$.post("/do/update/user", t, function(data) {
			//alert(data.toSource());
			if(data.status == "error") {
				
				for(x in data.data.errors) {
					$("input[name="+x+"]").addClass("error");
				}
				window.top.status(data.data.message, "error");
				
			}
			else {
				//$("span.success").fadeIn(100).delay(1000).fadeOut();
				window.top.status("Gruppe wurde gespeichert", null);
				window.top.list();
				window.top.killPopup();
				
				
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
	

	$("#close").click(function() {
		window.top.killPopup();
	});
		
	$("form").keypress(function(event) {
		if(event.which == 13) {
			$("form").submit();
			event.preventDefault();
		}
		
	});

});
