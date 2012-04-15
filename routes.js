
/*
 * GET home page.
 */



exports.index = function(req, res){
	if(!Auth.mayI("view index", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	Models.LendModel.where("returndate", null).lt("expiredate", new Date().setHours(3)).count(function(err, expired) {
		Models.LendModel.where("returndate", null).count(function(err, lends) {
			Models.PupilModel.where("deleted", false).count(function(err, pupils) {
				Models.ObjectModel.where("deleted", false).count(function(err, objects) {
					res.render('index',{
						title: 'Übersicht',
						scripts : ["jquery.js"],
						objects: objects,
						pupils: pupils,
						lends: lends,
						expired: expired
					});
				});
			});
		});
	});
};

exports.addobject = function(req, res){
	if(!Auth.mayI("add objects", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	Models.ObjectModel.where("deleted", false).distinct("media", function (err, media) {
		Models.ObjectModel.where("deleted", false).distinct("location", function (err, locations) {
			res.render('addobject',{
				title: 'Objekt hinzufügen',
				scripts: ["jquery.js", "addobject.js", "status.js", "ean13.js", "modal.js"],
				locations: locations,
				medias: media,
				init: {authors:[{},{}], isbn:req.param("isbn")},
				isbn: req.param("isbn")
			})
		});
	});
};

exports.listobjects = function(req, res){
	if(!Auth.mayI("list objects", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	Meta.get(function(m) {
		Models.LendModel.where("_pupil", req.params.id).where("returndate", null).count(function(z, n) {
			Models.PupilModel.where("_id", req.params.id).populate("_group").run(function (err, lend) {
				Models.ObjectModel.where("deleted", false).distinct("media", function (err, media) {
					Models.ObjectModel.where("deleted", false).distinct("location", function (err, locations) {
						res.render(
							'listobjects',
							{
								title: 'Objekte anzeigen',
								scripts: ["jquery.js", "listobjects.js", "modal.js", "status.js", "rate.js"],
								fields:Models.ObjectFields,
								lastsearch: m._doc.object_lastsearch,
								meta: m._doc,
								columns:Models.ObjectColumns,
								limits:Models.Limits,
								locations: locations,
								medias: media,
								lend: lend[0],
								remain: lend[0]?lend[0]._group.maxlend-n:0
						});
					});
				});
			});
		});
	});
  //res.send("tbd");
};

exports.editobject = function(req, res){
	if(!Auth.mayI("edit objects", req.user)) {
		Auth.renderDenied(false, res);
		return false;
	}
	Models.ObjectModel.where("_id", req.params.id).run(function (err,docs) {
		console.log(docs);
		if(!docs || docs.length == 0) {
			res.send("Not found");
			return false;
		}
		Models.ObjectModel.where().distinct("media", function (err, media) {
			Models.ObjectModel.where().distinct("location", function (err, locations) {
				res.render('editobject',{
					title: 'Objekt bearbeiten',
					scripts: ["jquery.js", "addobject.js", "status.js", "ean13.js"],
					locations: locations,
					medias: media,
					init: docs[0]
				});
			});
		});
	});
};

exports.singleobject = function(req, res) {
	if(!Auth.mayI("view objects", req.user)) {
		Auth.renderDenied(false, res);
		return false;
	}
	var id = req.params.id;
	Models.LendModel.where("_object", req.params.id).sort("lenddate", "ascending").populate("_pupil").run(function (err,lends) {
		console.log(err);
		Models.ObjectModel.where("_id", req.params.id).run(function (err,docs) {
			res.render('singleobject',{
				title: 'Objekt',
				scripts: ["jquery.js", "singleobject.js"],
				object: docs[0],
				lends: lends
			});
		});
	});
}

exports.addpupil = function(req, res){
	if(!Auth.mayI("add pupils", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	Meta.get(function(m) {
		Models.GroupModel.where().run(function (err, groups) {
			EAN13.generateCode(4711, function(code) {
				res.render('addpupil',{
					title: 'Schüler hinzufügen',
					scripts: ["jquery.js", "addpupil.js", "status.js", "ean13.js"],
					init: {card: code, _group:m._doc.defaultgroup},
					groups: groups,
				});
			});
		});
	});
};

exports.listpupils = function(req, res){
	if(!Auth.mayI("list pupils", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	Meta.get(function(m) {
		Models.GroupModel.where().run(function (err, groups) {
			res.render(
				'listpupils',
				{
					title: 'Schüler anzeigen',
					scripts: ["jquery.js", "listpupils.js", "modal.js", "status.js"],
					fields:Models.PupilFields,
					lastsearch:m._doc.pupil_lastsearch,
					columns:Models.PupilColumns,
					limits:Models.Limits,
					groups: groups
			});
		});
	});
  //res.send("tbd");
};

exports.editpupil = function(req, res){
	if(!Auth.mayI("edit pupils", req.user)) {
		Auth.renderDenied(false, res);
		return false;
	}
	Models.GroupModel.where().run(function (err, groups) {
		Models.PupilModel.where("_id", req.params.id).run(function (err,docs) {
			console.log(docs);
			if(!docs || docs.length == 0) {
				res.send("Not foundp");
				return false;
			}
			
			res.render('editpupil',{
				title: 'Schüler bearbeiten',
				scripts: ["jquery.js", "addpupil.js", "status.js", "ean13.js"],
				init: docs[0],
				groups: groups
			});
			
		});
	});
};

exports.singlepupil = function(req, res) {
	if(!Auth.mayI("view pupils", req.user)) {
		Auth.renderDenied(false, res);
		return false;
	}
	var id = req.params.id;
	Models.LendModel.where("_pupil", req.params.id).sort("lenddate", "ascending").populate("_object").run(function (err,lends) {
		console.log(err);
		Models.PupilModel.where("_id", req.params.id).run(function (err,docs) {
			res.render('singlepupil',{
				title: 'Schüler',
				scripts: ["jquery.js", "singleobject.js"],
				pupil: docs[0],
				lends: lends
			});
		});
	});
}

exports.listgroups = function(req, res){
	if(!Auth.mayI("list groups", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	res.render(
		'listgroups',{
			title: 'Gruppen anzeigen',
			scripts: ["jquery.js", "listgroups.js", "modal.js", "status.js"],
			columns:Models.GroupColumns,
	});
		
  //res.send("tbd");
};

exports.editgroup = function(req, res){
	if(!Auth.mayI("edit groups", req.user)) {
		Auth.renderDenied(false, res);
		return false;
	}
	Models.GroupModel.where("_id", req.params.id).run(function (err,docs) {
		console.log(docs);
		if(!docs || docs.length == 0) {
			res.send("Not foundp");
			return false;
		}
		
		res.render('editgroup',{
			title: 'Gruppe bearbeiten',
			scripts: ["jquery.js", "editgroup.js", "status.js", "ean13.js"],
			init: docs[0]
		});
		
	});
};

Date.prototype.getFmt = function() {
	return this.getDate().toString().zfill(2) + "." + (this.getMonth()+1).toString().zfill(2) + "." + this.getFullYear();
}

Date.prototype.setFmt = function(s) {
	var d = now.split(".");
	this = new Date(d[2], parseInt(d[1])-1, d[0], 10);
}

exports.lend = function(req, res){
	if(!Auth.mayI("lend", req.user)) {
		Auth.renderDenied(false, res);
		return false;
	}
	var now = new Date();
	var t = [];
	var objects = req.params.objects.split(",");
	for(i in objects) {
		t.push({_id: objects[i]});
	}
	console.log(t);
	Meta.get(function(m) {
		Models.ObjectModel.where().or(t).run(function (err,docs) {
			Models.PupilModel.where("_id", req.params.pupil).populate("_group").run(function (err,pupil) {
				var returndate = new Date(new Date().getTime() + 1000*3600*24*pupil[0]._group.duration);
				if(m._doc.returndate.mode == "fixed") {
					returndate = m._doc.returndate.date;
				}
				if(m._doc.returndate.mode == "latest") {
					if(returndate > m._doc.returndate.date) {
						returndate = m._doc.returndate.date;
					}
				}
				res.render('lend',{
					title: 'Ausleihen',
					scripts: ["jquery.js", "lend.js", "status.js", "jquery-ui.js", "rate.js"],
					pupil: pupil[0],
					objects: docs,
					now: now.getFmt(),
					returndate : returndate.getFmt(),
					quick: req.param("quick"),
					altreturndate: m._doc.returndate.mode!="off"
				});
			});
		});
	});
};


exports.reminds = function(req, res) {
	if(!Auth.mayI("view reminds", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	Models.LendModel.where("returndate", null).lt("expiredate", new Date()).sort("lenddate", "ascending").populate("_pupil").populate("_object").run(function (err,reminds) {
		res.render('reminds',{
			title: 'Mahnungen',
			scripts: ["jquery.js", "reminds.js", "status.js", "modal.js"],
			reminds: reminds
		});
	});
}


exports.quick = function(req, res) {
	if(!Auth.mayI("use quick", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	res.render('quick',{
		title: 'Quickmodus',
		scripts: ["jquery.js", "quick.js", "status.js", "modal.js", "rate.js"],
	});
}

exports.settings = function(req, res) {
	if(!Auth.mayI("view settings", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	Models.GroupModel.where().run(function(error, groups) {
		Meta.get(function(m) {
			delete m._doc._id;
			res.render('settings',{
				title: 'Einstellungen',
				scripts: ["jquery.js", "settings.js", "status.js", "modal.js", "jquery-ui.js"],
				meta :m._doc,
				groups: groups,
				objectcolumns:Models.ObjectColumns,
			});
		});
	});
}

exports.print = function(req, res){
	if(!Auth.mayI("print barcodes", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	res.render(
		'print',
		{
			title: 'Barcodes ausdrucken',
			scripts: ["jquery.js", "print.js", "modal.js", "status.js"],
	});
		
  //res.send("tbd");
};


exports.listusers = function(req, res){
	if(!Auth.mayI("admin", req.user)) {
		Auth.renderDenied(true, res);
		return false;
	}
	res.render(
		'listusers',{
			title: 'Benutzer anzeigen',
			scripts: ["jquery.js", "listusers.js", "modal.js", "status.js"]
	});
		
  //res.send("tbd");
};


exports.edituser = function(req, res){
	if(!Auth.mayI("admin", req.user)) {
		Auth.renderDenied(false, res);
		return false;
	}
	Models.UserModel.where("_id", req.params.id).run(function (err,docs) {
		if(!docs || docs.length == 0) {
			res.send("Not foundp");
			return false;
		}
		
		res.render('edituser',{
			title: 'Benutzer bearbeiten',
			scripts: ["jquery.js", "edituser.js", "status.js"],
			init: docs[0],
			permissions: Auth.permissions
		});
		
	});
};
