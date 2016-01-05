Meteor.methods({
	addRoute:function(routeObject) {
		check(routeObject, RouteState.simpleSchema());

		RouteState.insert( routeObject, function(error, result) {
			if (error)
				throw new Meteor.Error('Failed to store route data: ', error);
			else
				return result;
		});
	},
	getRoute:function(userId) {
		check(userId, String);

		return RouteState.findOne({ user_id: userId });
	},
	removeRoute:function(userId) {
		check(userId, String);

		var routeRemove = RouteState.remove({ user_id: userId });

		if (routeRemove)
			return 'Routing data removed successfully';
		else
			return 'Failed to remove route data.';
	},
	updateRouteProjectId:function(userId, projectId) {
		check(userId, String);
		check(projectId, String);

        var updateProjectIdResult = RouteState.update(
            {
            	user_id: userId
            },
            {
            	$set: {
            		project_id: projectId
            	}
            }
        );

        if (updateProjectIdResult)
        	return 'Project Id updated.';
        else
        	return 'Failed to update project Id';

	},
	updateRouteSiteId:function(userId, siteId) {
		check(userId, String);
		check(siteId, String);

        var updateSiteIdResult = RouteState.update(
            {
            	user_id: userId
            },
            {
            	$set: {
            		site_id: siteId
            	}
            }
        );

        if (updateSiteIdResult)
        	return updateSiteIdResult;
        else
        	return 'Update site ID failed';

	},
	updateRoutePageId:function(userId, pageId) {
		check(userId, String);
		check(pageId, String);

        var updatePageIdResult = RouteState.update(
            {
            	user_id: userId
            },
            {
            	$set: {
            		page_id: pageId
            	}
            }
        );

        if (updatePageIdResult)
        	return updatePageIdResult;
        else
        	return 'Update page ID failed';
	}
});

/****************************************************
 Built in methods, explicitly deactivated for now.
****************************************************/

// allow methods are allowed only when they return true or a value
RouteState.allow({
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

RouteState.deny({
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