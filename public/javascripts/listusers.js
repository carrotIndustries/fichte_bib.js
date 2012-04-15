permissions= [
	{id:"admin", name:"Administrator (darf alles)"},
	{id:"list objects", name:"Objekte anzeigen"},
	{id:"delete objects", name:"Objekte löschen"},
	{id:"edit objects", name:"Objekte bearbeiten"},
	{id:"view objects", name:"Objekt-Karteikarte anzeigen"},
	{id:"return", name:"Zurückgeben"},
	{id:"longer", name:"Verlängern"},
	{id:"lend", name:"Ausleihen"},
	{id:"info objects", name:"Ausleihinfo anzeigen"},
	{id:"add objects", name:"Objekte hinzufügen"},
	{id:"add pupils", name:"Schüler hinzufügen"},
	{id:"list pupils", name:"Schüler anzeigen"},
	{id:"delete pupils", name:"Schüler löschen"},
	{id:"edit pupils", name:"Schüler bearbeiten"},
	{id:"view pupils", name:"Schüler-Karteikarte anzeigen"},
	{id:"view reminds", name:"Mahnungen anzeigen"},
	{id:"print reminds", name:"Mahnungen ausdrucken"},
	{id:"view settings", name:"Einstellungen anzeigen"},
	{id:"save settings", name:"Einstellungen speichern"},
	{id:"list groups", name:"Gruppen anzeigen"},
	{id:"delete groups", name:"Gruppen löschen"},
	{id:"edit groups", name:"Gruppen bearbeiten"},
	{id:"add groups", name:"Gruppen hinzufügen"},
	{id:"print barcodes", name:"Barcodes ausleihen"},
	{id:"view index", name:"Übersicht anzeigen"},
	{id:"use quick", name:"Quickmodus verwenden"},
];

UserColumns = [
	{field: "login", name:"Login"},
	{field: "permissions", name:"Berechtigungen"}
];


function deleteUser() {
	var id = $(this).parent().parent().attr("id");
	modal({
		width: 300,
		height: 150,
		text:"Soll der Benutzer gelöscht werden?",
		img:"trash-large",
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
					url: "/do/delete/user/"+id,
					dataType: "json",
					success: function (data) {
						if(data.status != "ok") {
							status(data.data, "error");
						}
						else {
							status("Benutzer wurde gelöscht", null);
						}
						list();
					}
				});
			}
		}
	});
	
}

function editUser() {
	var id = $(this).parent().parent().attr("id");
	popup({
		width: 550,
		height: 700,
		src:"/users/edit/"+id
	});
}

function list() {
	var c = $("#content");
	c.hide("fast").empty();
	var t= {};

	//alert(c);
	//alert(t.toSource());
	$.post('/do/list/users', null, function(data) {
			c.show("fast");
			//alert(data[0]["authors"].toSource());
			for(row in data) {
				//c.append($("<tr />"));
				var tr = $(document.createElement("tr"));
				for( col in UserColumns) {
					var td = $(document.createElement("td"));
					if(UserColumns[col].field == "permissions") {
						td.text(data[row][UserColumns[col].field].join(","));
					}
					else {
						td.text(data[row][UserColumns[col].field]);
						
					}
					tr.append(td);
				}
				var td = $(document.createElement("td"));
				tr.attr("id", data[row]._id);
				
				td.append(actionIcon({
					img: "/gfx/trash.png",
					title: "Löschen",
					fn: deleteUser
				}));
				
				td.append(actionIcon({
					img: "/gfx/edit.png",
					title: "Bearbeiten",
					fn: editUser
				}));
				
				tr.append(td);
				c.append(tr);
				$(".list>tbody>tr:odd").addClass("odd");
				
			}

		}, "json");
}


$(document).ready(function(){
	$("form").submit(function() {
		var t= {};
		var a = $(this).serializeArray();
		for(x in a) {
			t[a[x].name] = a[x].value;
		}
		$("input[type=text]").removeClass("error");
		//alert(t.toSource());
		
		$.post("/do/add/group", t, function(data) {
			//alert(data.toSource());
			if(data.status == "error") {
				
				for(x in data.data.errors) {
					$("input[name="+x+"]").addClass("error");
				}
				status(data.data, "error");
			}			
			else {
				//$("span.success").fadeIn(100).delay(1000).fadeOut();
				status("Gruppe wurde hinzugefügt", null);
				$("form")[0].reset();
				list();
			}

		}, "json");
		
	});
	$("#add").click(function() {
		$("form").submit();
	});
	
	
	$("form").keypress(function(event) {
		if(event.which == 13) {
			$("form").submit();
			event.preventDefault();
		}
		
	});
	list();

});
