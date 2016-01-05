angular.module('beetleLoop')
    .directive('fileUpload', fileUpload);

    function fileUpload () {
        var directive = {
            controller: FileUploadController,
            controllerAs: 'fileUpCtrl',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'components/fileUpload/fileUpload.tpl.html'
        };

        return directive;

        function link(scope, elem, attribs, ctrl) {

        }
    }

    FileUploadController.$inject = ['$base64',
                                    '$window',
                                    'MongoRxService',
                                    'ProjectBoxService'];

    function FileUploadController($base64, $window, MongoRxService, ProjectBoxService) {

        // this context projection
        var vm = this;

        vm.siteId = ProjectBoxService.getSiteId();

        // Configure MongoDB reactive API
/*        vm.mongoRx.observe({
            changed: function (newDocument, oldDocument) {
                if (newDocument.cssFiles.length !== oldDocument.cssFiles.length) {
                    vm.recentCssFiles = newDocument.cssFiles;
                    updateCssObject(newDocument);
                }
            }
        });
*/

        vm.uploadFiles = function() {

            var uploadedCssFiles = [],
                files = vm.cssFileCollection;

            angular.forEach(files, function(value, key){
                var css_id = new Meteor.Collection.ObjectID().toHexString();

                if (value.type === "") {
                    value.type = "text/scss";
                }

                uploadedCssFiles.push({
                    "css_id":css_id,
                    "name":value.name,
                    "style":value.body,
                    "fileType":value.type,
                    "updatedAt":value.updatedAt
                });

            });

            if (vm.recentCssFiles.length === 0 ) {

                vm.recentCssFiles = uploadedCssFiles;

                updateProjectCss = {
                    cssFiles: uploadedCssFiles
                };

                ProjectBoxService.updateProject(vm.projectId, updateProjectCss);
            } else {
                // prevent identical file uploads
                angular.forEach(vm.recentCssFiles, function(cssFile) {
                    angular.forEach(uploadedCssFiles, function(val, key) {
                        if (val.name === cssFile.name) {
                            uploadedCssFiles.splice(key, 1);
                            console.warn("duplicate removed");
                            // NEED TO THROW A WARNING IN THE UI
                        }
                    });
                });

                // push each member of the now purified uploadedCssFiles array into project object
                angular.forEach(uploadedCssFiles, function(cssFile){
                    vm.recentCssFiles.push(cssFile);
                });

                updateProjectCss = {
                    cssFiles: vm.recentCssFiles
                };

                ProjectBoxService.updateProject(vm.projectId, updateProjectCss);
            }

            // Reset upload form object
            vm.cssFileCollection = "";
            vm.cssFileCollection.upload = "";

        };

        vm.removeCssFile = function(targetFile) {
            var targetIndex;

            angular.forEach(vm.recentCssFiles, function(file){
                if (file.name === targetFile.name) {
                    targetIndex = vm.recentCssFiles.indexOf(file);
                    return;
                }
            });

            if (targetIndex > -1) {
                vm.recentCssFiles.splice(targetIndex, 1);

                if (vm.recentCssFiles.length > 0) {
                    updateProjectCss = {
                        cssFiles: vm.recentCssFiles
                    };
                } else {
                    updateProjectCss = {
                        cssFiles: []
                    };                   
                }
            }

            ProjectBoxService.updateProject(vm.projectId, updateProjectCss);
        };

        vm.removeAllCssFiles = function() {
            // add button
        };

        // Handle SCSS
        function updateScssInjectionFile(newDocument, oldDocument) {
            /* 1) $base64.decode(cssFile content)
               2) write node API & use it to call node-sass, or use sass.js, to compile .sass/.scss
                  to .css
                  reference: https://github.com/sass/node-sass
               3) break out rules individually and add to array
               4) Party.
            */ 
        }

        // Handle regular CSS
        function updateCssObject (newDocument) {
            var injectStyles = [],
                separator = "}";

            // parse the file as one big line and insert the entire thing - why do it line by line?!

            if (newDocument.cssFiles.length > 0) {
                angular.forEach(newDocument.cssFiles, function(cssFile) {
                    var cssFileRules = cssFile.style.split(separator);
                    angular.forEach(cssFileRules, function(cssRule) {
                        if (cssRule.length > 0) {
                            cssRule = cssRule + "}";
                            injectStyles.push(".renderWindow " + cssRule + "\n");
                        }
                    });
                });
            } 

            MongoRxService.setTemplateCss(currentTemplateId, injectStyles);
            pushContentToDatabase(injectStyles);

        }

        function pushContentToDatabase(content) {
            var storedTemplates = [],
                currentProject  = ProjectBoxService.getProject();

            MongoRxService.setProjectData(currentProject);

            angular.forEach(currentProject.templates, function(template) {
                if (template.template_id === currentTemplateId) {
                    var updatedTemplate = {
                        template_id:template.template_id,
                        markup:template.markup,
                        currentCss:content,
                        attribs:template.attribs,
                        css_ids:template.css_ids,
                        image_ids:template.image_ids,
                        js_ids:template.js_ids
                    };
                    storedTemplates.push(updatedTemplate);
                } else {
                    storedTemplates.push(template);
                }

                ProjectBoxService.updateProject(vm.projectId, {templates:storedTemplates});
            });
        }

    }