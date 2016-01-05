angular.module('beetleLoop.services')
	.service('ProjectBoxService', ProjectBoxService);

	ProjectBoxService.$inject = ['$meteor', '$q'];

	function ProjectBoxService($meteor, $q) {
    	var proBoxService = this,
            assetId,
            pageId,
            projectId,
            siteId,
            templateId;

        /* Basic Getters/Setters */

        proBoxService.getAssetId    = function() { return assetId; };
        proBoxService.getPageId     = function() { return pageId; };
        proBoxService.getProjectId  = function() { return projectId; };
        proBoxService.getSiteId     = function() { return siteId; };
        proBoxService.getTemplateId = function() { return templateId; };

        proBoxService.setAssetId    = function(id) { assetId = id; };
        proBoxService.setPageId     = function(id) { pageId = id; };
        proBoxService.setProjectId  = function(id) { projectId = id; };
        proBoxService.setSiteId     = function(id) { siteId = id; };
        proBoxService.setTemplateId = function(id) { templateId = id; };

        /* Meteor Method API Calls */

        /* Add Calls */
        proBoxService.addAsset = function(content) {
            return $meteor.call('addAsset', projectId, content);
        };

        proBoxService.addPage = function(content) {
            return $meteor.call('addPage', projectId, content);
        };

        proBoxService.addProject = function(content) {
            return $meteor.call('addProject', content);
        };

        proBoxService.addSite = function(content) {
            return $meteor.call('addSite', projectId, content);
        };

        proBoxService.addTemplate = function(content) {
            return $meteor.call('addTemplate', projectId, content);
        };

        /* Get Calls */
        proBoxService.getAsset = function(assetId) {
            var targetAsset = [];

            return $meteor.call('getAssets', projectId).then(function(data) {
                angular.forEach(data, function(asset) {
                    if (asset.asset_id === assetId) {
                        targetAsset.push(asset);
                    }
                });

                if (targetAsset.length === 0 )
                    targetAsset.push({errorMsg:"asset not found or missing asset ID"});

                return $q.resolve(targetAsset);
            });
        };

        proBoxService.getAllAssets = function() {
            return $meteor.call('getAssets', projectId);
        };

        proBoxService.getPage = function(pageId) {
            var targetPage = [];

            return $meteor.call('getPages', projectId).then(function(data) {
                angular.forEach(data, function(page) {
                    if (page.page_id === pageId) {
                        targetPage.push(page);
                    }
                });

                if (targetPage.length === 0 )
                    targetPage.push({errorMsg:"page not found or missing page ID"});

                return $q.resolve(targetPage);
            });
        };

        // if siteId passed, return only pages associated w that site,
        // otherwise return all project pages
        proBoxService.getAllPages = function(siteId) {
            var pageCollection = [];

            return $meteor.call('getPages', projectId).then(function(data) {
                if (arguments.length === 1) {
                    angular.forEach(data, function(page) {
                        if (page.page_site_id === siteId) {
                            pageCollection.push(page);
                        }
                    });
                } else {
                    angular.forEach(data, function(page) {
                        pageCollection.push(page);
                    });
                }

                return $q.resolve(pageCollection);
            });
        };

        proBoxService.getSite = function(siteId) {
            var targetSite = [];

            return $meteor.call('getSites', projectId).then(function(data) {
                angular.forEach(data, function(site) {
                    if (site.site_id === siteId) {
                        targetSite.push(site);
                    }
                });

                if (targetSite.length === 0 )
                    targetSite.push({errorMsg:"site not found or missing site ID"});

                return $q.resolve(targetSite);
            });
        };

        proBoxService.getAllSites = function() {
            return $meteor.call('getSites', projectId);
        };

        proBoxService.getTemplate = function(templateId) {
            var targetTemplate = [];

            return $meteor.call('getTemplates', projectId).then(function(data) {
                angular.forEach(data, function(template) {
                    if (template.template_id === templateId) {
                        targetTemplate.push(template);
                    }
                });

                if (targetTemplate.length === 0 )
                    targetTemplate.push({errorMsg:"template not found or missing template ID"});

                return $q.resolve(targetTemplate);
            });
        };

        proBoxService.getAllTemplates = function() {
            return $meteor.call('getTemplates', projectId);
        };

        /* Remove Calls */
        proBoxService.removeAsset = function(assetId) {
            return $meteor.call('removeAsset', projectId, assetId);
        };

        proBoxService.removePage = function(pageId) {
            return $meteor.call('removePage', projectId, pageId);
        };

        proBoxService.removeProject = function(id) {
            return $meteor.call('removeProject', id);
        };

        proBoxService.removeSite = function(siteId) {
            return $meteor.call('removeSite', projectId, siteId);
        };

        proBoxService.removeTemplate = function(templateId) {
            return $meteor.call('removeTemplate', projectId, templateId);
        };

        /* Update Calls */
        proBoxService.updateAsset = function(assetId, content) {
            return $meteor.call('updateAsset', projectId, assetId, content);
        };

        proBoxService.updatePage = function(pageId, content) {
            return $meteor.call('updatePage', projectId, pageId, content);
        };

        proBoxService.updateProject = function(id, content) {
            return $meteor.call('updateProject', id, content);
        };

        proBoxService.updateSite = function(siteId, content) {
            return $meteor.call('updateSite', projectId, siteId, content);
        };

        proBoxService.updateTemplate = function(templateId, content) {
            return $meteor.call('updateSite', projectId, templateId, content);
        };

        /* Process Content Calls */

        proBoxService.mergeContentAndTemplate = function(pageId) {
            return proBoxService.getPage(pageId).then(function(data) {
                page = data[0];

                return proBoxService.getTemplate(page.page_template_id);
            }).then(function(data) {
                var template = data[0].template_structure,
                    attribPosition,
                    pageContent;

                for (var attrib in page.page_content) {
                    if (page.page_content.hasOwnProperty(attrib)) {
                        if (page.page_content[attrib] === "empty" || page.page_content[attrib] === null)
                            pageContent = "";
                        else
                            pageContent = page.page_content[attrib];
                        
                        if (template.search(attrib) != -1) {
                            attribPosition = template.indexOf(attrib) + attrib.length + 1;
                            template = template.substring(0, attribPosition) + pageContent + template.substr(attribPosition);
                        }
                    }
                }

                return $q.resolve(template);
            });
        };
	}