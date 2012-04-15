function rateObject(id, cb) {
	exist(id, function(x) {
		rateModal({text: x[0].title, cb: function(rating) {
			if(rating==-1) {
				return;
			}
			$.ajax({
				type: "GET",
				url: "/do/rate/"+id+"/"+rating,
				dataType: "json",
				success: function (data) {
					if(data.status == "ok") {
						status("Vielen Danke für deine Bewertung", null);
					}
					else {
						status(data.data, error);
					}
					if(cb) {
						cb();
					}
				}
			});
		}});
	});
}

function calcAvg(rates) {
	var total = 0;
	var avg = 0;
	for(i in rates) {
		total += parseInt(rates[i]);
		avg += parseInt(rates[i])*(parseInt(i)+1);
	}
	
	avg /= total;
	return isNaN(avg)?0:avg;
}

function renderRating(rating, parent) {
	var raters = $(document.createElement("span"));
	var i = 0;
	while(i<5) {
		var star = $(document.createElement("img"));
		star.css("margin-bottom", "-5px");
		if(i<=Math.floor(rating)) {
			star.attr("src", "/gfx/star.png");
		}
		else {
			star.attr("src", "/gfx/star-hollow.png");
		}
		if(i==Math.floor(rating)) {
			if(rating-Math.floor(rating) != 0) {
				star.css("opacity", rating-Math.floor(rating));
			}
			else {
				star.attr("src", "/gfx/star-hollow.png");
			}
		}
		raters.append(star);
		i++;
	}
	parent.append(raters);
}
