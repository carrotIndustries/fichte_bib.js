
/*
 * GET home page.
 */

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


exports.addobject= function(req, res) {
	if(!Auth.mayI("add objects", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Objects.add(req.body, function(err) {sendresponse(err, res)});
};

exports.fetchisbn= function(req, res) {
	console.log(req.params.isbn);
	request({uri: "http://books.google.com/books/feeds/volumes?q="+req.params.isbn}, function (error, response, body) {
		if(!error) {
	      //res.send({status: "ok", data:body});
	      res.send(body);
	  }
	  else {
		  res.send({status:"error" , data:null});
		 }
	      
	    });
};

exports.listobjects= function(req, res) {
	if(!Auth.mayI("list objects", req.user)) {
		res.send([]);
		return;
	}
	Objects.list(req.body, function(data) {res.send(data)});
};

exports.deleteobject= function(req, res) {
	if(!Auth.mayI("delete objects", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Objects.remove(req.params.id, function(err) {sendresponse(err, res)});
}


exports.updateobject= function(req, res) {
	if(!Auth.mayI("edit objects", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Objects.update(req.body, function(err) {sendresponse(err, res)});
	
};

exports.addpupil= function(req, res) {
	if(!Auth.mayI("add pupils", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Pupils.add(req.body, function(err) {sendresponse(err, res)});
};

exports.listpupils= function(req, res) {
	if(!Auth.mayI("list pupils", req.user)) {
		res.send([]);
		return;
	}
	Pupils.list(req.body, function(data) {res.send(data)});
};

exports.deletepupil= function(req, res) {
	if(!Auth.mayI("delete pupils", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Pupils.remove(req.params.id, function(err) {sendresponse(err, res)});
}

exports.updatepupil= function(req, res) {
	if(!Auth.mayI("edit pupils", req.user)) {
		sendresponse("denied", res);
		return;
	}	
	Pupils.update(req.body, function(err) {sendresponse(err, res)});
	
};

exports.addgroup= function(req, res) {
	if(!Auth.mayI("add groups", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Groups.add(req.body, function(err) {sendresponse(err, res)});
};

exports.listgroups= function(req, res) {
	if(!Auth.mayI("list groups", req.user)) {
		res.send([]);
		return;
	}
	Groups.list(function(data) {res.send(data)});
};

exports.deletegroup= function(req, res) {
	if(!Auth.mayI("delete groups", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Groups.remove(req.params.id, function(err) {sendresponse(err, res)});
}

exports.updategroup= function(req, res) {
	if(!Auth.mayI("edit groups", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Groups.update(req.body, function(err) {sendresponse(err, res)});
	
};

exports.lend= function(req, res) {
	if(!Auth.mayI("lend", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Lend.lend(req.body, function(err) {sendresponse(err, res)});
	
};

exports.returnobject= function(req, res) {
	if(!Auth.mayI("return", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Lend.returnobject(req.params.id, function(err) {sendresponse(err, res)});
	
};

exports.longerobject= function(req, res) {
	if(!Auth.mayI("longer", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Lend.longerobject(req.params.id, req.param("days"), function(err) {sendresponse(err, res)});
	
};

exports.objectinfo= function(req, res) {
	if(!Auth.mayI("info objects", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Lend.getinfo(req.params.id, function(data) {res.send(data)});
};

exports.findobject= function(req, res) {
	if(!Auth.mayI("list objects", req.user)) {
		res.send([]);
		return;
	}
	Objects.find(req.params.val, function(data) {res.send(data)});
};

exports.findpupil= function(req, res) {
	if(!Auth.mayI("list pupils", req.user)) {
		res.send([]);
		return;
	}
	Pupils.find(req.params.field, req.params.val,  function(data) {res.send(data)});
};

exports.updatemeta = function(req, res) {
	if(!Auth.mayI("save settings", req.user)) {
		sendresponse("denied", res);
		return;
	}
	if(req.body.returndate.date) {
		req.body.returndate.date = new Date(parseInt(req.body.returndate.date));
	}
	if(req.body.reminds.fine) {
		req.body.reminds.fine = parseFloat(req.body.reminds.fine);
	}
	Meta.update(req.body, function(err) {sendresponse(err, res)});
};

exports.advancecounter = function(req, res) {
	if(!Auth.mayI("print reminds", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Lend.advancecounter(req.body.objects, function(e) {sendresponse(e, res)});
}


exports.listusers= function(req, res) {
	if(!Auth.mayI("admin", req.user)) {
		res.send([]);
		return;
	}
	Auth.list(function(data) {res.send(data)});
};

exports.updateeuser= function(req, res) {
	if(!Auth.mayI("admin", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Auth.update(req.body, function(err) {sendresponse(err, res)});
	
};

exports.deleteuser= function(req, res) {
	if(!Auth.mayI("admin", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Auth.remove(req.params.id, function(err) {sendresponse(err, res)});
}

exports.rate= function(req,res) {
	if(!Auth.mayI("return", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Objects.rate(req.params.id, req.params.rate, function(err) {sendresponse(err, res)});
}

exports.generateCode = function(req, res) {
	EAN13.generateCode(req.params.prefix, function(data) {
		res.send({code: data});
	});
}

exports.updateclasses = function(req, res) {
	if(!Auth.mayI("admin", req.user)) {
		sendresponse("denied", res);
		return;
	}
	Pupils.updateclasses(req.body, function(err) {sendresponse(err, res)});
}
