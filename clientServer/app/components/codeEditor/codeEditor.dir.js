angular.module('beetleLoop')
    .directive('codeEditor', codeEditor);

    previewWindow.$inject = ['MongoRxService'];

    function codeEditor(MongoRxService) {
        var directive = {
            bindToController: {
                updatedRoute:"="
            },
            controller: CodeEditorController,
            controllerAs: 'codeEditCtrl',
            link: link,
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'components/codeEditor/codeEditor.tpl.html'
        };

        return directive;

        function link(scope, elem, attribs, ctrl) {

        }
    }

    CodeEditorController.$inject = ['$timeout',
                                    'MongoRxService',
                                    'ProjectBoxService'];

    function CodeEditorController($timeout, MongoRxService, ProjectBoxService) {

        // this context projection
        var vm = this;

        ProjectBoxService.getPage(vm.updatedRoute.page_id).then(function(data) {
            vm.aceEditor.insert(data[0].page_content.join('\n'));
        });

        // Instantiate and configure Ace Editor
        vm.projectBoxLoaded = function(lcEditor){
            vm.aceEditor = lcEditor;

            // blocks irritating message in console
            lcEditor.$blockScrolling = Infinity;
            
            // Tease apart session, document, and renderer
            var lcSession = lcEditor.getSession(),
                lcDocument = lcSession.getDocument(),
                lcRenderer = lcEditor.renderer;

            // Configure Editor
            lcEditor.setReadOnly(false);
            lcEditor.setTheme("ace/theme/twilight");

            // Configure Session
            lcSession.setMode('ace/mode/html');
            lcSession.setUndoManager(new ace.UndoManager());

            // Configure Renderer
            lcRenderer.setShowGutter(true);

            // Events
            lcSession.on("change", function(e){
                if (lcEditor.isFocused() === true) {
                    $timeout.cancel(vm.startTimer);

                    vm.startTimer = $timeout(function(){
                        updateDatabase(lcDocument.getAllLines());
                    }, 1000);
                }
            });

        };

        vm.updateTemplate = function() {
            console.log("template array: ", vm.templateArray);
        };

        function updateDatabase(contentArray) {
            vm.templateArray = extractContent(contentArray);

            ProjectBoxService.updatePage(vm.updatedRoute.page_id, contentArray).then(function(data) {
                console.log("Page Update Status: " + data);
            });
        }

        function extractContent(contentArray) {
            return contentArray.map(function(member) {
                return purgedLine(member);
            });
        }

        function purgedLine(member) {
            var _memberArray = member.split(''),
                _garbageFlag = true,
                _purgedArray = [];

            _memberArray.map(function(character) {
                if (character === "<") {
                    _purgedArray.push(character);
                    _garbageFlag = false;
                } else if (character === ">") {
                    _purgedArray.push(character);
                    _garbageFlag = true;    
                } else if (!_garbageFlag) {
                    _purgedArray.push(character);
                }
            });

            return _purgedArray.join('');
        }
    }