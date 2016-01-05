Meteor.publish("routeState", function() {
	return RouteState.find({});
});