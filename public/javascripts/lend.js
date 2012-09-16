$(document).ready(function(){
	
	$("form").submit(function() {
		var t= new Array();
		var a = $(this).serializeArray();
		for(x in a) {
			var d = a[x].value.split(".");
			if(d.length == 3) {
				t.push({object: a[x].name, returndate: new Date(d[2], Number(d[1])-1, d[0], 10).getTime()});
			}
			else {
				status("Ungültiges Datum", "error");
			}
		}
		var d = now.split(".");
		var o = {
			now:  new Date(d[2], Number(d[1])-1, d[0], 10).getTime(),
			pupil: pupil,
			objects: t
		};
		
		$.post("/do/lend", o, function(data) {
			//alert(data.toSource());
			if(data.status == "error") {
				window.top.status(data.data.message, "error");
			}
			else {
				window.top.status("Ausgeliehen", null);
				if(quick != "true") {
					window.top.location.href = "/objects";
				}
				window.top.killPopup();
				
				
			}

		}, "json");
	});
	$(".datepicker").datepicker({ dateFormat: 'dd.mm.yy' , minDate: now});
	
	$(".rating").each(function() {
		//console.log(calcAvg($(this).attr("rating").split(",")));
		renderRating(calcAvg($(this).attr("rating").split(",")), $(this));
	});
	
	$("#lend").click(function() {
		
		$("form").submit();
	});
	$("#close").click(function() {
		window.top.killPopup();
	});
});

