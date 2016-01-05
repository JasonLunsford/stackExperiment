angular.module('beetleLoop')
    .run(BeetleLoopRun);

    // $inject protects against minification errors
    BeetleLoopRun.$inject  = ['$rootScope',
                              '$state',
                              '$stateParams',
                              'ProjectBoxService',
                              'RouteStateService',
                              'UserBoxService'];

    // Dynamic page title, plus hardcoded user ID
    function BeetleLoopRun($rootScope, $state, $stateParams, ProjectBoxService, RouteStateService, UserBoxService) {
        $rootScope.$state       = $state;
        $rootScope.$stateParams = $stateParams;

        var userId = "041562ddce22f56c2087e6f1";

        UserBoxService.setUserId(userId);

    }