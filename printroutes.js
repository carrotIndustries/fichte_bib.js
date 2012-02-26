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
	Print.pack(function(e) {sendresponse(e, res)});
}

exports.reminds = function(req, res) {
	Print.reminds(req.body.objects, function(e) {sendresponse(e, res)});
}

exports.allpupils = function(req, res) {
	Print.pupilcards(null, function(e) {sendresponse(e, res)});
}
