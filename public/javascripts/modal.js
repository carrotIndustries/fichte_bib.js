function showWhiteout() {
	var ovl = $(document.createElement("div"));
	ovl.addClass("over");
	$("body").append(ovl);
}
	
function hideWhiteout() {
	$(".over").fadeOut().remove();
}

function modal(params) {
	showWhiteout();
	var m = $(document.createElement("div"));
	m.addClass("modal");
	m.css("width", params.width);
	m.css("height", params.height);
	m.css("left",parseInt(window.innerWidth)/2-params.width/2);
	m.css("top",parseInt(window.innerHeight)/2-params.height/2);
	var text = $(document.createElement("div"));
	text.addClass("modalText");
	text.text(params.text);
	m.append(text);
	
	var buttons = $(document.createElement("div"));
	buttons.addClass("modalButtons");
	m.append(buttons);
	for(button in params.buttons) {
		var b = $(document.createElement("span"));
		b.attr("id", "modal_"+params.buttons[button].id);
		b.addClass("button");
		b.css("margin-right", 10);
		b.css("margin-left", 10);
		if(params.buttons[button].css) {
			for(key in params.buttons[button].css) {
				b.css(params.buttons[button].css[key][0], params.buttons[button].css[key][1]);
			}
		}
		
		b.text(params.buttons[button].text);
		
		b.click(function() {
			killModal();
			if(params.cb) {
				params.cb($(this).attr("id").replace("modal_", ""));
			}
		});
		
		buttons.append(b);
		b=null;
	}
		
	
	$("body").append(m);
	
}

function killModal() {
	$(".modal").remove();
	hideWhiteout();
}

function popup(params) {
	showWhiteout();
	var p = $(document.createElement("iframe"));
	p.addClass("popup");
	p.css("width", params.width);
	p.css("height", params.height);
	p.css("left",parseInt(window.innerWidth)/2-params.width/2);
	p.css("top",parseInt(window.innerHeight)/2-params.height/2);
	p.attr("src", params.src);
	$("body").append(p);
}

function killPopup() {
	$(".popup").remove();
	hideWhiteout();
}
