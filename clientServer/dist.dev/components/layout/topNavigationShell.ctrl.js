angular.module('beetleLoop')
	.controller('TopNavigationController', TopNavigationController);

	TopNavigationController.$inject = ['$meteor',
									   'ProjectBoxService',
									   'UpdatedRoute'];

	function TopNavigationController($meteor, ProjectBoxService, UpdatedRoute) {
        
		var vm = this;

		vm.updatedRoute = UpdatedRoute;
		
	}