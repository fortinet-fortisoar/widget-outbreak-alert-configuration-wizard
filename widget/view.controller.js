/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('outbreakAlertConfiguration200Ctrl', outbreakAlertConfiguration200Ctrl);

    outbreakAlertConfiguration200Ctrl.$inject = ['$scope', '$http', 'WizardHandler', '$controller', '$state', 'connectorService', 'marketplaceService', 'CommonUtils', '$window', 'toaster', 'currentPermissionsService', '_', '$resource', 'API', 'ALL_RECORDS_SIZE', 'widgetBasePath', '$rootScope', 'SchedulesService', '$timeout', 'widgetUtilityService'];

    function outbreakAlertConfiguration200Ctrl($scope, $http, WizardHandler, $controller, $state, connectorService, marketplaceService, CommonUtils, $window, toaster, currentPermissionsService, _, $resource, API, ALL_RECORDS_SIZE, widgetBasePath, $rootScope, SchedulesService, $timeout, widgetUtilityService) {
        $controller('BaseConnectorCtrl', {
            $scope: $scope
        });
        $scope.processingPicklist = false;
        $scope.processingConnector = false;
        $scope.selectHuntTool = selectHuntTool;
        $scope.triggerAutoInstallOutbreaksPlaybook = triggerAutoInstallOutbreaksPlaybook;
        $scope.backStartPage = backStartPage;
        $scope.configHuntTool = configHuntTool;
        $scope.onlyNumbers = '^0*[1-9][0-9]*\d*$';
        $scope.backSelectHuntTools = backSelectHuntTools;
        $scope.threatHuntSchedule = threatHuntSchedule;
        $scope.backThreatHuntConfig = backThreatHuntConfig;
        $scope.backThreatHuntSchedule = backThreatHuntSchedule;
        $scope.cancel = cancel;
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
        $scope.widgetCSS = widgetBasePath + 'widgetAssets/wizard-style.css';
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
        $scope.outbreakAlertSeverityList = ['Critical', 'High', 'Medium'];
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
                $scope.selectedEnv.installOutbreakType = $scope.outbreakAlertSeverityList.slice();
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

        function triggerAutoInstallOutbreaksPlaybook() {
            var installOutbreakType = _.map($scope.selectedEnv.installOutbreakType, item => item + "_Severity_Outbreak_Alert");
            var queryPayload =
            {
                "request": {'outbreak_types': installOutbreakType}
            }
            var queryUrl = API.MANUAL_TRIGGER + '7d924203-e5e3-4ce5-b704-e8f3283c7b92';
            $http.post(queryUrl, queryPayload).then(function (response) {
                toaster.success({
                                 body: 'Auto install oubtreak alert playbook triggered successfully.'
                         });
            });
        }

        //provide i18n support
        function _handleTranslations() {
            let widgetData = {
                name: $scope.config.name,
                version: $scope.config.version
            };
            let widgetNameVersion = widgetUtilityService.getWidgetNameVersion(widgetData);
            if (widgetNameVersion) {
                widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
                    $scope.viewWidgetVars = {
                        // Create your translating static string variables here
                        START_PAGE_WZ_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.START_PAGE_WZ_TITLE'),
                        LABEL_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.LABEL_TITLE'),
                        START_PAGE_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.START_PAGE_TITLE'),
                        START_PAGE_DISCRIPTION: widgetUtilityService.translate('outbreakAlertConfiguration.START_PAGE_DISCRIPTION'),
                        START_PAGE_Button: widgetUtilityService.translate('outbreakAlertConfiguration.START_PAGE_Button'),

                        SECOND_PAGE_WZ_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.SECOND_PAGE_WZ_TITLE'),
                        SECOND_PAGE_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.SECOND_PAGE_TITLE'),
                        SECOND_PAGE_DISCRIPTION: widgetUtilityService.translate('outbreakAlertConfiguration.SECOND_PAGE_DISCRIPTION'),
                        SECOND_PAGE_BACK: widgetUtilityService.translate('outbreakAlertConfiguration.SECOND_PAGE_BACK'),
                        SECOND_PAGE_NEXT: widgetUtilityService.translate('outbreakAlertConfiguration.SECOND_PAGE_NEXT'),

                        THIRD_PAGE_WZ_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_WZ_TITLE'),
                        THIRD_PAGE_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_TITLE'),
                        THIRD_PAGE_TOGGLE_CONFIG: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_TOGGLE_CONFIG'),
                        THIRD_PAGE_TOGGLE_PARAMS: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_TOGGLE_PARAMS'),
                        THIRD_PAGE_FAZ_PARAMS: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_FAZ_PARAMS'),
                        THIRD_PAGE_FSM_PARAMS: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_FSM_PARAMS'),
                        THIRD_PAGE_QRADAR_PARAMS: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_QRADAR_PARAMS'),
                        THIRD_PAGE_SPLUNK_PARAMS: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_SPLUNK_PARAMS'),
                        THIRD_PAGE_BACK: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_BACK'),
                        THIRD_PAGE_NEXT: widgetUtilityService.translate('outbreakAlertConfiguration.THIRD_PAGE_NEXT'),

                        FOURTH_PAGE_WZ_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_WZ_TITLE'),
                        FOURTH_PAGE_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_TITLE'),
                        FOURTH_PAGE_SECTION_1_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_1_TITLE'),
                        FOURTH_PAGE_SECTION_1_DISCRIPTION: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_1_DISCRIPTION'),
                        FOURTH_PAGE_SECTION_1_PARAM_1: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_1_PARAM_1'),
                        FOURTH_PAGE_SECTION_1_PARAM_2: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_1_PARAM_2'),
                        FOURTH_PAGE_SECTION_1_TOOLTIP_1: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_1_TOOLTIP_1'),
                        FOURTH_PAGE_SECTION_1_TOOLTIP_2: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_1_TOOLTIP_2'),
                        FOURTH_PAGE_SECTION_2_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_2_TITLE'),
                        FOURTH_PAGE_SECTION_2_DISCRIPTION: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_SECTION_2_DISCRIPTION'),
                        FOURTH_PAGE_BACK: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_BACK'),
                        FOURTH_PAGE_NEXT: widgetUtilityService.translate('outbreakAlertConfiguration.FOURTH_PAGE_NEXT'),

                        FIFTH_PAGE_WZ_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_WZ_TITLE'),
                        FIFTH_PAGE_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_TITLE'),
                        FIFTH_PAGE_SECTION_1_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_1_TITLE'),
                        FIFTH_PAGE_SECTION_1_CHECKBOX: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_1_CHECKBOX'),
                        FIFTH_PAGE_SECTION_1_HEADING: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_1_HEADING'),
                        FIFTH_PAGE_SECTION_1_DISCRIPTION: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_1_DISCRIPTION'),
                        FIFTH_PAGE_SECTION_2_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_2_TITLE'),
                        FIFTH_PAGE_SECTION_2_DISCRIPTION: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_2_DISCRIPTION'),
                        FIFTH_PAGE_SECTION_2_EMAIL: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_2_EMAIL'),
                        FIFTH_PAGE_SECTION_2_EMAIL_TOOLTIP: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_2_EMAIL_TOOLTIP'),
                        FIFTH_PAGE_SECTION_2_EMAIL_VALIDATION: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_SECTION_2_EMAIL_VALIDATION'),
                        FIFTH_PAGE_BACK: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_BACK'),
                        FIFTH_PAGE_NEXT: widgetUtilityService.translate('outbreakAlertConfiguration.FIFTH_PAGE_NEXT'),

                        SIXTH_PAGE_WZ_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_WZ_TITLE'),
                        SIXTH_PAGE_TITLE: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_TITLE'),
                        SIXTH_PAGE_DISCRIPTION_1: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_DISCRIPTION_1'),
                        SIXTH_PAGE_DISCRIPTION_2_1: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_DISCRIPTION_2_1'),
                        SIXTH_PAGE_DISCRIPTION_2_2: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_DISCRIPTION_2_2'),
                        SIXTH_PAGE_DISCRIPTION_2_3: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_DISCRIPTION_2_3'),
                        SIXTH_PAGE_SUMMARY: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY'),
                        SIXTH_PAGE_SUMMARY_HEADING_1: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_1'),
                        SIXTH_PAGE_SUMMARY_HEADING_2: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_2'),
                        SIXTH_PAGE_SUMMARY_HEADING_3: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_3'),
                        SIXTH_PAGE_SUMMARY_HEADING_4: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_4'),
                        SIXTH_PAGE_SUMMARY_HEADING_5: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_5'),
                        SIXTH_PAGE_SUMMARY_HEADING_5_1: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_5_1'),
                        SIXTH_PAGE_SUMMARY_HEADING_6: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_6'),
                        SIXTH_PAGE_AUTO_INSTALL_HEADING_1: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_SUMMARY_HEADING_6'),
                        SIXTH_PAGE_AUTO_INSTALL_HEADING_2: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_AUTO_INSTALL_HEADING_2'),
                        SIXTH_PAGE_AUTO_INSTALL_BUTTON_LABEL: widgetUtilityService.translate('outbreakAlertConfiguration.SIXTH_PAGE_AUTO_INSTALL_BUTTON_LABEL'),
                        
                        DIRECTIVE_CRON_VALUE: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_CRON_VALUE'),
                        DIRECTIVE_MINUTE_LABEL: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_MINUTE_LABEL'),
                        DIRECTIVE_HOUR_LABEL: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_HOUR_LABEL'),
                        DIRECTIVE_MONTH_DAY_LABEL: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_MONTH_DAY_LABEL'),
                        DIRECTIVE_MONTH_LABEL: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_MONTH_LABEL'),
                        DIRECTIVE_WEEK_DAY_LABEL: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_WEEK_DAY_LABEL'),
                        DIRECTIVE_TIMEZONE_LABEL: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_TIMEZONE_LABEL'),
                        DIRECTIVE_TIMEZONE_TOOLTIP: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_TIMEZONE_TOOLTIP'),
                        DIRECTIVE_SAVE_BUTTON: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_SAVE_BUTTON'),
                        DIRECTIVE_SAVEING_BUTTON: widgetUtilityService.translate('outbreakAlertConfiguration.DIRECTIVE_SAVEING_BUTTON'),
                    };
                });
            }
            else {
                $timeout(function () {
                    cancel();
                }, 100)
            }
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function init() {
            _handleTranslations();
        }

        init();
    }
})();