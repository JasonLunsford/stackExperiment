angular.module('beetleLoop')
    .directive('previewWindow', previewWindow);

    previewWindow.$inject = ['$sce', 'MongoRxService'];

    function previewWindow($sce, MongoRxService) {
        var directive = {
            bindToController: {
                updatedRoute:"="
            },
            controller: PreviewWindowController,
            controllerAs: 'previewCtrl',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'components/previewWindow/previewWindow.tpl.html'
        };

        return directive;

        function link(scope, elem, attribs, ctrl) {
            // Configure MongoDB reactive API
/*            ctrl.mongoRx.observe({
                changed: function (newDocument, oldDocument) {
                    angular.forEach(newDocument.templates, function(template) {
                        if (template.currentCss && template.currentCss.length >= 0) {
                            getFreshCss();
                        }
                    });
                    updatePreviewWindowContent(newDocument);
                }
            });*/

            var previewArea = angular.element(elem);

            previewArea.on('click', function(evt) {
                var target = angular.element(evt.target);

                if (target.attr('data-magnolia-area')) {
                    target.removeAttr('data-magnolia-area');
                } else {
                    target.attr('data-magnolia-area', true);
                }

                target.toggleClass("bl-ui-outline");

                //ctrl.pushContentToDatabase(elem[0].innerHTML);
            });

            // Grab fresh CSS when upload detected
            function getFreshCss() {
                if (typeof MongoRxService.getTemplateCss() !== "undefined") {
                    var freshCss = MongoRxService.getTemplateCss().templateCss;
                    ctrl.createCssNode(freshCss);
                }
            }

            // Update Preview Window when update detected
            function updatePreviewWindowContent(newDocument) {
                if (typeof newDocument !== "undefined") {
                    ctrl.previewWindowContent = $sce.trustAsHtml(newDocument.templates[0].markup);
                }
            }


        }
    }

    PreviewWindowController.$inject = ['$sce',
                                       'MongoRxService',
                                       'ProjectBoxService'];

    function PreviewWindowController($sce, MongoRxService, ProjectBoxService) {

        // this context projection
        var vm = this;

        // Define virtual DOM style elements
        var cssNode,
            cssNodeSheet;

        // Find current page from returned collection, push fresh content into place
        var handle = MongoRxService.rxDocument(vm.updatedRoute.project_id).observeChanges({
            changed: function(id, fields) {
                fields.pages.map(function(page) {
                    if (page.page_id === vm.updatedRoute.page_id) {
                        vm.previewWindowContent = $sce.trustAsHtml(page.page_content.join('\n'));
                    }
                });
            }
        });

        // Initialize module
        ProjectBoxService.getPage(vm.updatedRoute.page_id).then(function(data) {
            vm.previewWindowContent = $sce.trustAsHtml(data[0].page_content.join('\n'));
        });

        // Update virtual style DOM node
        vm.createCssNode = function(cssContent, initialize) {
            if (arguments[1] && arguments[1] === true) {
                // Create node in memory, attach to DOM & configure
                cssNode = document.createElement('style');
                document.head.appendChild(cssNode);
            } else {
                // Purge old node from memory & clear variable
                document.head.removeChild(cssNode);
                cssNode = "";

                // Recreate node in memory, attach to DOM & configure
                cssNode = document.createElement('style');
                document.head.appendChild(cssNode);
            }

            // Configure title property and define sheet variable
            cssNode.title = "beetleLoop PreviewWindow Styles";
            cssNodeSheet = cssNode.sheet;

            // Attach new CSS rules
            angular.forEach(cssContent, function(cssRule) {
                cssNodeSheet.insertRule(cssRule, 0);
            });
        };

        //vm.createCssNode(currentCss, true);

        vm.pushContentToDatabase = function(content) {
            var storedTemplates = [],
                currentProject  = ProjectBoxService.getProjectNoPromise();

            MongoRxService.setProjectData(currentProject);

            angular.forEach(currentProject.templates, function(template) {
                if (template.template_id === currentTemplateId) {
                    var updatedTemplate = {
                        template_id:template.template_id,
                        markup:content,
                        currentCss:template.currentCss,
                        attribs:template.attribs,
                        css_ids:template.css_ids,
                        image_ids:template.image_ids,
                        js_ids:template.js_ids
                    };
                    storedTemplates.push(updatedTemplate);
                } else {
                    storedTemplates.push(template);
                }
            });

            ProjectBoxService.updateProject(vm.projectId, {templates:storedTemplates});
        };

        // need a functions that will:
        // * listen for mouse clicks
        // * generate a unique ID for clicked element
        // * assign ID, plus custom attribute, to the element, save to the DB and trigger a refresh

    }