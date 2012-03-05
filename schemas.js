exports.LendSchema = new Schema({
	lenddate	: {type: Date, required:true},
	expiredate	: {type: Date, required:true},
	returndate	: {type: Date},
	_pupil 		: {type: Schema.ObjectId, ref: 'pupil', required:true},
	_object		: {type: Schema.ObjectId, ref: 'object', required:true},
	printed		: {type: Number, min:1, default:1}
});

exports.ObjectSchema = new Schema({
	title		: {type: String, required:true},
	authors		: [{
		firstname: String,
		lastname: String
	}],
	isbn		: {type:String, required:true, validate: [Validate.isbn, 'isbn violation'] },
	publisher	: String,
	year		: {type: Number, min:0},
	edition		: {type: Number, min:0},
	genre		: String,
	location	: {type: String, trim:true, required:true},
	media		: {type: String, trim:true, required:true},
	deleted		: Boolean,
});

/*exports.ObjectSchema.virtual('status')
.get(function () {
	console.log("status");
	if(this.lend.length == 0) {
		return 0;
	}
	var i = 0;
	var current;
	while(i<this.lend.length) {
		if(this.lend[i].returndate == null) {
			current = this.lend[i];
		}
		i++;
	}
	if(current == null) {
		return 0;
	}
	if(current.expiredate <= new Date()) {
		return 2;
	}
	return 1;
	
});
*/
exports.PupilSchema = new Schema({
	firstname	: {type: String, required:true},
	lastname	: {type: String, required:true},
	class		: {type: String, required:true},
	card		: {type:String, required:true, validate: [Validate.isbn, 'card id violation'] },
	id			: {type: Number, required:true},
	_group 		: {type: Schema.ObjectId, ref: 'group', required:true},
	deleted		: Boolean
});

exports.GroupSchema = new Schema({
	name		: {type: String, required:true},
	maxlend		: {type: Number, required:true, min:0},
	duration	: {type: Number, required:true, min:0}
});

exports.MetaSchema = new Schema ({
	code		: Number,
	maxid		: Number,
	objectsearchdefault: String
});

exports.UserSchema = new Schema({
	permissions: [String]
});

exports.UserSchema.plugin(mongooseAuth, {
	everymodule: {
		everyauth: {
			User: function () {
				return Models.UserModel;
			}
		}
	}, 
	password: {
		everyauth: {
			getLoginPath: '/login'
			, postLoginPath: '/login'
			, loginView: 'login.jade'
			, loginLocals: {title: "Login", scripts:["jquery.js", "login.js"]}
			, loginSuccessRedirect: '/'
			, getRegisterPath: "/register"
			, postRegisterPath: "/register"
			, registerLocals: {title: "Registrieren", scripts:["jquery.js", "login.js"]}
			, registerView: 'register.jade'
			, registerSuccessRedirect: '/'
		}
	}
});	

	
	
