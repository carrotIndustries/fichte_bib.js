exports.lend = function(data, err) {
	//PupilModel.where("_id", data.pupil).populate(").run(function(error, docs) {
	
	for(i in data.objects) {
		var t= new Models.LendModel();
		t._pupil = data.pupil;
		t.lenddate = new Date(parseInt(data.now));
		t.expiredate = new Date(parseInt(data.objects[i].returndate));
		t._object = data.objects[i].object;
		t.save(function (error) {
			if(error) {
				err(error);
				return;
			}
		});
	}
	err(null);
	//});
	
};

exports.returnobject = function(id, err) {
	Objects.fetchstate(id, function(status) {
		Models.LendModel.where("_object", id).where("returndate", null).update({
			returndate: new Date()
		}, function() {
			if(status != 2) {
				err();
			}
			else {
				err("exp");
			}
			});
	});
};

exports.longerobject = function(id, days, err) {
	if(!days) {
		err("arg");
	}
	else {
		Models.LendModel.where("_object", id).where("returndate", null).run(function(error, docs) {
			var r = docs[0].expiredate.getTime() + 1000*3600*24*days;
			Models.LendModel.where("_object", id).where("returndate", null).update({
				expiredate: new Date(r)
			}, err);
		});
	}
}

exports.getinfo= function(id, cb) {
	Models.LendModel.where("_object", id).where("returndate", null).populate("_pupil").run(function(error, docs) {
		if(docs.length > 0) {
			docs[0]._doc.expiredate = docs[0].expiredate.getFmt();
			docs[0]._doc.lenddate = docs[0].lenddate.getFmt();
			cb(docs[0]);
		}
		else {
			cb({});
		}
	});
}

exports.advancecounter = function(ids,cb) {
	var t= [];
	for (i in ids) {
		t.push({"_object": ids[i]});
	}
	//console.log(t);
	//Models.LendModel.where("returndate", null).populate("_object").or(t).update({$inc: {printed:1}},{ multi: true }, cb);
	Models.LendModel.update({returndate: null, $or:t}, {$inc: {printed:1}}, {multi: true}, cb);
}

