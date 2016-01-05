angular.module('beetleLoop.services')
	.service('MongoRxService', MongoRxService);

	MongoRxService.$inject = ['$meteor'];

	function MongoRxService($meteor) {
    	var mongoRXService = this,
            appliedCss,
            blendedMarkup,
            pageData,
            template;

        var rxObjSubscription = $meteor.subscribe('projectBox');

        /* Basic Getters/Setters */

        mongoRXService.getAppliedCss    = function() { return appliedCss; };
        mongoRXService.getBlendedMarkup = function() { return blendedMarkup; };
        mongoRXService.getPageData      = function() { return pageData; };
        mongoRXService.getTemplate      = function() { return template; };

        mongoRXService.getAppliedCss    = function(content) { appliedCss = content; };
        mongoRXService.setBlendedMarkup = function(content) { blendedMarkup = content; };
        mongoRXService.setPageData      = function(content) { pageData = content; };
        mongoRXService.setTemplate      = function(content) { template = content; };

        /* Dynamic Data Objects */

        mongoRXService.rxDocument = function(projectId) {
            var selector = {
                project_id:projectId
            };

            return ProjectBox.find(selector);
        };

	}