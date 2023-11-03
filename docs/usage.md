[Home](../README.md) |
 | -------------------------------------------- |

# Usage

In this section we detail the various user flows to understand the scenarios where this solution pack’s automation addresses our needs.

## Outbreak Response Framework Flowchart 
 
 ![Outbreak Alerts Flowchart](./res/outbreak-alert-flow.png)

The following pointers help understand the flow of "Outbreak Response Framework" solution pack 

1. Install Outbreak Response Framework Solution Pack :   Installation of this solution pack creates/install the [Contents](./contents.md) in FortiSOAR

2. Configuration Wizard: After installation of "Outbreak Response Framework" solution pack "Outbreak Response Framework Configuration" wizard will launch autoamtically and user should need to [Setup Outbreak Response Framework on FortiSOAR](./setup.md#setup-outbreak-response-framework-on-fortisoar)

3. Install Outbreak Response Solution Pack :
Example: Outbreak Response - Progress MOVEit Transfer SQL Injection Vulnerability" which will install 
    1. Outbreak Alert
        - [Outbreak Alert details](/README.md#outbreak-alerts)
        - Mitigation Details
    2. [Threat Hunt Rules](/README.md#threat-hunt-rules)
        - Yara Rules: YARA is a tool that you can use to help malware researchers identify and classify malware samples that focus on scanning and identifying malicious files. YARA rules are used to help cyber defenders look for the potential poison in their systems.
        ![Yara Rules](./res/yara_rule.png)
        - Sigma Rules: It provides a standard format for log events. They are for searching/pattern matching through log data. Sigma rule is a YAML file with standardized sections and structured fields. Using Sigma Rules we can create Signature Based Threat Hunt Rules for various Threat Detection Integrations (SIEM/Analyzer/EDR etc.)
        - Fortinet Fabric Rules: With every Outbreak Alert FortiGuard provides the FortiAnalyzer and FortiSIEM fabric solution

4. Create CVE's for KEV's: If any CVE(s) is associated with Outbreak Alert then FortiSOAR checks if they are tagged as KEV's (using the NVD integration) and creates the CVE's records in vulnarability module and link those record to Outbreak Alert

5. Ingest IOCs as Threat Feeds: IOCs associated to the Outbreak are ingested as threat feeds in FortiSOAR Say, a new IOC is added to the same outbreak, user does not need to update the solution pack, as we will be hosting the IOCs on our public github page, where our team will be updating them. so threat hunting queries always get the latest IOCs.

If any other ALERT in FortiSOAR containing those IOCs is found, user is notified and severity is raised.

6. IOC Threat Hunt:

    a. Perform IOC Threat Hunting using Fortinet Fabric solutions (FortiSIEM/FortiAnalyzer) and creates Outbreak IOC Hunt Alerts in FortiSOAR

    b. Perform IOC Threat Hunting using SIEM solutions (QRadar/Splunk) and creates Outbreak IOC Hunt Alerts in FortiSOAR

7. Signature Based Threat Hunt (Sigma Rules):

    a.Perform Signature Based Threat Hunting using Fortinet Fabric solutions (FortiSIEM/FortiAnalyzer) and creates Outbreak Alerts in FortiSOAR
    ![FortiSIEM Fabric Rule](./res/fsm_fortinet_fabric.png)

    ![FortiAnalyzer Fabric Rule](./res/faz_fortinet_fabric.png)

    b. Perform Signature Based Threat Hunting using SIEM solutions (QRadar/Splunk/Azure Log Analytics) and creates Outbreak Alerts in FortiSOAR.
    ![Signature Based Threat Hunting Rules](./res/sigma_rule.png)

7. Ticketing/ITSM: If any vulnerability found using the IOC Threat Hunt or Signature Based Threat Hunt automatically Alert is created for that vulnerability in FortiSOAR and as part of your response or threat management strategy automatically creates tickets using Ticketing/ITSM Integrations (Jira/ServiceNow) for Outbreak Alert(vulnerability) 

8. Remediation: We can take remediation using two ways

    a. Automatically: FortiSOAR automatically blocks all the indicators using the FortiGate Integration

    b. Manually: FortiSOAR automatically creates the FortiSOAR Task to block all the indicators

9. Mitigation: For every Outbreak Alert have associated mitigation. FortiSOAR provide the mitigation recommendations using public sources, like patch available etc.
![Mitigation](./res/mitigation.png)

# Next Steps
| [Installation](./setup.md#installation) | [Configuration](./setup.md#configuration) | [Contents](./contents.md) |
| ----------------------------------------- | ------------------------------------------- | --------------------------- |