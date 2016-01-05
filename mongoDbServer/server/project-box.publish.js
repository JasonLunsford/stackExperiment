Meteor.publish("projectBox", function() {
	return ProjectBox.find({});
});