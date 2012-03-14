
function actionIcon(params) {
	var img = $(document.createElement("img"));
	img.addClass("action");
	img.attr("src", params.img);
	img.attr("title", params.title);
	img.click(params.fn);
	return img;
}

function showThrobber() {
	$(".hourglass").fadeIn("fast");
}


function hideThrobber() {
	$(".hourglass").fadeOut("fast");
}

function loadmore() {
	lastsearch.skip += parseInt(lastsearch.limit);
	update(lastsearch);
}
