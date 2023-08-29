'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('outbreakAlertConfiguration100Ctrl', outbreakAlertConfiguration100Ctrl);

        outbreakAlertConfiguration100Ctrl.$inject = ['$scope', 'Entity', '$http', 'WizardHandler', '$controller'];

    function outbreakAlertConfiguration100Ctrl($scope, Entity, $http, WizardHandler, $controller) {
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
    $scope.selectedEnv = {};
      
    function close(){
        triggerPlaybook();
        $scope.$parent.$parent.$parent.$ctrl.handleClose();
    }

    function moveNext() {
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