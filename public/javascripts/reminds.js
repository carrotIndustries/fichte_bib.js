basket = [];

function advancecounter(ids) {
	$.post('/do/advancecounter', {objects: ids}, function(data) {
		if(data.status == "ok") {
			status("Mahnungszähler wurde"+(ids.length>1?"n":"")+" erhöht");
		}
		else {
			status(data.data, "error");
		}
	});
}

function printreminds(ids) {
	$.post('/print/reminds', {objects: ids}, function(data) {
		if(data.status == "ok") {
			status("Wird gedruckt");
		}
		else {
			status(data.data, "error");
		}
	});
	modal({
		width: 400,
		height: 150,
		text:(basket.length>1?"Sollen die":"Soll der")+" Mahnungszähler erhöht werden?",
		buttons:[
			{
				text:"Abbrechen",
			},
			{
				text:"Erhöhen",
				id: "yes",
			}
		],
		cb: function(z) {
			if(z=="yes") {
				advancecounter(ids);
				location.reload();
			}
		}
	});
}

function printall() {
	basket = [];
	$(".object").each(function(z) {
		basket.push($(this).attr("id"));
	});
	if(basket.length == 0) {
		status("Es gibt keine Mahnungen.", "error");
		return;
	}
	//alert(basket);
	printreminds(basket);
	basket = [];
}

function selectremind() {
	var id = $(this).parent().attr("id");
	if($.inArray(id, basket) == -1) {
		basket.push(id);
		$(this).parent().css("color", "#ff6600");
	}
	else {
		status("Diese Mahnung ist bereits ausgewählt", "error");
	}
}

function printselected() {
	if(basket.length == 0) {
		status("Keine Mahnungen zum Drucken ausgewählt", "error");
		return;
	}
	//alert(basket);
	
	printreminds(basket);
	basket = [];
	$(".object").css("color", "");
}

$(document).ready(function() {
	$("#printall").click(printall);
	$("#print").click(printselected);
	$(".action").click(selectremind);
});
