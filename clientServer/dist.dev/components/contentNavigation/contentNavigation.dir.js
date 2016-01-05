angular.module('beetleLoop')
    .directive('contentNavigation', contentNavigation);

    function contentNavigation() {
        var directive = {
            bindToController: {
                updatedRoute:"="
            },
            controller: ContentNavigationController,
            controllerAs: 'contentNavCtrl',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'components/contentNavigation/contentNavigation.tpl.html'
        };

        return directive;

        function link(scope, elem, attribs) {

        }
    }

    ContentNavigationController.$inject = ['$state',
                                           'MongoRxService',
                                           'ProjectBoxService'];

    function ContentNavigationController($state, MongoRxService, ProjectBoxService) {
        // this context projection
        var vm = this;

        vm.siteList = false;
        vm.pageList = false;

        if (typeof vm.updatedRoute.project_id !== 'undefined') {
            vm.siteList = true;
            ProjectBoxService.getAllSites().then(function(sites) {
                vm.contentCollection = sites;
            });
        } else if (typeof vm.updatedRoute.site_id !== 'undefined') {
            vm.pageList = true;
            ProjectBoxService.getAllPages(vm.updatedRoute.site_id).then(function(pages) {
                vm.contentCollection = pages;
            });
        }


        vm.boxClick = function(id) {
            if (vm.siteList) {
                $state.go('beetleLoop.site',{siteId:id});
            } else if (vm.pageList) {
                $state.go('beetleLoop.page',{pageId:id});
            }
        };
    }