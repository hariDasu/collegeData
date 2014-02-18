"""
(C) Copyright 2011-2013, MongoDB, Inc.

Unless instructed by MMS, do not modify default settings.

When upgrading your agent, you must also upgrade your settings.py file.
"""

#
# Seconds between Mongo status checks. Please do not change this.
#
collection_interval = 56

#
# Seconds between cloud configuration checks. Please do not change this.
#
conf_interval = 120

#
# Seconds between log data collection (if enabled in UI). Please do not change this.
#
log_interval = 5

#
# The mms server
#
mms_server = "https://mms.mongodb.com"

#
# The mms ping url
#
ping_url = mms_server + "/ping/v1/%s"

#
# The mms config url
#
config_url = mms_server + "/conf/v3/%(key)s?am=true&ah=%(hostname)s&sk=%(sessionKey)s&av=%(agentVersion)s&sv=%(srcVersion)s"


#
# The mms agent log path.
#
logging_url = mms_server + "/agentlog/v2/catch/%(key)s"

#
# The operation failure log path.
#
operationFailureUrl = mms_server + "/agentlog/v2/qcmdf/%s"

#
# Enter your API key  - See: https://mms.mongodb.com/settings
#
mms_key = "02923cc310b5244292bcf054712a8159"

src_version = "0641636f7b6e61eefd97fb80c1af8d7e9159a9e8"

#
# The global authentication credentials to be used by the agent.
#
# The user must be created on the "admin" database.
#
# If the global username/password is set then all hosts monitored by the
# agent *must* use the same username password.
#
# Example usage:
#
# globalAuthUsername="""yourAdminUser"""
# globalAuthPassword="""yourAdminPassword"""
#
#
# If you do not use this, the values must be set to None.
#
# Please use """ quotes to ensure everything is escaped properly.
#
# E.g.,
#
# globalAuthPassword="""yourAdminPasswordWith"DoubleQuotes"""
#
# globalAuthPassword="""yourAdminPasswordWith'SingleQuote"""
#
# For more information about MongoDB authentication, see:
#
# http://www.mongodb.org/display/DOCS/Security+and+Authentication
#
#

globalAuthUsername = None

globalAuthPassword = None

#
# Some config db collection properties
#
configCollectionsEnabled = True
configDatabasesEnabled = True

#
# Ability to disable getLogs and profile data collection in the agent. This overrides
# the server configuration. Set these fields to True if you can NEVER allow profile or log data
# to be relayed to the central MMS servers.
#
disableProfileDataCollection = False
disableGetLogsDataCollection = False

#
# Ability to disable the retrieval of the locks and recordStats information from
# within a db.serverStatus call. This may be necessary for performance optimization in
# deployments with thousands of databases. Only valid for MongoDB 2.4+
#
disableLocksAndRecordStatsDataCollection = False

#
# Set to a specific bind address or 0.0.0.0 for all interfaces. Set to None to disable.
#
shutdownAgentBindAddr = None

#
# You must change the shutdown port if you run multiple agents on a machine.
#
shutdownAgentBindPort = 23017

#
# The shutdown agent bind challenge. You can change this to whatever you like. When
# you send a shutdown message to the agent, this must be the message sent.
#
shutdownAgentBindChallenge = '23237NYouCanChangeThis'

settingsAgentVersion = "1.6.8"

# Set to False if you have no plans to use munin (saves one thread per server)
enableMunin = True

# Misc - Please do not change this.
socket_timeout = 40

#
# You must be running a mongod process with built in SSL support. If
# this setting is enabled the `sslTrustedServerCertificates` setting below
# is required.
#
useSslForAllConnections = False

#
# Required only if connecting to MongoDBs running
# with SSL.
#
# `sslTrustedServerCertificates` is path on disk that contains the trusted certificate
# authority certificates in PEM format. The certificates will be used to verify
# the server certificate returned from any MongoDBs running with SSL.
#
# Certificate verification can be turned off by changing the `sslRequireValidServerCertificates`
# field to False. That configuration is only recommended for testing purposes
# as it makes connections suspectiable to MITM attacks.
#
sslTrustedServerCertificates = None
sslRequireValidServerCertificates = False

# Kerberos settings
# krb5Principal: The Kerberos principal used by the agent, e.g. mmsagent/myhost@EXAMPLE.COM
# krb5Keytab: The ABSOLUTE path to kerberos principal's keytab file.
#
# IMPORTANT:
# 1) You have to set both of the following parameters to enable Kerberos authentication
#
# 2) Once you enable Kerberos for an agent, this agent can ONLY monitor MongoDB instances with
# Kerberos enabled. E.g., an agent cannot monitor 2 hosts where one of them has Kerberos enabled
# and another one does not have Kerberos.
#
# 3) The agent depends on 'kinit' to do the Kerberos authentication. And it looks for the executable
# in /usr/bin/kinit, so please make sure you have kinit in the locations.
krb5Principal = None
krb5Keytab = None

