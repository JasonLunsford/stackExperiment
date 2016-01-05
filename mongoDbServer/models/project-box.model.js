Meteor.methods({
	addAsset:function(projectId, assetObject) {
		check(projectId, String);
		check(assetObject, Object);

		if (!assetObject.asset_id) {
			assetObject.asset_id = new Meteor.Collection.ObjectID().toHexString();

	        var addAssetResult = ProjectBox.update(
	            {
	            	project_id:projectId
	            },
	            {
	            	$push: {
	            		assets: assetObject
	            	}
	            }
	        );

	        if (addAssetResult)
	        	return 'Number of docs modified: '+addAssetResult;
	        else
	        	return 'Add new asset failed';
	    } else {
			// fat finger protector - rawr
			return 'Asset may already exist. Aborting.';
	    }

	},
	addPage:function(projectId, pageObject) {
		check(projectId, String);
		check(pageObject, Object);

		if (!pageObject.page_id) {
			pageObject.page_id = new Meteor.Collection.ObjectID().toHexString();

	        var addPageResult = ProjectBox.update(
	            {
	            	project_id:projectId
	            },
	            {
	            	$push: {
	            		pages: pageObject
	            	}
	            }
	        );

	        if (addPageResult)
	        	return 'Number of docs modified: '+addPageResult;
	        else
	        	return 'Add new page failed';

	    } else {
			// fat finger protector - rawr
			return 'Page may already exist. Aborting.';
	    }

	},
	addProject:function(projectObject) {
		check(projectObject, ProjectBox.simpleSchema());

		ProjectBox.insert( projectObject, function(error, result) {
        	if (error)
        		return 'Add new project failed: ', error;
        	else
        		return 'Project added.';
		});
	},
	addSite:function(projectId, siteObject) {
		check(projectId, String);
		check(siteObject, Object);

		if (!siteObject.site_id) {

			siteObject.site_id = new Meteor.Collection.ObjectID().toHexString();

	        var addSiteResult = ProjectBox.update(
	            {
	            	project_id:projectId
	            },
	            {
	            	$push: {
	            		sites: siteObject
	            	}
	            }
	        );

	        if (addSiteResult)
	        	return addSiteResult;
	        else
	        	return 'Add new site failed';

		} else {
			// fat finger protector - rawr
			return 'Site may already exist. Aborting.';
		}

	},
	addTemplate:function(projectId, templateObject) {
		check(projectId, String);
		check(templateObject, Object);

		if(!templateObject.template_id) {
			templateObject.template_id = new Meteor.Collection.ObjectID().toHexString();

	        var addTemplateResult = ProjectBox.update(
	            {
	            	project_id:projectId
	            },
	            {
	            	$push: {
	            		templates: templateObject
	            	}
	            }
	        );

	        if (addTemplateResult)
	        	return addTemplateResult;
	        else
	        	return 'Add new template failed';

	    } else {
			// fat finger protector - rawr
			return 'Template may already exist. Aborting.';
	    }

	},
	getAssets:function(projectId) {
		check(projectId, String);

		return ProjectBox.findOne({ project_id: projectId }).assets;
	},
	getPages:function(projectId) {
		check(projectId, String);

		return ProjectBox.findOne({ project_id: projectId }).pages;
	},
	getSites:function(projectId) {
		check(projectId, String);

		return ProjectBox.findOne({ project_id: projectId }).sites;
	},
	getTemplates:function(projectId) {
		check(projectId, String);

		return ProjectBox.findOne({ project_id: projectId }).templates;
	},
	removeAsset:function(projectId, assetId) {
		check(projectId, String);
		check(assetId, String);

		var removeAssetResult = ProjectBox.update(
			{
				project_id: projectId,
				assets:{
					$elemMatch:{
						asset_id:assetId
					}
				}
			},
			{
				$pull:{
					assets: {
						asset_id:assetId
					}
				}
			}
		);

        if (removeAssetResult)
        	return "Asset removal impacted: "+removeAssetResult+" documents.";
        else
        	return 'Remove asset failed';
	},
	removeProject:function(projectId) {
		check(projectId, String);

		ProjectBox.remove({ project_id: projectId }, function(error) {
			if (error)
				throw new Meteor.Error('Failed to remove project: ', error);

			return "Project removed.";
		});

	},
	removePage:function(projectId, pageId) {
		check(projectId, String);
		check(pageId, String);

		var removePageResult = ProjectBox.update(
			{
				project_id:projectId,
				pages:{
					$elemMatch:{
						page_id:pageId
					}
				}
			},
			{
				$pull:{
					pages: {
						page_id:pageId
					}
				}
			}
		);

        if (removePageResult)
        	return "Page removal impacted: "+removePageResult+" documents.";
        else
        	return 'Remove page failed';
	},
	removeSite:function(projectId, siteId) {
		check(projectId, String);
		check(siteId, String);

		var removeSiteResult = ProjectBox.update(
			{
				project_id: projectId,
				sites:{
					$elemMatch:{
						site_id:siteId
					}
				}
			},
			{
				$pull:{
					sites: {
						site_id:siteId
					}
				}
			}
		);

        if (removeSiteResult)
        	return "Site removal impacted: "+removeSiteResult+" documents.";
        else
        	return 'Remove site failed';

	},
	removeTemplate:function(projectId, templateId) {
		check(projectId, String);
		check(templateId, String);

		var removeTemplateResult = ProjectBox.update(
			{
				project_id: projectId,
				templates:{
					$elemMatch:{
						template_id:templateId
					}
				}
			},
			{
				$pull:{
					templates: {
						template_id:templateId
					}
				}
			}
		);

        if (removeTemplateResult)
        	return 'Template removal impacted: '+removeTemplateResult+' documents.';
        else
        	return 'Remove template failed';

	},
	updateAsset:function(projectId, assetId, assetData) {
/*		check(projectId, String);
		check(assetId, String);
		check(assetData, Object);*/

		// stubbed, expand into field specific update method(s)

		return "Asset update method stub";
	},
	updatePage:function(projectId, pageId, pageData) {
		check(projectId, String);
		check(pageId, String);
		check(pageData, Array);

		var updatePageResult = ProjectBox.update(
			{
				project_id: projectId,
				pages:{
					$elemMatch:{
						page_id:pageId
					}
				}
			},
			{
				$set: {
					'pages.$.page_content':pageData
				}
			}
		);

        if (updatePageResult)
        	return 'success';
        else
        	return 'error';
	},
	updateProject:function(projectId, projectData) {
/*		check(projectId, String);
		check(projectData, ProjectBox.simpleSchema());*/

		// stubbed, expand into field specific update method(s)

		return "Project update method stub";
	},
	updateSite:function(projectId, siteId, siteData) {
/*		check(projectId, String);
		check(siteId, String);
		check(siteData, Object);*/

		// stubbed, expand into field specific update method(s)

		return "Site update method stub";
	},
	updateTemplate:function(projectId, templateId, templateData) {
		check(projectId, String);
		check(templateId, String);
		check(templateData, Array);

		var updateTemplateResult = ProjectBox.update(
			{
				project_id: projectId,
				templates:{
					$elemMatch:{
						template_id:templateId
					}
				}
			},
			{
				$set: {
					'templates.$.template_structure':templateData
				}
			}
		);

        if (updateTemplateResult)
        	return 'success';
        else
        	return 'error';
	},
});

/****************************************************
 Built in methods, explicitly deactivated for now.
****************************************************/

// allow methods are allowed only when they return true or a value
ProjectBox.allow({
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

ProjectBox.deny({
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