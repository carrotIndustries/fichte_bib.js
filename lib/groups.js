exports.add = function(data, err) {
	delete data._id;
	var t= new Models.GroupModel();
	for (a in data) {
		t[a] = data[a];
	}
	t.save(err);
};

exports.list = function(cb) {
	Meta.get(function(m) {
		var t = Models.GroupModel.where();
		t.run(function (err, docs) {
			for(i in docs) {
				console.log(docs[i]._id);
				if(docs[i]._id.toString() == m._doc.defaultgroup) {
					docs[i]._doc.default = true;
				}
				else {
					docs[i]._doc.default = false;
				}
			}
			cb(docs);
		});
	});
	
};

exports.remove = function(id, err) {
	Meta.get(function(m) {
		
		if(id.toString() == m._doc.defaultgroup.toString()) {
			err("heilig");
		}
		else {
			
			Models.PupilModel.where("_group", id).where("deleted", false).update({_group: m._doc.defaultgroup.toString()},function(error, docs2) {
				Models.GroupModel.where("_id", id).remove(function(error, docs) {
					if(docs != 0) {
						err(error);
					}
					else {
						err("not found");
					}
				});
			});
			
		}
		
	});
	//console.log(t);
};

exports.update = function(data, err) {
	console.log("upda");
	var t= new Models.GroupModel(data);
	t.validate(function(error) {
		if(error) {
			err(error);
		}
		else {
			var id = data._id;
			delete data._id;
			Models.GroupModel.where("_id", id).update(data,function(error, docs) {
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
