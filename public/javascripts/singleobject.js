$(document).ready(function(){
	$(".list>tbody>tr:odd").addClass("odd");
	$("#close").click(function() {
		window.top.killPopup();
	});
	$(".action").click(returnObject);
})

function returnObject() {
	var id = $(this).parent().parent().attr("id");
	$.ajax({
		type: "GET",
		url: "/do/return/"+id,
		dataType: "json",
		success: function (data) {
			if(data.status != "ok") {
				if(data.data != "exp") {
					alert(data.toSource());
				}
				else {
					window.top.status("Objekt war überfällig", "error");
				}
			}
			else {
				window.top.status("Objekt wurde zurückgegeben", null);
				
			}
			location.reload();
			window.top.list();
		}
	});
	
}

