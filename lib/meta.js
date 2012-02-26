exports.update = function(data, err) {
	Models.MetaModel.update(data,function(error, docs) {
		err(error);
	});
}

exports.get = function(cb) {
	Models.MetaModel.where().run(function (err, docs) {
		cb(docs[0]);
	});
}
