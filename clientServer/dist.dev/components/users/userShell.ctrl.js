angular.module('beetleLoop')
	.controller('UserController', UserController);

	UserController.$inject = ['$meteor',
							  '$state',
							  'ProjectBoxService',
							  'UserBoxService',
							  'UpdatedRoute'];

	function UserController($meteor, $state, ProjectBoxService, UserBoxService, UpdatedRoute) {

		var vm = this;

		var userId = UserBoxService.getUserId();

        vm.login = function() {
			UserBoxService.getUserProjects().then(function(data) {
				// Setting all projects associated w given user
				ProjectBoxService.setProjectId(data);

				if (UpdatedRoute.page_id !== null) {
					$state.go('beetleLoop.page',{pageId:UpdatedRoute.page_id});
				} else if (UpdatedRoute.site_id !== null) {
					$state.go('beetleLoop.site',{siteId:UpdatedRoute.site_id});
				} else if (UpdatedRoute.project_id !== null) {
					$state.go('beetleLoop.project',{projectId:UpdatedRoute.project_id});
				} else {
					// need to build project interview process, not hop automatically
					// to the first project ID in the list
					$state.go('beetleLoop.project',{projectId:data[0]});
				}

			});
        };

	}