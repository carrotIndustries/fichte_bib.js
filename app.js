
/**
 * Module dependencies.
 */

var express = require('express')
  , doroutes = require('./doroutes.js')
  , routes = require('./routes.js')
  , printroutes = require('./printroutes.js');
request = require('request');
var app = module.exports = express.createServer();
mongoose = require('mongoose');
mongooseAuth = require('mongoose-auth');
everyauth = require('everyauth')
  , Promise = everyauth.Promise;

User = null;
Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

Validate = require("./lib/validate");
Schemas = require('./schemas');
Models = require('./models');

util = require('util');
async = require('async');

Objects = require("./lib/objects.js")
Pupils = require("./lib/pupils.js")
Meta = require('./lib/meta.js');
Groups = require('./lib/groups.js');
Lend = require('./lib/lend.js');
Print = require('./lib/print.js');
EAN13 = require('./lib/ean13.js');
Auth = require('./lib/auth.js');
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret:"CIxg0baRpw6gQ11DhNe3+g=="}));
  app.use(mongooseAuth.middleware());
  //app.use(app.router); conflicts with mongooseAuth.middleware()
  app.use(express.static(__dirname + '/public'));
  
  
});
/*
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
*/
app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.use(express.bodyParser());
app.all('*', function(req,res,next) {
	if(req.user) {
		res.local("User", req.user); next();
	}
	else {
		Models.UserModel.where("login", "niemand").run(function (error, docs) {
			req.user = docs[0];
			res.local("User", req.user); next();
		});
	}
});
app.get('/', routes.index);
app.get('/objects/new', routes.addobject);
app.get('/objects/edit/:id', routes.editobject);
app.get('/objects', routes.listobjects);
app.get('/objects/lend/:id', routes.listobjects);
app.get('/objects/:id', routes.singleobject);



app.get('/do/fetch/isbn/:isbn', doroutes.fetchisbn);

app.post('/do/add/object', doroutes.addobject);
app.post('/do/update/object', doroutes.updateobject);
app.post('/do/list/objects', doroutes.listobjects);
app.get('/do/delete/object/:id', doroutes.deleteobject);
app.get("/do/rate/:id/:rate", doroutes.rate);
app.get('/pupils', routes.listpupils);
app.get('/pupils/new', routes.addpupil);
app.get('/pupils/edit/:id', routes.editpupil);
app.post('/do/list/pupils', doroutes.listpupils);
app.get('/do/delete/pupil/:id', doroutes.deletepupil);
app.get("/do/generateCode/:prefix", doroutes.generateCode);
app.post('/do/update/pupil', doroutes.updatepupil);
app.post('/do/add/pupil', doroutes.addpupil);
app.get('/pupils/:id', routes.singlepupil);


app.get('/groups', routes.listgroups);
app.post('/do/add/group', doroutes.addgroup);
app.post('/do/list/groups', doroutes.listgroups);
app.get('/do/delete/group/:id', doroutes.deletegroup);
app.post('/do/update/group', doroutes.updategroup);
app.get('/groups/edit/:id', routes.editgroup);

app.get('/lend/:pupil/:objects', routes.lend);
app.post("/do/lend", doroutes.lend);
app.get("/do/return/:id", doroutes.returnobject);
app.get("/do/longer/:id", doroutes.longerobject);
app.get("/do/info/:id", doroutes.objectinfo);
app.get("/do/findobject/:val", doroutes.findobject);
app.get("/reminds", routes.reminds);
app.get("/quick", routes.quick);
app.get("/settings", routes.settings);
app.get("/do/findpupil/:field/:val", doroutes.findpupil);
app.post("/do/updatemeta", doroutes.updatemeta);
app.post("/do/advancecounter", doroutes.advancecounter);

app.get("/print/pack", printroutes.pack);
app.post("/print/reminds", printroutes.reminds);
app.get("/print/pupils", printroutes.allpupils);
app.get("/print", routes.print);


app.get("/users", routes.listusers);
app.post('/do/list/users', doroutes.listusers);
app.get('/users/edit/:id', routes.edituser);
app.post('/do/update/user', doroutes.updateeuser);
app.get('/do/delete/user/:id', doroutes.deleteuser);

app.get("/updateclasses", routes.updateclasses);
app.post("/do/updateclasses", doroutes.updateclasses);
mongooseAuth.helpExpress(app);

app.listen(3000);
console.log("connecting");
mongoose.connect('mongodb://localhost/fichte_bib');

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
//Objects.add({title: "hallo Welt", isbn:"0815000014731", publisher: "carrotIndustries", authors:[{firstname: "Lukas", lastname:"Kramer"}]}, function(e) {console.log(e);});
/*instance.save(function (err) {
  console.log(err);
});
//console.log(MyModel.find());
console.log(instance);
*//*
Models.ObjectModel.find({}, function (err, docs) {
  for(x in docs) {
	  console.log(docs[x]);
	 }
});

*/
//Meta.get(console.log);
//console.log(EAN13.calcChecksum("471100001476"));
//Objects.fetchstate("4f3e5c72e6cbb462c8d1c754", console.log);


