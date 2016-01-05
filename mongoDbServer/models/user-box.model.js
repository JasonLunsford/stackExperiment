Meteor.methods({
	addUser:function(userData) {
		check(userData, UserBox.simpleSchema());

		UserBox.insert( userData, function(error, result) {
			if (error)
				throw new Meteor.Error('Failed to create new user account: ', error);
			else
				return result;
		});
	},
	assignToProject:function(projectId, userId) {
		check(projectId, String);
		check(userId, String);

        UserBox.update(
            {"user_id":userId},
            {
            	$push: {
            		projects: projectId
            	}
            },
            function(error, result) {
            	if (error)
            		throw new Meteor.Error('Failed to assign project: ', error);
            	else
            		return "Project assigned.";
            }
        );
	},
	getUserProjects:function(userId) {
		check(userId, String);

		return UserBox.findOne({ user_id: userId }).projects;
	},
	removeFromProject:function(projectId, userId) {
		check(userId, String);
		check(projectId, String);
		
		var user = UserBox.findOne({ user_id: userId }),
			i    = user.projects.indexOf(projectId);
			
		if (i != -1) {
			user.projects.splice(i, 1);

	        UserBox.upsert(
	            {"user_id":userId},
	            {
	            	$set: {
	            		projects: user.projects
	            	}
	            },
	            function(error, result) {
	            	if (error)
	            		throw new Meteor.Error('Failed to remove user from project: ', error);
	            	else
	            		return "User removed from project.";
	            }
	        );
		} else {
			return "User not assigned to that project.";
		}
	},
	removeUser:function(userId) {
		check(userId, String);

		UserBox.remove({ user_id: userId }, function(error) {
			if (error)
				throw new Meteor.Error('Failed to remove user account: ', error);
		});
	},
	updateUserEmail:function(emailAddress, userId) {
		check(userId, String);
		check(emailAddress, String);

        UserBox.upsert(
            {"user_id":userId},
            {
            	$set: {
            		email: emailAddress
            	}
            },
            function(error, result) {
            	if (error)
            		throw new Meteor.Error('Failed to update email address: ', error);
            	else
            		return "Email address updated.";
            }
        );
	},
	updateUserName:function(userName, userId) {
		check(userId, String);
		check(userName, String);

        UserBox.upsert(
            {"user_id":userId},
            {
            	$set: {
            		username: userName
            	}
            },
            function(error, result) {
            	if (error)
            		throw new Meteor.Error('Failed to update user name: ', error);
            	else
            		return "User name updated.";
            }
        );
	}
});

/****************************************************
 Built in methods, explicitly deactivated for now.
****************************************************/

// allow methods are allowed only when they return true or a value
UserBox.allow({
	insert: function(userId, project) {
		// userId must exist and own the document they are inserting
		// return (userId && project.owner === userId);
	},
	update: function(userId, project, fields, modifier) {
		// Can only update documents owned by the userId
		// project.owner === userId;
	},
	remove: function(userId, project) {
		// userId must own document to remove it
		// return project.owner === userId;
	}
	// just grab project owner (per project)
  	//,fetch: ['owner']
});

UserBox.deny({
	update: function (userId, project, fields, modifier) {
		// Prevent changing of owners
		// return _.contains(fields, 'owner');
	},
	remove: function (userId, project) {
		// Locked projects cannot be removed
		// return project.locked;
	}
	// grab locked state per project
	//,fetch: ['locked']
});