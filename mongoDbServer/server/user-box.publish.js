Meteor.publish("userBox", function () {
	return UserBox.find({});
});