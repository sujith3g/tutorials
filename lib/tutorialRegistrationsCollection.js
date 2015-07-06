TutorialRegistrations = new Mongo.Collection("tutorialRegistrations");
TutorialRegistrations.allow({
	insert: function (userId, doc) {
		return true;
		// return !!userId;
	},
	update: function (userId, doc, fields, modifier) {
		return true;
	},
	remove: function (userId, doc) {
		return true;
	}
});