angular.module('beetleLoop')
	.controller('ContentController', ContentController);

	ContentController.$inject = ['UpdatedRoute'];

	function ContentController(UpdatedRoute) {

		var vm = this;

		vm.updatedRoute = UpdatedRoute;

	}