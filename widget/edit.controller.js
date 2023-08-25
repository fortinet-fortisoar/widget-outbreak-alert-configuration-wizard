'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editOutbreakAlertConfiguration100Ctrl', editOutbreakAlertConfiguration100Ctrl);

    editOutbreakAlertConfiguration100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config'];

    function editOutbreakAlertConfiguration100Ctrl($scope, $uibModalInstance, config) {
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            $uibModalInstance.close($scope.config);
        }

    }
})();
