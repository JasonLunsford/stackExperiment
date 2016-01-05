// Define Project as a Meteor collection
RouteState = new Meteor.Collection("routeState");

// Create schema
RouteStateSchema = new SimpleSchema({
    user_id: {
        label: "user id",
        type: String,
        index: true
    },
	project_id: {
		label: "project id",
		type: String,
		optional: true
	},
	site_id: {
		label: "site id",
		type: String,
		optional: true
	},
	page_id: {
		label: "page id",
		type: String,
		optional: true
	}
});

// Attach Schema
RouteState.attachSchema(RouteStateSchema);