'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('outbreakAlertConfiguration100Ctrl', outbreakAlertConfiguration100Ctrl);

        outbreakAlertConfiguration100Ctrl.$inject = ['$q', 'API', '$resource', '$scope', 'Entity', '$http', 'connectorService', 'currentPermissionsService', 
        'WizardHandler', 'toaster', 'CommonUtils', '$controller', '$window', 'Field'];

    function outbreakAlertConfiguration100Ctrl($q, API, $resource, $scope, Entity, $http, connectorService, currentPermissionsService, 
      WizardHandler, toaster, CommonUtils, $controller, $window, Field) {
    $controller('BaseConnectorCtrl', {
      $scope: $scope
    });
    $scope.processingPicklist = false;
    $scope.processingConnector = false;
    $scope.envCompleted = false;
    $scope.close = close;
    $scope.moveNext = moveNext;
    $scope.movePrevious = movePrevious;
    $scope.moveEnvironmentNext = moveEnvironmentNext;
    $scope.envMacro = "threat_hunt_env";
    $scope.selectedEnv = {};
    $scope.formHolder={};
      
    function _loadDynamicVariable(variableName) {
      var defer = $q.defer();
      var dynamicVariable = null;
      $resource(API.WORKFLOW + 'api/dynamic-variable/?offset=0&name='+variableName).get({}, function(data) {
        if (data['hydra:member'].length > 0) {
          dynamicVariable = data['hydra:member'][0].value;
        }
        defer.resolve(dynamicVariable);
      }, function(response) {
        defer.reject(response);
      });
      return defer.promise;
    }
      
    function close(){
        triggerPlaybook();
        $scope.$parent.$parent.$parent.$ctrl.handleClose();
    }

    function moveNext() {
        _loadDynamicVariable($scope.envMacro).then(function(dynamicVariable) {
          if (dynamicVariable !== null ){
            $scope.selectedEnv = {"picklist": JSON.parse(dynamicVariable)};
          }
        });
        $scope.processingPicklist = true;
        var entity = new Entity('outbreak_alerts');
        entity.loadFields().then(function () {
            for (var key in entity.fields) {
                if (entity.fields[key].type === 'picklist' && key === 'threatHuntTools') {
                    $scope.picklistField = entity.fields.threatHuntTools;
                    $scope.processingPicklist = false;
                }
            }
        });
        WizardHandler.wizard('solutionpackWizard').next();
    }
      
    function moveEnvironmentNext() {
        WizardHandler.wizard('solutionpackWizard').next();
    }

    function moveVersionControlNext() {
        WizardHandler.wizard('solutionpackWizard').next();
    }

    function movePrevious() {
        WizardHandler.wizard('solutionpackWizard').previous();
    }
      
    function triggerPlaybook() {
        var queryPayload =
        {
              "request": $scope.selectedEnv
        }
        var queryUrl = '/api/triggers/1/notrigger/906d2c36-8c7e-4fb6-ba06-6311fbefcf02';
        $http.post(queryUrl, queryPayload).then(function (response) {
            console.log(response);
        });
    }
}
})();