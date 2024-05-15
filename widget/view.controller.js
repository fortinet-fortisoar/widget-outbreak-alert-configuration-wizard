/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('outbreakAlertConfiguration200Ctrl', outbreakAlertConfiguration200Ctrl);

    outbreakAlertConfiguration200Ctrl.$inject = ['$scope', '$http', 'WizardHandler', '$controller', '$state', 'connectorService', 'marketplaceService', 'CommonUtils', '$window', 'toaster', 'currentPermissionsService', '_', '$resource', 'API', 'ALL_RECORDS_SIZE', 'widgetBasePath', '$rootScope', 'SchedulesService', '$timeout'];

    function outbreakAlertConfiguration200Ctrl($scope, $http, WizardHandler, $controller, $state, connectorService, marketplaceService, CommonUtils, $window, toaster, currentPermissionsService, _, $resource, API, ALL_RECORDS_SIZE, widgetBasePath, $rootScope, SchedulesService, $timeout) {
        $controller('BaseConnectorCtrl', {
            $scope: $scope
        });
        $scope.processingPicklist = false;
        $scope.processingConnector = false;
        $scope.selectHuntTool = selectHuntTool;
        $scope.triggerSchedule = triggerSchedule;
        $scope.backStartPage = backStartPage;
        $scope.configHuntTool = configHuntTool;
        $scope.onlyNumbers = '^0*[1-9][0-9]*\d*$';
        $scope.backSelectHuntTools = backSelectHuntTools;
        $scope.threatHuntSchedule = threatHuntSchedule;
        $scope.backThreatHuntConfig = backThreatHuntConfig;
        $scope.backThreatHuntSchedule = backThreatHuntSchedule;
        $scope.moveToFinish = moveToFinish;
        $scope.close = close;
        $scope.saveConnector = saveConnector;
        $scope.loadActiveTab = loadActiveTab;
        $scope.toggle = [];
        $scope.toggleRemediation = true;
        $scope.toggleConnectorConfig = [];
        $scope.toggleRemediationConfig = false;
        $scope.toggleAdvancedSettings = toggleAdvancedSettings;
        $scope.toggleConnectorConfigSettings = toggleConnectorConfigSettings;
        $scope.backNotification = backNotification;
        $scope.nextNotification = nextNotification;
        $scope.isLightTheme = $rootScope.theme.id === 'light';
        $scope.widgetBasePath = widgetBasePath;
        $scope.startInfoGraphics = $scope.isLightTheme ? widgetBasePath + 'images/start-light.svg' : widgetBasePath + 'images/start-dark.svg';
        $scope.selectThreadHuntTool = $scope.isLightTheme ? widgetBasePath + 'images/select-threat-hunt-tool-light.svg' : widgetBasePath + 'images/select-threat-hunt-tool-dark.svg';
        $scope.threatHuntToolConfig = $scope.isLightTheme ? widgetBasePath + 'images/threat-hunt-config-light.svg' : widgetBasePath + 'images/threat-hunt-config-dark.svg';
        $scope.outbreakSettings = $scope.isLightTheme ? widgetBasePath + 'images/remediation-light.svg' : widgetBasePath + 'images/remediation-dark.svg';
        $scope.threatTuntSchedule = $scope.isLightTheme ? widgetBasePath + 'images/threat-hunt-schedule-light.svg' : widgetBasePath + 'images/threat-hunt-schedule-dark.svg';
        $scope.finishInfoGraphics = widgetBasePath + 'images/finish.png';
        $scope.widgetCSS = widgetBasePath + 'widgetAsset/wizard-style.css';
        $controller('BaseConnectorCtrl', {
            $scope: $scope
        });
        $scope.autoInstall = {
            enabled: true
        };
        $scope.selectedEnv = {
            huntTools: [],
            installOutbreakType: [],
            threatHuntToolsParams: {
                fazParams: null,
                fsmParams: null,
                qRadarParams: null,
                splunkParams: null
            },
            timeFrameDays: null,
            emailAddress: null,
            scheduleFrequency: null
        };
        $scope.severityValues = ['Critical', 'High', 'Medium'];
        $scope.$watch('activeTab', function ($newTab, $oldTab) {
            if (!$oldTab) {
                // skip first run
                return;
            }
            $state.go('.', {
                tab: $scope.selectedEnv.huntTools[0].itemValue
            }, {
                notify: false,
                location: 'replace'
            });
        });

        $scope.$on('scheduleDetails', function (event, data) {
            $scope.scheduleStatus = data.status;
            $scope.scheduleID = data.scheduleId;
            $scope.selectedEnv.scheduleFrequency = data.scheduleFrequency;
        });

        function triggerSchedule() {
            SchedulesService.triggerSchedule({ id: $scope.scheduleID }).then(function () {
                toaster.success({
                    body: 'Schedule triggered successfully.'
                });
            }, function (error) {
                toaster.error({
                    body: error.data.message || error.data.detail || 'Error while running schedule.'
                });
            });
        }

        function toggleAdvancedSettings(index) {
            $scope.toggle[index] = !$scope.toggle[index];
        }

        function toggleConnectorConfigSettings(index) {
            $scope.toggleConnectorConfig[index] = !$scope.toggleConnectorConfig[index];
        }

        function loadActiveTab(tabIndex, tabName) {
            if (tabIndex !== 0) {
                $scope.$broadcast('cs:getList');
            }
            $scope.activeTab = tabIndex === undefined ? 0 : tabIndex;
            if (tabIndex === undefined) {
                var selectedHuntTool = $scope.selectedEnv.huntTools[0];
                var huntToolName = _.get($scope.huntToolsMapping, selectedHuntTool);
                if ($scope.formHolder.connectorForm && $scope.formHolder.connectorForm.$dirty) {
                    $scope.formHolder.connectorForm.$dirty = false;
                }

                _fetchConnectorConfig(huntToolName);
            }
            else {
                var huntToolName = _.get($scope.huntToolsMapping, tabName);
                if ($scope.formHolder.connectorForm && $scope.formHolder.connectorForm.$dirty) {
                    $scope.formHolder.connectorForm.$dirty = false;
                }
                _fetchConnectorConfig(huntToolName);
            }
        }

        function configHuntTool() {
            var queryBody = {
                "logic": "AND",
                "filters": [
                    {
                        "type": "primitive",
                        "field": "key",
                        "value": "outbreak-threat-hunt-tools-params",
                        "operator": "eq",
                        "_operator": "eq"
                    }
                ]
            };
            var queryString = {
                $limit: ALL_RECORDS_SIZE
            };
            $resource(API.QUERY + 'keys').save(queryString, queryBody).$promise.then(function (response) {
                if (response['hydra:member'] && response['hydra:member'].length > 0) {
                    $scope.threatHuntToolsParams = response['hydra:member'][0].jSONValue;
                    for (let index = 0; index < $scope.selectedEnv.huntTools.length; index++) {
                        $scope.toggle[index] = true;
                        $scope.toggleConnectorConfig[index] = false;
                    }
                    loadActiveTab($state.params.tabIndex, $state.params.tab);
                    WizardHandler.wizard('OutbreaksolutionpackWizard').next();
                }
                else {
                    toaster.error({
                        body: 'Threat Hunt Tool parameters is not found in Key-Store'
                    });
                    return;
                }
            });
        }

        function close() {
            $timeout(function () { $window.location.reload(); }, 3000);
            $state.go('main.modules.list', { module: 'outbreak_alerts' }, { reload: true });
            $scope.$parent.$parent.$parent.$ctrl.handleClose();
        }

        function selectHuntTool() {
            $scope.processingPicklist = true;
            var queryBody = {
                "logic": "AND",
                "filters": [
                    {
                        "type": "primitive",
                        "field": "key",
                        "value": "outbreak-threat-hunt-tools",
                        "operator": "eq",
                        "_operator": "eq"
                    }
                ]
            };
            var queryString = {
                $limit: ALL_RECORDS_SIZE
            };
            $resource(API.QUERY + 'keys').save(queryString, queryBody).$promise.then(function (response) {
                if (response['hydra:member'] && response['hydra:member'].length > 0) {
                    $scope.processingPicklist = false;
                    $scope.huntToolsMapping = response['hydra:member'][0].jSONValue;
                    $scope.threatHuntTools = Object.keys($scope.huntToolsMapping).sort();
                    WizardHandler.wizard('OutbreaksolutionpackWizard').next();
                }
                else {
                    toaster.error({
                        body: 'Threat Hunt Tool is not found in Key-Store'
                    });
                    return;
                }
            });

        }

        function _fetchConnectorConfig(connectorName) {
            var queryBody = {
                "logic": "AND",
                "filters": [
                    {
                        "field": "name",
                        "operator": "in",
                        "value": connectorName
                    }
                ]
            };
            $resource(API.QUERY + 'solutionpacks').save({ $limit: ALL_RECORDS_SIZE }, queryBody).$promise.then(function (response) {
                if (response['hydra:member'] || response['hydra:member'].length > 0) {
                    var huntToolDetails = _.map(response['hydra:member'], obj => _.pick(obj, ['name', 'label', 'version', 'uuid']));
                    _loadConnectorDetails(huntToolDetails[0].name, huntToolDetails[0].version, huntToolDetails[0]);
                }
            });
        }

        function _loadConnectorDetails(connectorName, connectorVersion, sourceControl) {
            $scope.processingConnector = true;
            $scope.configuredConnector = false;
            $scope.isConnectorHealthy = false;
            connectorService.getConnector(connectorName, connectorVersion).then(function (connector) {
                marketplaceService.getContentDetails(API.BASE + 'solutionpacks/' + sourceControl.uuid + '?$relationships=true').then(function (response) {
                    $scope.contentDetail = response.data;
                    if (connector.configuration.length > 0) {
                        $scope.isConnectorConfigured = true;
                        connectorService.getConnectorHealth(response.data, connector.configuration[0].config_id, connector.configuration[0].agent).then(function (data) {
                            if (data.status === "Available") {
                                $scope.isConnectorHealthy = true;
                            }
                        });
                    }
                    else {
                        $scope.isConnectorConfigured = false;
                    }
                });
                if (!connector) {
                    toaster.error({
                        body: 'The Connector "' + connectorName + '" is not installed. Install the connector and re-run this wizard to complete the configuration'
                    });
                    return;
                }
                $scope.selectedConnector = connector;
                $scope.loadConnector($scope.selectedConnector, false, false);
                $scope.processingConnector = false;
            });
        }

        function saveConnector(saveFrom) {
            $scope.isConnectorConfigured = true;
            $scope.configuredConnector = false;
            var data = angular.copy($scope.connector);
            if (CommonUtils.isUndefined(data)) {
                $scope.statusChanged = false;
                return;
            }
            if (!currentPermissionsService.availablePermission('connectors', 'update')) {
                $scope.statusChanged = false;
                return;
            }
            var newConfiguration, newConfig, deleteConfig;
            newConfiguration = false;
            if (saveFrom !== 'deleteConfigAndSave') {
                if (!_.isEmpty($scope.connector.config_schema)) {
                    if (!$scope.validateConfigurationForm()) {
                        return;
                    }
                }
                if (!$scope.input.selectedConfiguration.id) {
                    newConfiguration = true;
                    $scope.input.selectedConfiguration.config_id = $window.UUID.generate();
                    if ($scope.input.selectedConfiguration.default) {
                        angular.forEach(data.configuration, function (configuration) {
                            if (configuration.config_id !== $scope.input.selectedConfiguration.config_id) {
                                configuration.default = false;
                            }
                        });
                    }
                    data.configuration.push($scope.input.selectedConfiguration);
                    newConfig = $scope.input.selectedConfiguration;
                }
                delete data.newConfig;
            }
            if (saveFrom === 'deleteConfigAndSave') {
                $scope.isConnectorConfigured = false;
                deleteConfig = true;
                $scope.isConnectorHealthy = false;
            }
            var updateData = {
                connector: data.id,
                name: $scope.input.selectedConfiguration.name,
                config_id: $scope.input.selectedConfiguration.config_id,
                id: $scope.input.selectedConfiguration.id,
                default: $scope.input.selectedConfiguration.default,
                config: {},
                teams: $scope.input.selectedConfiguration.teams
            };
            $scope.saveValues($scope.input.selectedConfiguration.fields, updateData.config);
            $scope.processing = true;
            connectorService.updateConnectorConfig(updateData, newConfiguration, deleteConfig).then(function (response) {
                if (newConfig) {
                    $scope.connector.configuration.push(newConfig);
                    if (newConfig.default) {
                        $scope.removeDefaultFromOthers();
                    }
                }
                $scope.formHolder.connectorForm.$setPristine();
                if (!deleteConfig) {
                    $scope.input.selectedConfiguration.id = response.id;
                    $scope.configuredConnector = true;
                    $scope.isConnectorHealthy = true;
                }
                $scope.checkHealth();
                $scope.statusChanged = false;
            }, function (error) {
                toaster.error({
                    body: error.data.message ? error.data.message : error.data['hydra:description']
                });
            }).finally(function () {
                $scope.processing = false;
            });
        }

        function backNotification() {
            WizardHandler.wizard('OutbreaksolutionpackWizard').previous();
        }

        function nextNotification(threatHuntConfigForm) {
            if (threatHuntConfigForm.fazForm !== undefined && threatHuntConfigForm.fazForm.$invalid) {
                toaster.error({
                    body: 'Fortinet FortiAnalyzer Threat Hunt Tool parameters are required'
                });
                return;
            } else if (threatHuntConfigForm.fsmForm !== undefined && threatHuntConfigForm.fsmForm.$invalid) {
                toaster.error({
                    body: 'Fortinet FortiSIEM Threat Hunt Tool parameters are required'
                });
                return;
            }
            else if (threatHuntConfigForm.qradarForm !== undefined && threatHuntConfigForm.qradarForm.$invalid) {
                toaster.error({
                    body: 'IBM QRadar Threat Hunt Tool parameters are required'
                });
                return;
            } else if (threatHuntConfigForm.splunkForm !== undefined && threatHuntConfigForm.splunkForm.$invalid) {
                toaster.error({
                    body: 'Splunk Threat Hunt Tool parameters are required'
                });
                return;
            } else {
                $scope.selectedEnv.installOutbreakType = $scope.severityValues.slice();
                WizardHandler.wizard('OutbreaksolutionpackWizard').next();
            }
        }

        function moveToFinish(installationForm) {
            if (installationForm.notificationForm.$invalid) {
                installationForm.notificationForm.fromEmailAddressa.$touched = true;
                installationForm.notificationForm.fromEmailAddressa.$untouched = false;
                installationForm.notificationForm.fromEmailAddressa.$dirty = true;
                return;
            }
            WizardHandler.wizard('OutbreaksolutionpackWizard').next();
            triggerPlaybook();
        }

        function threatHuntSchedule(scheduleForm) {
            if (scheduleForm.threatHuntWindowForm.$invalid) {
                scheduleForm.threatHuntWindowForm.timeFrameDays.$touched = true;
                scheduleForm.threatHuntWindowForm.timeFrameDays.$untouched = false;
                scheduleForm.threatHuntWindowForm.timeFrameDays.$dirty = true;
                return;
            }
            WizardHandler.wizard('OutbreaksolutionpackWizard').next();
        }

        function backStartPage() {
            WizardHandler.wizard('OutbreaksolutionpackWizard').previous();
        }

        function backThreatHuntSchedule() {
            WizardHandler.wizard('OutbreaksolutionpackWizard').previous();
        }

        function backSelectHuntTools() {
            WizardHandler.wizard('OutbreaksolutionpackWizard').previous();
        }

        function backThreatHuntConfig() {
            var selectedHuntTool = $scope.selectedEnv.huntTools[0].itemValue;
            loadActiveTab(1, selectedHuntTool);
            WizardHandler.wizard('OutbreaksolutionpackWizard').previous();
        }

        function triggerPlaybook() {
            var queryPayload =
            {
                "request": $scope.selectedEnv
            }
            var queryUrl = API.MANUAL_TRIGGER + '906d2c36-8c7e-4fb6-ba06-6311fbefcf02';
            $http.post(queryUrl, queryPayload).then(function (response) {
                console.log(response);
            });
        }
    }
})();