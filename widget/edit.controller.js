/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editOutbreakAlertConfiguration101Ctrl', editOutbreakAlertConfiguration101Ctrl);

    editOutbreakAlertConfiguration101Ctrl.$inject = ['$scope', '$uibModalInstance', 'config'];

    function editOutbreakAlertConfiguration101Ctrl($scope, $uibModalInstance, config) {
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
