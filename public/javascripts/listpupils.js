PupilColumns = [
	{field: "lastname", name:"Nachname"},
	{field: "firstname", name:"Vorname"},
	{field: "class", name:"Klasse"},
	{field: "card", name:"Kartennummer"},
	{field: "_group.name", name:"Gruppe"},
	{field: "id", name:"ID"},
];

function editPupil() {
	var id = $(this).parent().parent().attr("id");
	popup({
		width: 550,
		height: 350,
		src:"/pupils/edit/"+id
	});
}

function doLend() {
	var id = $(this).parent().parent().attr("id");
	if(!id) {
		id = $(this).attr("id");
	}
	location.href = "/objects/lend/"+id;
}

function viewPupil() {
	var id = $(this).parent().parent().attr("id");
	popup({
		width: 1000,
		height: 600,
		src:"/pupils/"+id
	});
}


function deletePupil() {
	var id = $(this).parent().parent().attr("id");
	var c = window.confirm("Soll der Schüler gelöscht werden?");
	if(!c) {
		return;
	}
	$.ajax({
		type: "GET",
		url: "/do/delete/pupil/"+id,
		dataType: "json",
		success: function (data) {
			if(data.status != "ok") {
				alert(data.toSource());
			}
			else {
				status("Schüler wurde gelöscht", null);
			}
			list();
		}
	});
	
}

function actionIcon(params) {
	var img = $(document.createElement("img"));
	img.addClass("action");
	img.attr("src", params.img);
	img.attr("title", params.title);
	img.click(params.fn);
	return img;
}

function list() {
	var c = $("#content");
	c.hide("fast").empty();
	var t= {};
	var a = $("form").serializeArray();
	
	for(x in a) {
		t[a[x].name] = a[x].value;
	}
	//alert(c);
	//alert(t.toSource());
	$.post('/do/list/pupils', t, function(data) {
			c.show("fast");
			//alert(data[0]["authors"].toSource());
			for(row in data) {
				
				//c.append($("<tr />"));
				var tr = $(document.createElement("tr"));
				for( col in PupilColumns) {
					var td = $(document.createElement("td"));
					//alert(col);
					if(PupilColumns[col].field == "_group.name") {
						td.text(data[row]._group.name);
					}
					else {
						td.text(data[row][PupilColumns[col].field]);
					}
					tr.append(td);
				}
				var td = $(document.createElement("td"));
				tr.attr("id", data[row]._id);
				
				td.append(actionIcon({
					img: "/gfx/trash.png",
					title: "Löschen",
					fn: deletePupil
				}));
				
				td.append(actionIcon({
					img: "/gfx/edit.png",
					title: "Bearbeiten",
					fn: editPupil
				}));
				
				td.append(actionIcon({
					img: "/gfx/page.png",
					title: "Karteikarte",
					fn: viewPupil
				}));
				
				if(data[row].lends < data[row]._group.maxlend) {
					td.append(actionIcon({
						img: "/gfx/lend.png",
						title: "Ausleihen",
						fn: doLend
					}));
					tr.dblclick(doLend);
				}
				
				tr.append(td);
				c.append(tr);
				$(".list>tbody>tr:odd").addClass("odd");
				
			}

		}, "json");
}


$(document).ready(function(){
	
	
	$("form").submit(function() {
		list();
		//$("div.status").text("asdf").fadeIn("fast").delay(1000).fadeOut("fast");
		
		//$("div.status").delay(1000).fadeOut();
	});

	$("#submit").click(function() {
		$("form").submit();
	});
	
	$("#reset").click(function() {
		$("form")[0].reset();
		list();
	});
	list();
	$("form>input[name=search]").focus();
	/*$("form").keypress(function() {
		$("form").submit();
	});*/
	/*modal({
		width: 300,
		height: 150,
		text:"Soll das Objekt gelöscht werden?",
		buttons:[
			{
				text:"Abbrechen"
			},
			{
				text:"Löschen",
				css: [
					["color", "red"]
				],
				fn: function() {
					alert("ack");
				}
			}
		]
		});*/
});

$(document).keydown(function(){
	if(!$("form>input[name=search]").is(":focus")) {
		$("form>input[name=search]").val("");
		$("form>input[name=search]").focus();
	}
});
