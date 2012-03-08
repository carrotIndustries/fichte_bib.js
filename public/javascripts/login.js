$(document).ready(function(){
	$("#login").click(function() {
		$("form").submit();
	});
	$("form").keypress(function(event) {
		if(event.which == 13) {
			$("form").submit();
			event.preventDefault();
		}
		
	});	
})
