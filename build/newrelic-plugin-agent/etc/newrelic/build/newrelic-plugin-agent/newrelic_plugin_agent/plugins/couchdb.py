"""
CouchDB

"""
import logging

from newrelic_plugin_agent.plugins import base

LOGGER = logging.getLogger(__name__)


class CouchDB(base.JSONStatsPlugin):

    DEFAULT_PATH = '/_stats'
    GUID = 'com.meetme.newrelic_couchdb_agent'

    HTTP_METHODS = ['COPY', 'DELETE', 'GET', 'HEAD', 'POST', 'PUT']
    STATUS_CODES = [200, 201, 202, 301, 304, 400, 401,
                    403, 404, 405, 409, 412, 500]

    def add_datapoints(self, stats):
        """Add all of the data points for a node

        :param dict stats: all of the nodes

        """
        LOGGER.debug('Stats: %r', stats)
        self.add_database_stats(stats['couchdb'])
        self.add_request_methods(stats['httpd_request_methods'])
        self.add_request_stats(stats['couchdb'], stats['httpd'])
        self.add_response_code_stats(stats['httpd_status_codes'])

    def add_database_stats(self, stats):
        self.add_gauge_value('Database/Open', '',
                             stats['open_databases'].get('current', 0),
                             stats['open_databases'].get('min', 0),
                             stats['open_databases'].get('max', 0))
        self.add_derive_value('Database/IO/Reads', '',
                              stats['database_reads'].get('current', 0))
        self.add_derive_value('Database/IO/Writes', '',
                              stats['database_writes'].get('current', 0))
        self.add_gauge_value('Files/Open', '',
                             stats['open_os_files'].get('current', 0),
                             stats['open_os_files'].get('min', 0),
                             stats['open_os_files'].get('max', 0))

    def add_request_stats(self, couchdb, httpd):
        self.add_derive_timing_value('Requests/Velocity', 'sec',
                                     httpd['requests'].get('current', 0),
                                     couchdb['request_time'].get('current', 0))
        self.add_derive_value('Requests/Document', '',
                              httpd['requests'].get('current', 0))
        self.add_derive_value('Requests/Bulk', '',
                              httpd['bulk_requests'].get('current', 0))
        self.add_derive_value('Requests/View', '',
                              httpd['view_reads'].get('current', 0))
        self.add_derive_value('Requests/Temporary View', '',
                              httpd['temporary_view_reads'].get('current', 0))

    def add_request_methods(self, stats):
        for method in self.HTTP_METHODS:
            self.add_derive_value('Requests/Method/%s' % method, '',
                                  stats[method].get('current', 0))

    def add_response_code_stats(self, stats):
        for code in self.STATUS_CODES:
            self.add_derive_value('Requests/Response/%s' % code, '',
                                  stats[str(code)].get('current', 0))
