function processXML(xml) {
	if(parseInt($(xml).find("feed>openSearch\\:totalResults").text()) == 0) {
		$("#pleasewait").text("Fehler");
		$("#pleasewait").delay(1000).fadeOut("fast");
		return;
	}
	$("input[name=title]").val("");
	var titles = [];
	$(xml).find("feed>entry>dc\\:title").each(function() {
		titles.push($(this).text());
		
	});
	$("input[name=title]").val(titles.join(" - "));
	$(xml).find("feed>entry>dc\\:date").each(function() {
		$("input[name=year]").val($(this).text().slice(0,4));
	});
	$(xml).find("feed>entry>dc\\:publisher").each(function() {
		$("input[name=publisher]").val($(this).text());
	});
	var i=0;
	$(xml).find("feed>entry>dc\\:creator").each(function() {
		var arr = $(this).text().split(" ");
		if(i <= 1) {
			$("input[name=author_first_"+i+"]").val(arr.slice(0, -1).join(" "));
			$("input[name=author_last_"+i+"]").val(arr[arr.length-1]);
		}
		i++;
		/*var firstname_arr = author1_arr.slice(0, -1);
		var author1_firstname = author1_firstname_arr.join(" ");
		var author1_lastname = author1_arr[author1_arr.length - 1];
		$("input[name=publisher]").val($(this).text());*/
	});
	$("#pleasewait").fadeOut("fast");
}

function exist(isbn, cb) {
	$.ajax({
		type: "GET",
		url: "/do/findobject/"+isbn,
		dataType: "json",
		success: cb
	});
}

function fetchISBN(isbn) {
	$("#pleasewait").text("Bitte warten...");
	$("#pleasewait").fadeIn("fast");
	$.ajax({
		type: "GET",
		url: "/do/fetch/isbn/"+isbn,
		dataType: "xml",
		success: processXML,
		error: function() {
			$("#pleasewait").text("Fehler");
			$("#pleasewait").delay(1000).fadeOut("fast");
			
		}
	});
}

function doadd(url, t) {
	$.post(url, t, function(data) {
		//alert(data.toSource());
		if(data.status == "error") {
			for(x in data.data.errors) {
				$("input[name="+x+"]").addClass("error");
			}
	
			window.top.status(data.data.message, "error");
			
				
		}
		else {
			//$("span.success").fadeIn(100).delay(1000).fadeOut();
			if(t._id) {
				window.top.status("Objekt wurde gespeichert", null);
				window.top.list();
				window.top.killPopup();
			}
			else {
				window.top.status("Objekt wurde hinzugefügt", null);
				if(preisbn != "") {
					window.top.process(t.isbn);
					window.top.focus();
					window.top.killPopup();
					
					
				}
			}
			$("form")[0].reset();
		}

	}, "json");
}

$(document).ready(function(){
	$("form").submit(function() {
		if($("input[name=isbn]").val().length == 10) {
			$("input[name=isbn]").val("978"+$("input[name=isbn]").val());
		}
		var t= {authors:[]};
		var a = $(this).serializeArray();
		var authors = 0;
		for(x in a) {
			if(a[x].name.slice(0, 6) != "author") {
				t[a[x].name.toString()] = a[x].value.toString();
			}
			else {
				authors++;
			}
			
		}
		authors /= 2;
		var i= 0;
		//alert("sent");
		while(i<authors) {
			t.authors.push({firstname: $("input[name=author_first_"+i+"]").val(), lastname:$("input[name=author_last_"+i+"]").val()});
			i++;
		}
		//alert(JSON.stringify($(this).serializeArray()));
		if($("input[name=title]").val() == "") {
			fetchISBN($("input[name=isbn]").val());
			return;
		}
		$("input[type=text]").removeClass("error");
		if(t._id) {
			var url = "/do/update/object";
		}
		else {
			var url = "/do/add/object";
		}
		exist($("input[name=isbn]").val(), function(docs) {
			if(docs) {
				if(docs.length == 0 || (editobject==true)) {
					doadd(url, t);
				}
				else {
					var c = window.confirm("Es gibt diese ISBN bereits, soll das Objekt dennoch hinzugefügt werden?")
					if(c) {
						doadd(url, t);
					}
				}
			}
			else {
				doadd(url, t);
			}
		});
		
	});
	$("#submit").click(function() {
		$("form").submit();
	});
	
	$("#reset").click(function() {
		$("form")[0].reset();
		$("input[name=isbn]").focus();
	});
	
	$("#generate").click(function() {
		generateCode("0815", function(code) {
			$("input[name=isbn]").val(code);
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
	$("input[name=isbn]").focus();
});
