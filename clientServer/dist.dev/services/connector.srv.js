angular.module('beetleLoop.services')
	.service('ConnectorService', ConnectorService);

	ConnectorService.$inject = ['Restangular', 'ConnectorRestangularApi'];

	function ConnectorService(restangular, ConnectorRestangularApi) {
    	var connectorService = this,
            apiBase = ConnectorRestangularApi.all('/magnolia/');

	}