exports.add = function(data, err) {
	Meta.get(function(meta) {
		Models.PupilModel.where("card", data.card).count(function (error, n) {
			if(n != 0) {
				err("alreadyexists");
			}
			else {
				delete data._id;
				var t= new Models.PupilModel();
				for (a in data) {
					t[a] = data[a];
				}
				t.id = meta.maxid;
				t.deleted = false;
				Meta.update({maxid: t.id+1}, function(){});
				t.save(err);
			}
		});
	});
}

function fetchstate(id, cb) {
	Models.LendModel.where("_pupil", id).where("returndate", null).count(function(z, n) {
		cb(n);
	});
}

function fetchstates(docs, cb, i) {
	fetchstate(docs[i]._id, function(n) {
		//console.log(docs[i]);
		docs[i]._doc.lends = n;
		if(i<(docs.length-1)) {
			i++;
			fetchstates(docs, cb, i);
		}
		else {
			console.log("fin");
			cb(docs);
		}
	});
	
}

exports.list = function(data, cb) {
	var t = Models.PupilModel.where("deleted", false);
	var ex = "(?i)"+(data.mode=="exact"||data.mode=="begin"?"^":"")+"("+data.search+")"+(data.mode=="exact"||data.mode=="end"?"$":"");
	t.regex(data.field, ex);
	t.sort(data.sort_by, data.sort_dir);
	t.limit(data.limit);
	t.populate("_group");
	console.log(data.group);
	if(data.group != "") {
		t.where("_group", data.group);
	}
	Meta.update({pupil_lastsearch: data}, function(){});
	t.run(function (err, docs) {
		//console.log(docs);
		if(docs) {
			if(docs.length > 0) {
				fetchstates(docs, cb, 0);
			}
			else {
				cb(docs);
			}
		}
		else {
			cb(null);
		}
	});
	
};

exports.remove = function(id, err) {
	Models.PupilModel.where("_id", id).where("deleted", false).update({deleted: true},function(error, docs) {
		if(docs != 0) {
			err(error);
		}
		else {
			err("not found");
		}
		
	});
	//console.log(t);
};

exports.update = function(data, err) {
	console.log("upda");
	var t= new Models.PupilModel(data);
	t.id = 0;
	t.validate(function(error) {
		if(error) {
			err(error);
		}
		else {
			var id = data._id;
			delete data._id;
			Models.PupilModel.where("_id", id).where("deleted", false).update(data,function(error, docs) {
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

exports.find = function(field, val, cb) {
	Models.PupilModel.where(field, val).populate("_group").run(function(error, docs) {
		console.log(error);
		if(docs) {
			if(docs.length > 0) {
				fetchstates(docs, cb, 0);
			}
			else {
				cb(docs);
			}
		}
		else {
			cb(null);
		}
	});
}
