angular.module('beetleLoop')
	.controller('WorkspaceController', WorkspaceController);

	WorkspaceController.$inject = ['ProjectBoxService', 'UpdatedRoute'];

	function WorkspaceController(ProjectBoxService, UpdatedRoute) {

		var vm = this;

		vm.updatedRoute = UpdatedRoute;

	}