basket = [];
pupil = null;
remain = 0;

function lendObject(id) {
	if(remain <= 0 && pupil) {
		status("Ausleihkontingent erschöpft", "error");
		return;
	}
	if($.inArray(id, basket) == -1) {
		basket.push(id);
		remain--;
		update();
		if(remain == 0) {
			processBasket();
			
		}
	}
	else {
		status("Dieses Objekt wird bereits ausgeliehen", "error");
	}
	
}

function processBasket() {
	if(remain < 0) {
		status("Ausleihkontingent erschöpft", "error");
		return;
	}
	if(basket.length > 0) {
		popup({
			width: 800,
			height: 600,
			src:"/lend/"+pupil._id+"/"+basket.join(",")+"?quick=true"
		});
		pupil = null;
		remain = 0;
		basket = [];
	}
	else {
		status("Es sind keine Objekte zum Ausleihen ausgewählt", "error");
	}
	window.setTimeout(update, 100);
}

function findpupil(field, val, cb) {
	$.ajax({
		type: "GET",
		url: "/do/findpupil/"+field+"/"+val,
		dataType: "json",
		success: function (data) {
			if(data.length != 0) {
				pupil = data[0];
				remain = data[0]._group.maxlend - data[0].lends;
				if(!remain) {
					status("Ausleihkontingent erschöpft", "error");
					update();
					return;
				}
				basket = basket.slice(0, remain);
				remain -= basket.length;
				if(remain == 0) {
					processBasket();
				}
				update();
			}
			else {
				cb(val);
			}
		}
	});
}

function update() {
	if(pupil) {
		$("#pupil").text(pupil.lastname + ", " + pupil.firstname+ " " + pupil.class+ "; "+ remain + " Objekt" + (remain!="1"?"e":"") + " verbleibend");
	}
	else {
		$("#pupil").text("");
	}
	$("#basket").empty();
	for(i in basket) {
		exist(basket[i], function(o) {
			var e = $(document.createElement("h2"));
			e.text(o[0].title);
			$("#basket").append(e);
		});
	}
}

function returnObject(id, s) {
	$.ajax({
		type: "GET",
		url: "/do/return/"+id,
		dataType: "json",
		success: function (data) {
			if(data.status != "ok") {
				if(data.data != "exp") {
					alert(data.toSource());
				}
			}
			else {
				if(s == 2) {
					status("Objekt war überfällig", "error");
				}
				else {
					status("Objekt wurde zurückgegeben", null);
				}
				rateObject(id);
			}
			
		}
	});
	
}

function processObject(id, s) {
	$("#select").empty();
	if(s > 0) {
		returnObject(id, s);
		
	}
	else {
		lendObject(id);
	}
}

function process(code) {
	if(code == "1337000000006") {
		processBasket();
		return;
	}
	
	if(code == "1337000000020") {
		pupil = null;
		remain = 0;
		basket = [];
		$("#select").empty();
		update();
		return;
	}
	if(code.length != 13) {
		findpupil("id", code, function() {});
	}
	else {
		findpupil("card", code,function(val) {
			exist(val, function(o) {
				if(o.length == 1) {
					processObject(o[0]._id, o[0].status);
				}
				else if(o.length == 0) {
					popup({
						width: 800,
						height: 600,
						src:"/objects/new/?isbn="+val
					});
				}
				else {
					$("#select").empty();
					for(i in o) {
						var a = $(document.createElement("a"));
						a.attr("href", "#");
						a.attr("id", o[i]._id+ "-" + o[i].status);
						a.text(o[i].title);
						a.click(function () {
							processObject($(this).attr("id").split("-")[0], $(this).attr("id").split("-")[1]);
							});
							
						$("#select").append(a).append($("<br/>"));
					}
				}
			});
			
		});
	}
}


$(document).ready(function(){
	$("form").submit(function() {
		process($("form>input").val());
		$("form>input").focus();
		$("form>input").val("");
	});
	$("form>input").focus();
	$("form>input").val("");
});

$(document).keydown(function(){
	$("form>input").focus();
})
