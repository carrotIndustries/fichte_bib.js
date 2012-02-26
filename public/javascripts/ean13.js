function generateCode(prefix, cb) {
	$.ajax({
		type: "GET",
		url: "/do/generateCode/"+prefix,
		dataType: "json",
		success: function (data) {
			cb(data.code);
		}
	});
}
