angular.module('beetleLoop.services', [])
	.factory("ConnectorRestangularApi", ConnectorRestangularApi);
	// chain additional factories here for more to add more API base URLs

	ConnectorRestangularApi.$inject = ['Restangular'];

	function ConnectorRestangularApi(restangular) {
		return restangular.withConfig(function(RestangularConfigurer) {
		    RestangularConfigurer.setBaseUrl("http://localhost:8080");
		});
	}