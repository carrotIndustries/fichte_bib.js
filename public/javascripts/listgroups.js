GroupColumns = [
	{field: "name", name:"Name"},
	{field: "maxlend", name:"Max. auszuleihende Obj."},
	{field: "duration", name:"Max. Ausleihdauer"},
];


function deleteGroup() {
	var id = $(this).parent().parent().attr("id");
	modal({
		width: 300,
		height: 150,
		text:"Soll die Gruppe gelöscht werden?",
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
					url: "/do/delete/group/"+id,
					dataType: "json",
					success: function (data) {
						if(data.status != "ok") {
							status(data.data, "error");
						}
						else {
							status("Gruppe wurde gelöscht", null);
						}
						list();
					}
				});
			}
		}
	});
	
	
}

function editGroup() {
	var id = $(this).parent().parent().attr("id");
	popup({
		width: 550,
		height: 300,
		src:"/groups/edit/"+id
	});
}

function list() {
	var c = $("#content");
	c.hide("fast").empty();
	var t= {};

	//alert(c);
	//alert(t.toSource());
	$.post('/do/list/groups', null, function(data) {
			c.show("fast");
			//alert(data[0]["authors"].toSource());
			for(row in data) {
				//c.append($("<tr />"));
				var tr = $(document.createElement("tr"));
				for( col in GroupColumns) {
					var td = $(document.createElement("td"));
					td.text(data[row][GroupColumns[col].field]);
					tr.append(td);
				}
				var td = $(document.createElement("td"));
				tr.attr("id", data[row]._id);
				if(data[row].default) {
					tr.css("font-weight", "bold");
				}
				td.append(actionIcon({
					img: "/gfx/trash.png",
					title: "Löschen",
					fn: deleteGroup
				}));
				
				td.append(actionIcon({
					img: "/gfx/edit.png",
					title: "Bearbeiten",
					fn: editGroup
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
				status(data.data.message, "error");
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
