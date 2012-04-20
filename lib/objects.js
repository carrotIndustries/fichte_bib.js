exports.add = function(data, err) {
	delete data._id;
	var t= new Models.ObjectModel();
	for (a in data) {
		t[a] = data[a];
	}
	t.deleted = false;
	t.rating = [0,0,0,0,0];
	t.save(err);
}

exports.fetchstate = function(id, cb) {
	Models.LendModel.where("_object", id).count(function(z, n) {
		//console.log("found:"+m);
		if(n == 0) {
			cb(0);
		}
		else {
			Models.LendModel.where("_object", id).where("returndate", null).count(function(z, n) {
				if(n==0) {
					cb(0);
				}
				else {
					Models.LendModel.where("_object", id).where("returndate", null).lt("expiredate", new Date().setHours(3)).count(function(z, n) {
						if(n == 0) {
							cb(1);
						}
						else {
							cb(2);
						}
					});
				}
			});
		}
	});
}

function fetchstates(docs, cb, i) {
	exports.fetchstate(docs[i]._id, function(n) {
		//console.log(docs[i]);
		docs[i]._doc.status = n;
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
	var t = Models.ObjectModel.where("deleted", false);
	var ex = "(?i)"+(data.mode=="exact"||data.mode=="begin"?"^":"")+"("+data.search+")"+(data.mode=="exact"||data.mode=="end"?"$":"");
	t.regex(data.field, ex);
	if(data.status == -1) {
		t.limit(data.limit);
	}
	t.skip(data.skip);
	if(data.location != "") {
		t.where("location", data.location);
	}
	if(data.media) {
		var o = [];
		for (m in data.media) {
			o.push({media: data.media[m]});
		}
		t.or(o);
	}
	t.sort(data.sort_by, data.sort_dir);
	console.log(ex);
	Meta.update({object_lastsearch: data}, function(){});
	t.run(function (err, docs) {
		//console.log(docs[0].status.toJSON)
		/*docs[0].toJSON = undefined;
		console.log(docs[0].toJSON);
		console.log(JSON.stringify(docs[0]));*/
		/*for(i in docs) {
			docs[i]._doc.status = 0;
		}
		cb(docs);*/
		if(docs) {
			if(docs.length > 0) {
				fetchstates(docs, function(d) {
					if(data.status != -1) {
						var docs2 = [];
						console.log(data.status);
						for(i in d) {
							if(d[i]._doc.status == data.status) {
								docs2.push(d[i]);
							}
						}
						cb(docs2.slice(data.skip, parseInt(data.skip)+parseInt(data.limit)));
					}
					else {
						cb(d);
					}
				}, 0);
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

exports.remove = function(id, err) {
	Models.ObjectModel.where("_id", id).where("deleted", false).update({deleted: true},function(error, docs) {
		if(docs != 0) {
			err(error);
		}
		else {
			err("not found");
		}
		
	});
	//console.log(t);
}
exports.update = function(data, err) {
	console.log("upda");
	var t= new Models.ObjectModel(data);
	t.validate(function(error) {
		if(error) {
			err(error);
		}
		else {
			var id = data._id;
			delete data._id;
			Models.ObjectModel.where("_id", id).where("deleted", false).update(data,function(error, docs) {
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

exports.find = function(val, cb) {
	if(val.length == 13) {
		var field = "isbn";
	}
	else {
		var field = "_id";
	}
	var t = Models.ObjectModel.where("deleted", false).where(field, val).run(function(error, docs) {
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
	
exports.rate = function(id, rate, err) {
	Models.ObjectModel.where("_id", id).where("deleted", false).run(function(err2, docs) {
		var rating = docs[0]._doc.rating;
		rating[rate]++;
		Models.ObjectModel.where("_id", id).where("deleted", false).update({rating: rating},function(error, docs) {
			if(docs != 0) {
				err(error);
			}
			else {
				err("not found");
			}
		});
	});
}
