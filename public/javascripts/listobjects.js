ObjectColumns = [
	{field: "location", name:"Ort"},
	{field: "media", name:"Medium"},
	{field: "authors[0].lastname", name:"1. Autor (Nachname)"},
	{field: "authors[0].firstname", name:" 1. Autor (Vorname)"},
	{field: "authors[1].lastname", name:"2. Autor (Nachname)"},
	{field: "authors[1].firstname", name:" 2. Autor (Vorname)"},
	{field: "title", name:"Titel"},
	{field: "isbn", name:"ISBN"},
	{field: "rating", name:"Bewertung"},
	{field: "publisher", name:"Verlag"},
	{field: "year", name:"Erscheinungsjahr"},
	{field: "edition", name:"Auflage"},
	{field: "genre", name:"Genre"}
];

function updateremain(n) {
	$("#remain").text(n+ " Objekt" + (n!=1?"e":"") + " verbleibend");
}
busy = false;
basket = new Array();
function lendObject() {
	if(!remain) {
		status("Ausleihkontingent erschöpft", "error");
		return;
	}
	var id = $(this).parent().parent().attr("id");
	if(!id) {
		id = $(this).attr("id");
	}
	if($.inArray(id, basket) == -1) {
		if($(this).parent().parent().attr("id")) {
			$(this).parent().parent().css("color", "#ff6600");
		}
		else {
			$(this).css("color", "#ff6600");
		}
		basket.push(id);
		remain--;
		updateremain(remain);
		if(remain == 0) {
			processBasket();
		}
	}
	else {
		status("Dieses Objekt wird bereits ausgeliehen", "error");
	}
	
}

function processBasket() {
	if(basket.length > 0) {
		
		popup({
			width: 800,
			height: 600,
			src:"/lend/"+lend+"/"+basket.join(",")
		});
	}
	else {
		status("Es sind keine Objekte zum Ausleihen ausgewählt", "error");
	}
}

function editObject() {
	var id = $(this).parent().parent().attr("id");
	popup({
		width: 800,
		height: 600,
		src:"/objects/edit/"+id
	});
}

function viewObject() {
	var id = $(this).parent().parent().attr("id");
	if(!id) {
		id = $(this).attr("id");
	}
	popup({
		width: 800,
		height: 600,
		src:"/objects/"+id
	});
}

function deleteObject() {
	var id = $(this).parent().parent().attr("id");
	modal({
		width: 300,
		height: 150,
		text:"Soll das Objekt gelöscht werden?",
		img: "trash-large",
		buttons:[
			{
				text:"Abbrechen",
			},
			{
				text:"Löschen",
				css: [
					["color", "red"]
				],
				id: "del"
			}
		],
		cb: function(z) {
			if(z=="del") {
				$.ajax({
					type: "GET",
					url: "/do/delete/object/"+id,
					dataType: "json",
					success: function (data) {
						if(data.status != "ok") {
							status(data.data, "error");
						}
						else {
							status("Objekt wurde gelöscht", null);
						}
						list();
					}
				});
			}
		}
	});

	
	
}

function infoObject() {
	var id = $(this).parent().parent().attr("id");
	$.ajax({
		type: "GET",
		url: "/do/info/"+id,
		dataType: "json",
		success: function (data) {
			if(data.data != "denied") {
				status(data._pupil.lastname+ ","+ data._pupil.firstname+ " "+data._pupil.class+"<br>Fällig am "+data.expiredate, null);
			}
			else {
				status(data.data, "error");
			}
		}
	});
	
}


function longerObject() {
	var id = $(this).parent().parent().attr("id");
	var n = parseInt(window.prompt("Um wie viele Tage soll das Objekt verlängert werden?"));
	if(!n) {
		return;
	}
	$.ajax({
		type: "GET",
		url: "/do/longer/"+id+"?days="+n,
		dataType: "json",
		success: function (data) {
			if(data.status != "ok") {
				status(data.data, "error");
			}
			else {
				status("Objekt wurde um "+n+" Tag"+((n!=1)?"e":"")+" verlängert", null);
			}
			list();
		}
	});
	
}

function returnObject() {
	var id = $(this).parent().parent().attr("id");
	$.ajax({
		type: "GET",
		url: "/do/return/"+id,
		dataType: "json",
		success: function (data) {
			if(data.status != "ok") {
				if(data.data != "exp") {
					status(data.data, "error");
				}
				else {
					status("Objekt war überfällig", "error");
					rateObject(id, function() {list()});
				}
			}
			else {
				status("Objekt wurde zurückgegeben", null);
				rateObject(id, function() {list()});
			}
			
			list();
		}
	});
	
}

lastsearch = null;
function update(t) {
	if(busy==true) {
		console.log("cancld");
		return;
	}
	busy = true;
	showThrobber();
	var c = $("#content");
	console.log("update");
	$.post('/do/list/objects', t, function(data) {
		
		//alert(data[0]["authors"].toSource());
		for(row in data) {
			var tr = $(document.createElement("tr"));
			for( col in ObjectColumns) {
				var td = $(document.createElement("td"));
				if(ObjectColumns[col].field.slice(0,6) != "author") {
					if(ObjectColumns[col].field != "rating") {
						td.text(data[row][ObjectColumns[col].field]);
					}
					else {
						var rating = calcAvg(data[row][ObjectColumns[col].field]);
						renderRating(rating, td);
						td.css("padding-bottom", "5px");
						
					}
					
				}
				else {
					if(data[row]["authors"][ObjectColumns[col].field.slice(8,9)]) {
						td.text(data[row]["authors"][ObjectColumns[col].field.slice(8,9)][ObjectColumns[col].field.slice(11)]);
					}
				}
				if($.inArray(ObjectColumns[col].field,meta.visibleobjectcolumns) != -1) {
					tr.append(td);
				}
			}
			tr.attr("id", data[row]._id);
			//alert(data[row].lend.length);
			if(data[row].status == 1) {
				tr.css("color", "red");
			}
			if(data[row].status == 2) {
				tr.css("color", "#ff00ff");
			}
			var td = $(document.createElement("td"));

			td.addClass("actiontd");
			td.append(actionIcon({
				img: "/gfx/trash.png",
				title: "Löschen",
				fn: deleteObject
			}));
			
			td.append(actionIcon({
				img: "/gfx/edit.png",
				title: "Bearbeiten",
				fn: editObject
			}));
			
			td.append(actionIcon({
				img: "/gfx/page.png",
				title: "Karteikarte",
				fn: viewObject
			}));
			//td.append($(document.createElement("br")));
			if(data[row].status > 0) {
				td.append(actionIcon({
					img: "/gfx/return.png",
					title: "Zurückgeben",
					fn: returnObject
				}));
				td.append(actionIcon({
					img: "/gfx/longer.png",
					title: "Verlängern",
					fn: longerObject
				}));
				td.append(actionIcon({
					img: "/gfx/info.png",
					title: "Info",
					fn: infoObject
				}));
			}
			if(typeof(lend) == "string" && data[row].status==0) {
				td.append(actionIcon({
					img: "/gfx/lend.png",
					title: "Ausleihen",
					fn: lendObject
				}));
				tr.dblclick(lendObject);
				
			}
			else {
				tr.dblclick(viewObject);
			}
			tr.append(td);
			c.append(tr);
		}
		
		$(".list>tbody>tr:odd").addClass("odd");
		busy=false;
		console.log("done");
		hideThrobber();
		c.show("fast");
		if(($(document).height() - $(window).height() == 0) && data.length>0) {
			lastsearch.skip += parseInt(lastsearch.limit);
			console.log(lastsearch.skip);
			update(lastsearch);
		}
	}, "json");
}

function list() {
	
	var c = $("#content");
	c.hide("fast").empty();
	//var columns = ["authors", "title", "isbn", "publisher", "year", "edition", "genre"];
	var t= {media:[]};
	var a = $("form").serializeArray();
	
	for(x in a) {
		if(a[x].name.slice(0,5) != "media") {
			t[a[x].name] = a[x].value;
		}
		else {
			if(a[x].value == "on") {
				t.media.push(a[x].name.slice(6));
			}
		}
	}
	t.skip = 0;
	t.limit=50;
	lastsearch = t;
	//alert(c);
	//alert(t.toSource());
	console.log("list");
	//while($(document).height() - $(window).height() == 0) {
		update(t);
	//}
}



$(document).ready(function(){
	$("form").submit(list);
	$("form").change(list);
	//$("form").keyup(list);
	
	$(window).scroll(function(){
		if ($(window).scrollTop() == $(document).height() - $(window).height()){
			loadmore();
		}
	});
	$("#loadmore").click(loadmore);
	
	$("#submit").click(function() {
		$("form").submit();
	});
	
	$("#reset").click(function() {
		$("form")[0].reset();
		$("input[name=search]").focus();
		list();
	});
	$("#cancel").click(function() {
		location.href = "/objects"
	});
	$("#lend").click(function() {
		processBasket();
	});
	$(".sorter").click(function() {
		var id = $(this).attr("id");
		id = id.replace("[0]", "").replace("[1]", "");
		//$("select[name=sort_by]").val(id);
		
		if($("select[name=sort_by]").val() == id) {
			if($("select[name=sort_dir]").val() == 1) {
				$("select[name=sort_dir]").val(-1)
			}
			else {
				$("select[name=sort_dir]").val(1)
			}
		}
		else {
			$("select[name=sort_by]").val(id)
			$("select[name=sort_dir]").val(1)
		}
		list();
	});
	if(typeof(lend) == "string") {
		updateremain(remain);
	}
	$("form>input[name=search]").focus();
	hideThrobber();
	list();

	
});

$(document).keydown(function(){
	if(!$("form>input[name=search]").is(":focus")) {
		$("form>input[name=search]").val("");
		$("form>input[name=search]").focus();
	}
});
