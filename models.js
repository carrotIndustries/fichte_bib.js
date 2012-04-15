exports.ObjectModel = mongoose.model('object', Schemas.ObjectSchema);

exports.ObjectFields = [
	{field: "authors.lastname", name:"Autor (Nachname)"},
	{field: "authors.firstname", name:"Autor (Vorname)"},
	{field: "title", name:"Titel"},
	{field: "isbn", name:"ISBN"},
	{field: "publisher", name:"Verlag"},
	{field: "year", name:"Erscheinungsjahr"},
	{field: "edition", name:"Auflage"},
	{field: "genre", name:"Genre"}
];

exports.ObjectColumns = [
	{field: "location", name:"Ort"},
	{field: "media", name:"Medium"},
	{field: "authors[0].lastname", name:"1. Autor (Nachname)"},
	{field: "authors[0].firstname", name:" 1. Autor (Vorname)"},
	{field: "authors[1].lastname", name:"2. Autor (Nachname)"},
	{field: "authors[1].firstname", name:" 2. Autor (Vorname)"},
	{field: "title", name:"Titel"},
	{field: "isbn", name:"ISBN"},
	{field: "rating", name:"Bewertung"},
	{field: "publisher", name:"Verlag"},
	{field: "year", name:"Erscheinungsjahr"},
	{field: "edition", name:"Auflage"},
	{field: "genre", name:"Genre"}
];

exports.Limits = [10, 20, 50, 100, 0];

exports.PupilModel = mongoose.model('pupil', Schemas.PupilSchema);

exports.PupilFields = [
	{field: "lastname", name:"Nachname"},
	{field: "firstname", name:"Vorname"},
	{field: "class", name:"Klasse"},
	{field: "card", name:"Kartennummer"},
];
exports.PupilColumns = [
	{field: "lastname", name:"Nachname"},
	{field: "firstname", name:"Vorname"},
	{field: "class", name:"Klasse"},
	{field: "card", name:"Kartennummer"},
	{field: "_group.name", name:"Gruppe"},
	{field: "id", name:"ID"},
];

exports.MetaModel = mongoose.model('meta', Schemas.MetaSchema);
exports.GroupModel = mongoose.model('group', Schemas.GroupSchema);


exports.GroupColumns = [
	{field: "name", name:"Name"},
	{field: "maxlend", name:"Max. auszuleihende Obj."},
	{field: "duration", name:"Max. Ausleihdauer"},
];

exports.LendModel = mongoose.model('lend', Schemas.LendSchema);
exports.UserModel = mongoose.model('user', Schemas.UserSchema);
