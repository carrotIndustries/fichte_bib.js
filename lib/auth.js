exports.permissions= [
	{id:"admin", name:"Administrator (darf alles)"},
	{id:"list objects", name:"Objekte anzeigen"},
	{id:"delete objects", name:"Objekte löschen"},
	{id:"edit objects", name:"Objekte bearbeiten"},
	{id:"view objects", name:"Objekt-Karteikarte anzeigen"},
	{id:"return", name:"Zurückgeben"},
	{id:"longer", name:"Verlängern"},
	{id:"lend", name:"Ausleihen"},
	{id:"info objects", name:"Ausleihinfo anzeigen"},
	{id:"add objects", name:"Objekte hinzufügen"},
	{id:"add pupils", name:"Schüler hinzufügen"},
	{id:"list pupils", name:"Schüler anzeigen"},
	{id:"delete pupils", name:"Schüler löschen"},
	{id:"edit pupils", name:"Schüler bearbeiten"},
	{id:"view pupils", name:"Schüler-Karteikarte anzeigen"},
	{id:"view reminds", name:"Mahnungen anzeigen"},
	{id:"print reminds", name:"Mahnungen ausdrucken"},
	{id:"view settings", name:"Einstellungen anzeigen"},
	{id:"save settings", name:"Einstellungen speichern"},
	{id:"list groups", name:"Gruppen anzeigen"},
	{id:"delete groups", name:"Gruppen löschen"},
	{id:"edit groups", name:"Gruppen bearbeiten"},
	{id:"add groups", name:"Gruppen hinzufügen"},
	{id:"print barcodes", name:"Barcodes ausleihen"},
	{id:"view index", name:"Übersicht anzeigen"},
	{id:"use quick", name:"Quickmodus verwenden"},
];

exports.renderDenied = function(nav, res) {
	res.render('denied',{
		title: 'Verboten',
		scripts : ["jquery.js", "singleobject.js"],
		nav:nav
	});
}

exports.mayI = function (perm, user) {
	if (!user) {
		return false;
	}
	var perms = user.permissions;
	if(perms.indexOf("admin") != -1) {
		return true;
	}
	if(perms.indexOf(perm) != -1) {
		return true;
	}
	return false;
	
}

exports.mayIError = function(perm, user, nav, res) {
	if(!Auth.mayI(perm, user)) {
		this.renderDenied(true, res);
	}
}

exports.list = function(cb) {
	var t = Models.UserModel.where();
	t.run(function (err, docs) {
		cb(docs);
	});
};

exports.update = function(data, err) {
	var t= new Models.UserModel(data);
	t.validate(function(error) {
		if(error) {
			err(error);
		}
		else {
			var id = data._id;
			delete data._id;
			Models.UserModel.where("_id", id).update(data,function(error, docs) {
				if(docs != 0) {
					err(error);
				}
				else {
					err("not found");
				}
				
			});
		}
	});
}

exports.remove = function(id, err) {
	Models.UserModel.where("_id", id).remove(function(error, docs) {
		if(docs != 0) {
			err(error);
		}
		else {
			err("not found");
		}
		
	});
};
