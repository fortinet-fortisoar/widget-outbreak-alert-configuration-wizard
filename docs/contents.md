| [Home](../README.md) |
 | -------------------------------------------- |

  # Contents

The **Outbreak Response Framework** solution pack contains the following resources.


## Picklist

|Name|
| :- |
| AlertType |
| Outbreak Alert Severity |
| Rule Type |
| Threat Hunt Tools |
| Ticketing Tools |
| Record Status |

## Module Schema

|Name|Description|
| :- | :- |
| Threat Hunt Rules |  |
| Outbreak Alerts |  |

## Connector

| Name | Description |
| :- | :- |
| Azure Log Analytics | Log Analytics is a tool in the Azure portal that's used to edit and run log queries against data in the Azure Monitor Logs store. This connector facilitates the automated operations related to query and saved searches. |
| Fortinet FortiAnalyzer | FortiAnalyzer is the NOC-SOC security analysis tool built with operations perspective. With action-oriented views and deep drill-down capabilities, FortiAnalyzer not only gives organizations critical insight into threats, but also accurately scopes risk across the attack surface, pinpointing where immediate response is required. |
| Fortinet FortiSIEM | FortiSIEM provides integrations that allow you to query and make changes to the CMDB, query events, and send incident notifications. Provide actions like get incidents, comment incident, cleared incident, get device details, get monitored organizations, report related actions and get all associated events for an incident from FortiSIEM. |
| IBM QRadar | IBM QRadar is an enterprise security information and event management (SIEM) product. Fortinet FortiSOSR connector for IBM QRadar allows user to invoke QRadar API, perform Ariel Queries and operations like Get Offense,related events,update and close offenses. |
| Fortinet FortiGate | Fortinet FortiGate enterprise firewall provide high performance, consolidated advanced security and granular visibility for broad protection across the entire digital attack surface. |
| Jira | Jira Service Desk Connector for issue creating, updating and deleting. |
| NIST National Vulnerability Database | The NIST National Vulnerability Database (NVD) is the U.S. government repository of standards based vulnerability management data represented using the Security Content Automation Protocol (SCAP). This data enables automation of vulnerability management, security measurement, and compliance. The NVD includes databases of security checklist references, security related software flaws, misconfigurations, product names, and impact metrics. |
| ServiceNow | ServiceNow connector provides functionality to create, read, update and delete records of Table and Catalog type |
| Splunk | Splunk connector allows users to invoke search, fetch events to related search, invoke alert actions, update notables, sync splunk users to FortiSOAR etc. |
| ElasticSearch | ElasticSearch is a distributed, RESTful search and analytics engine capable of solving a number of use cases. This connector facilitates automated operations to execute lucene query, get mapping and cluster details. |

## Widgets

| Name | Description |
| :- | :- |
| Outbreak Alert Configuration Wizard | Outbreak Response Framework Configuration Wizard will provide to select the "Threat Detection Integrations" sources to run outbreak response hunt activities and "Ticketing/ITSM Integrations" sources as part of your response or threat management strategy in FortiSOAR |


## Roles

|Name|Description|
| :- | :- |
| Full App Permissions | Essentially the root user, use carefully |




## Playbook Collection

| 10 - SP - Outbreak Response Framework |
|:------------:|

| Playbook Name | Description |
| :- | :- |
| Configure Threat Hunt Integration | Configure the threat hunt integration for outbreak alert |
| Threat Hunting - QRadar - Search Query | Executes an outbreak alert Ariel query on the QRadar server and create FortiSOAR Alert |
| Create IOCs as Threat Intel Feeds | Create the Threat Feeds in Threat Intel Module for the specified outbreak alert IOC's |
| IOC Threat Hunt - Splunk | Performs Splunk IOC Hunting on the specified IOC. |
| Remediation - Block Indicators | Blocks malicious outbreak alert indicators |
| Create Ticket in ITSM Tools | Create the ServiceNow/Jira ticket for the outbreak alert |
| Investigate Outbreaks (Type All) | Investigate all active Outbreak Alert on different SIEM tools, remediate and mitigate |
| Threat Hunting - FortiSIEM - Fetch Associated Events | Retrieves all associated events for a specified incident from the Fortinet FortiSIEM server based on the incident ID |
| Threat Hunting - Splunk - Search Query | Invokes a search on the Splunk server based on the outbreak alert search query |
| IOC Threat Hunt - FortiSIEM | Performs FortiSIEM IOC Hunting on the specified IOC. |
| Stop Outbreak Alert Record Tracking | Inactivate the selected outbreak alert record |
| Threat Hunting - FortiAnalyzer - Get Related Assets | Retrieves device information from Fortinet FortiAnalyzer based on the device name |
| IOC Threat Hunt - FortiAnalyzer | Performs FortiAnalyzer IOC Hunting on the specified IOC. |
| Threat Hunting - Azure Log Analytics - Search Query | Retrieves data using a outbreak alert query from Azure Log Analytics and create FortiSOAR events |
| IOC Threat Hunt - QRadar | Performs QRadar IOC Hunting on the specified IOC. |
| Investigate Outbreak | Investigate Outbreak Alert on different SIEM tools, remediate and mitigate |
| Threat Hunting - Splunk - Update Notable Fields | Invokes a search on the Splunk server based on the notable data |
| Threat Hunting - FortiSIEM - Get Incident | Retrieves a list and details of incidents from the Fortinet FortiSIEM server based on the outbreak alert event type |
| Threat Hunting - FortiAnalyzer - Get Events | Retrieve all events from FortiAnalyzer based on the outbreak alert filter query |
| Threat Hunting - Splunk - Create Inbound Alert | Creates an alert in FortiSOAR with the event data |
| Find Known Exploited Vulnerabilities (KEV) CVEs | Fetch Known Exploited Vulnerabilities (KEV) CVEs from NIST and create CVE record. |
| IOC Threat Hunt | Hunt the IOCs on different SIEM and analyzer Solutions |



## System View

| Name |
| :- |
| Outbreak Management |


>**Warning:** We recommend that you clone these playbooks before customizing to avoid loss of information while upgrading the solution pack.

# Next Steps
| [Installation](./setup.md#installation) | [Configuration](./setup.md#configuration) | [Usage](./usage.md) |
| ----------------------------------------- | ------------------------------------------- | --------------------- |