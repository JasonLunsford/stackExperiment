angular.module('beetleLoop')
    .config(BeetleLoopConfig);

    // $inject protects against minification errors
    BeetleLoopConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function BeetleLoopConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('beetleLoop', {
                url      : '',
                abstract : true
            })

            .state('beetleLoop.login', {
                url: '/',
                views: {
                  "body_content@": {
                    controller  : 'UserController as userCtrl',
                    templateUrl: 'components/users/userShell.tpl.html'
                  }
                },
                data : { pageTitle: 'Welcome to BeetleLoop!' },
                resolve: {
                	RouteStateService:"RouteStateService",
                	UserBoxService:"UserBoxService",
                	UpdatedRoute: function($stateParams, RouteStateService, UserBoxService) {
                		var userId = UserBoxService.getUserId();

				        return RouteStateService.getRoute(userId)
				        .then(function(data) {
				            if ( typeof data === 'undefined') {
				                return RouteStateService.addRoute({
				                    user_id:userId,
				                    project_id:null,
				                    site_id:null,
				                    page_id:null
				                });
				            } else {
				            	return RouteStateService.getRoute(userId);
				            }
				        }).then(function(routeData) {

				        	return routeData;
				        });
                	}
                }
            })

            .state('beetleLoop.project', {
                url: '/project/:projectId',
                views: {
                  "top_navigation@" : {
                    controller  : 'TopNavigationController as topNavCtrl',
                    templateUrl : 'components/layout/topNavigationShell.tpl.html'
                  },
                  "body_content@": {
                    controller  : 'ContentController as contentCtrl',
                    templateUrl: 'components/layout/contentShell.tpl.html'
                  }
                },
                data : { pageTitle: 'My Project' },
                resolve: {
                	ProjectBoxService:"ProjectBoxService",
                	RouteStateService:"RouteStateService",
                	UserBoxService:"UserBoxService",
                	UpdatedRoute: function($stateParams, ProjectBoxService, RouteStateService, UserBoxService) {
                		var userId = UserBoxService.getUserId();

                		ProjectBoxService.setProjectId($stateParams.projectId);

                		return RouteStateService.updateRouteProjectId(userId, $stateParams.projectId)
                		.then(function(updateSuccessFlag) {
                			return RouteStateService.updateRouteSiteId(userId, "");
                		}).then(function(clearSiteIdSuccessFlag) {
                			return RouteStateService.getRoute(userId);
                		}).then(function(routeData) {
                			return {project_id:routeData.project_id};
                		});
                	}
                }
            })

            .state('beetleLoop.site', {
                url: '/project/site/:siteId',
                views: {
                  "top_navigation@" : {
                    controller  : 'TopNavigationController as topNavCtrl',
                    templateUrl : 'components/layout/topNavigationShell.tpl.html'
                  },
                  "body_content@": {
                    controller  : 'ContentController as contentCtrl',
                    templateUrl: 'components/layout/contentShell.tpl.html'
                  }
                },
                data : { pageTitle: 'My Site' },
                resolve: {
                	ProjectBoxService:"ProjectBoxService",
                	RouteStateService:"RouteStateService",
                	UserBoxService:"UserBoxService",
                	UpdatedRoute: function($stateParams, ProjectBoxService, RouteStateService, UserBoxService) {
                		var userId = UserBoxService.getUserId();

                		ProjectBoxService.setSiteId($stateParams.siteId);

                  		return RouteStateService.updateRouteSiteId(userId, $stateParams.siteId)
                		.then(function(updateSuccessFlag) {
                			return RouteStateService.updateRoutePageId(userId, "");
                		}).then(function(clearPageIdSuccessFlag) {
                			return RouteStateService.getRoute(userId);
                		}).then(function(routeData) {
                			ProjectBoxService.setProjectId(routeData.project_id);
                			return {site_id:routeData.site_id};
                		});
                	}
                }
            })

            .state('beetleLoop.page', {
                url: '/project/site/page/:pageId',
                views: {
                  "top_navigation@" : {
                    controller  : 'TopNavigationController as topNavCtrl',
                    templateUrl : 'components/layout/topNavigationShell.tpl.html'
                  },
                  "body_content@": {
                    controller  : 'WorkspaceController as workSpaceCtrl',
                    templateUrl: 'components/layout/workspaceShell.tpl.html'
                  }
                },
                data : { pageTitle: 'My Awesome Page Title' },
                resolve: {
                	ProjectBoxService:"ProjectBoxService",
                	RouteStateService:"RouteStateService",
                	UserBoxService:"UserBoxService",
                	UpdatedRoute: function($stateParams, ProjectBoxService, RouteStateService, UserBoxService) {
                		var userId = UserBoxService.getUserId();

                		ProjectBoxService.setPageId($stateParams.pageId);

                		return RouteStateService.updateRoutePageId(userId, $stateParams.pageId)
                		.then(function(updateSuccessFlag) {

                			return RouteStateService.getRoute(userId);
                		}).then(function(routeData) {
                			ProjectBoxService.setProjectId(routeData.project_id);
                			ProjectBoxService.setSiteId(routeData.site_id);

                			return routeData;
                		});
                	}
                }
            });

    }