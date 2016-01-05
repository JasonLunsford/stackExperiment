angular.module('beetleLoop.services')
	.service('RouteStateService', RouteStateService);

	RouteStateService.$inject = ['$meteor'];

	function RouteStateService($meteor) {
    	var routeStateService = this,
            routeStateSubObj  = $meteor.subscribe('routeState');

        routeStateService.addRoute = function(routeObj) {
            return $meteor.call('addRoute', routeObj);
        };

        routeStateService.getRoute = function(userId) {
            return $meteor.call('getRoute', userId);
        };

        routeStateService.removeRoute = function(userId) {
            return $meteor.call('removeRoute', userId);
        };

        routeStateService.updateRouteProjectId = function(userId, projectId) {
            return $meteor.call('updateRouteProjectId', userId, projectId);
        };

        routeStateService.updateRouteSiteId = function(userId, siteId) {
            return $meteor.call('updateRouteSiteId', userId, siteId);
        };

        routeStateService.updateRoutePageId = function(userId, pageId) {
            return $meteor.call('updateRoutePageId', userId, pageId);
        };

    }