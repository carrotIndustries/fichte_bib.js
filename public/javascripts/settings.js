$(document).ready(function() {
	$("form").submit(function() {
		var t= {};
		var z= {};
		var a = $(this).serializeArray();
		for(x in a) {
			z[a[x].name] = a[x].value;
		}
		t.returndate = {};
		t.returndate.mode = z.returnmode;
		
		var d = z.returndate.split(".");
		if(d.length == 3) {
			t.returndate.date =  new Date(d[2], parseInt(d[1])-1, d[0], 10).getTime();
		}
		else {
			status("Ungültiges Datum", "error");
			return;
		}
		t.defaultgroup = z.defaultgroup;
		t.visibleobjectcolumns = $("select[name=visiblecols]").val();
		t.lpropts = z.lpropts;
		t.reminds = {};
		t.reminds.text = z.remindtext;
		t.reminds.fine = parseFloat(z.fine);
		$("input[name=fine]").val(t.reminds.fine);
		$.post("/do/updatemeta", t, function(data) {
			//alert(data.toSource());
			if(data.status == "error") {
				window.top.status(data.data.message, "error");
			}
			else {
				window.top.status("Einstellungen gespeichert");
			}

		}, "json");
	});
	
	
	
	$(".datepicker").datepicker({ dateFormat: 'dd.mm.yy'});
	
	$("#submit").click(function() {
		$("form").submit();
	});
	
	$("#reset").click(function() {
		$("form")[0].reset();
	});
});


