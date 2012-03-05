function sendresponse(s, res) {
	var o ={status: "", data:null};
	if(s == null) {
		o.status = "ok";
	}
	else {
		o.status = "error";
		o.data = s;
	}
	res.send(o);
}

exports.pack = function(req, res){
	if(!Auth.mayI("print barcodes", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Print.pack(function(e) {sendresponse(e, res)});
}

exports.reminds = function(req, res) {
	if(!Auth.mayI("print reminds", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Print.reminds(req.body.objects, function(e) {sendresponse(e, res)});
}

exports.allpupils = function(req, res) {
	if(!Auth.mayI("list pupils", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Print.pupilcards(null, function(e) {sendresponse(e, res)});
}
