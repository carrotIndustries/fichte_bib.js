exports.calcChecksum = function (code) {
	code = code.toString();
	if(code.length != 12) {
		return false;
	}
	var oddeven = 1;
	var extsum = 0;
	var i = 0;
	while(i < code.length) {
		var num = code[i];
		//console.log("code["+ i + "]=" + code[i]);
		var intsum = num*oddeven;
		oddeven = oddeven==1?3:1;
		extsum+=intsum;
		i++;
	}
	var check = (Math.floor(extsum/10)*10+10) - extsum;
	if(check == 10) {
		check = 0;
	}
	return code + check.toString();
};

String.prototype.zfill = function(n) {
	var s = this;
	while(s.length < n) {
		s = "0" + s;
	}
	return s;
}

exports.generateCode = function(prefix, cb) {
	var code = prefix.toString();
	if(code.length != 4) {
		cb(false);
	}
	
	Meta.get(function(data) {
		code += data.code.toString().zfill(8);
		//console.log(code);
		code = EAN13.calcChecksum(code);
		Meta.update({code: data.code+1}, function(){});
		cb(code);
	});
};
