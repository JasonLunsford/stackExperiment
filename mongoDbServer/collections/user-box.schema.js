// Define Project as a Meteor collection
UserBox = new Meteor.Collection("userBox");

// Create schema
UserSchema = new SimpleSchema({
    user_id: {
        label: "user id",
        type: String,
        index: true
    },
	username: {
		label: "user name",
		type: String,
		optional: true
	},
	email: {
		label: "email address",
		type: String,
		optional: true
	},
	projects: {
		label: "associated projects",
		type:[String],
		optional: true
	},
    createdAt: {
        type: Date,
        label: "Date user registered",
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        },
        optional: true
    }
});

// Attach Schema
UserBox.attachSchema(UserSchema);