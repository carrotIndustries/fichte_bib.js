var fs = require("fs.extra");
var proc = require('child_process');
const TEMPDIR = "/tmp/"; //trailing slash
function mktempdir(cb) {
	var name = TEMPDIR + ".fichte_bib-" +  new Date().toString(); 
	fs.mkdir(name, function() {cb(name+"/")});
}

function generateCodes(buf, i, cb) {
	EAN13.generateCode("0815", function(code) {
		//console.log(docs[i]);
		buf.push(code);
		if(i<(70-1)) {
			i++;
			generateCodes(buf, i, cb);
			//fetchstates(docs, cb, i);
		}
		else {
			console.log("fin");
			cb(buf);
		}
	});
	
}

function printlatex(params) {
	mktempdir(function(tmp) {
		fs.copy("tex/ean13.tex", tmp+ "ean13.tex", function() {
			fs.copy("tex/"+params.src+".tex", tmp+ "page.tex", function() {
				fs.writeFile(tmp+"body.tex", params.text.replace(RegExp("€", "g"), "\\euro"), function (err) {
					if (err) {
						params.cb("copyerror");
						throw err;
					}
					var tex= proc.spawn("pdflatex", ["page.tex"], {cwd: tmp});
					tex.on('exit', function (code) {
						if(code != 0) {
							params.cb("latexerror");
						}
						else {
							Meta.get(function(m) {
								console.log("lpr " + m._doc.lpropts + " page.pdf");
								proc.exec("lpr " + m._doc.lpropts + " page.pdf",
									{cwd: tmp}, function(error, stdout, stderr) {
										console.log(error);
										if(error == null) {
											params.cb();
										}
										else {
											params.cb("printerror");
										}
								});
								
							});
						}
					});
					
				});
				
				
			});
		});
	});
}

exports.pack = function(cb) {
	var buf = [];
	generateCodes(buf, 0, function(codes) {
		var text = "";
		for (i in codes) {
			text += "\\EAN " + codes[i] + "\n";
		}
		printlatex({
			text: text,
			src: "vorratspackung",
			cb: cb
		});
	
	});

}

function template(text, o) {
	for(z in o) {
		text = text.replace(RegExp("%"+z, "gi"), o[z])
	}
	return text;
}

exports.reminds = function(ids, cb) {
	var t= [];
	for (i in ids) {
		t.push({"_object": ids[i]});
	}
	
	var fulltext = "";
	var page = 0;
	Meta.get(function(m) {
		Models.LendModel.where("returndate", null).populate("_object").populate("_pupil").or(t).run(function(err,docs) {
			var rawtext = m._doc.reminds.text;
			for(i in docs) {
				//text = text.replace(/%pfn/gi, docs[i]._pupil.firstname);
				fulltext += template(rawtext, {
					pfn: 	docs[i]._pupil.firstname,
					pln:	docs[i]._pupil.lastname,
					class:	docs[i]._pupil.class,
					afn:	docs[i]._object.authors[0].firstname,
					aln:	docs[i]._object.authors[0].lastname,
					title:	docs[i]._object.title,
					ldate:	docs[i].lenddate.getFmt(),
					edate:	docs[i].expiredate.getFmt(),
					n:		docs[i].printed,
					fine:	(parseInt(docs[i].printed)*parseFloat(m._doc.reminds.fine)).toString().replace(".", ","),
					efine:	m._doc.reminds.fine.toString().replace(".", ",")
				});
				page++;
				if(page > 3) {
					page =0;
					fulltext += "\\newpage";
				}
			}
			//console.log(fulltext);
			printlatex({
				text: fulltext,
				src: "mahnung",
				cb: cb
			});
		});
	});
}

exports.pupilcards = function(id, cb) {
	var t = Models.PupilModel.where("deleted", false);
	if(id) {
		t.where("_id", id);
	}
	t.run(function(err, docs) {
		var fulltext = "";
		for(i in docs) {
			fulltext += "\\EAN "+docs[i].card+" \n \\vspace{-1.5em} \n "+docs[i].firstname+" "+docs[i].lastname+" \n \\vspace{1em} \n\n";
		}
		printlatex({
				text: fulltext,
				src: "pupils",
				cb: cb
		});
	});
}
