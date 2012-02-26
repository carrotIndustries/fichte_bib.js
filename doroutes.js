
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

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};



exports.addobject= function(req, res) {
	console.log(req.body);
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
	Objects.list(req.body, function(data) {res.send(data)});
};

exports.deleteobject= function(req, res) {
	Objects.remove(req.params.id, function(err) {sendresponse(err, res)});
}


exports.updateobject= function(req, res) {
	console.log(req.body);
	
	Objects.update(req.body, function(err) {sendresponse(err, res)});
	
};

exports.addpupil= function(req, res) {
	Pupils.add(req.body, function(err) {sendresponse(err, res)});
};

exports.listpupils= function(req, res) {
	Pupils.list(req.body, function(data) {res.send(data)});
};

exports.deletepupil= function(req, res) {
	Pupils.remove(req.params.id, function(err) {sendresponse(err, res)});
}

exports.updatepupil= function(req, res) {
	console.log(req.body);
	
	Pupils.update(req.body, function(err) {sendresponse(err, res)});
	
};

exports.addgroup= function(req, res) {
	Groups.add(req.body, function(err) {sendresponse(err, res)});
};

exports.listgroups= function(req, res) {
	Groups.list(function(data) {res.send(data)});
};

exports.deletegroup= function(req, res) {
	Groups.remove(req.params.id, function(err) {sendresponse(err, res)});
}

exports.updategroup= function(req, res) {
	Groups.update(req.body, function(err) {sendresponse(err, res)});
	
};

exports.lend= function(req, res) {
	Lend.lend(req.body, function(err) {sendresponse(err, res)});
	
};

exports.returnobject= function(req, res) {
	Lend.returnobject(req.params.id, function(err) {sendresponse(err, res)});
	
};

exports.longerobject= function(req, res) {
	Lend.longerobject(req.params.id, req.param("days"), function(err) {sendresponse(err, res)});
	
};

exports.objectinfo= function(req, res) {
	Lend.getinfo(req.params.id, function(data) {res.send(data)});
};

exports.findobject= function(req, res) {
	Objects.find(req.params.val, function(data) {res.send(data)});
};

exports.findpupil= function(req, res) {
	Pupils.find(req.params.field, req.params.val,  function(data) {res.send(data)});
};

exports.updatemeta = function(req, res) {
	console.log(req.body);
	if(req.body.returndate.date) {
		req.body.returndate.date = new Date(parseInt(req.body.returndate.date));
	}
	if(req.body.reminds.fine) {
		req.body.reminds.fine = parseFloat(req.body.reminds.fine);
	}
	console.log(req.body);
	Meta.update(req.body, function(err) {sendresponse(err, res)});
};

exports.advancecounter = function(req, res) {
	Lend.advancecounter(req.body.objects, function(e) {sendresponse(e, res)});
}

exports.generateCode = function(req, res) {
	EAN13.generateCode(req.params.prefix, function(data) {
		res.send({code: data});
	});
}
