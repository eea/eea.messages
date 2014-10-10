""" Browser views
"""
from Products.Five.browser import BrowserView
import json
from zope.component import queryAdapter
from zope.component.hooks import getSite
from eea.messages.controlpanel.interfaces import ISettings


def jsonify(obj, response=None, status=None):
    """ Convert obj to JSON
    """
    if response:
        response.setHeader("Content-type", "application/json")
        if status:
            response.setStatus(status)
    return json.dumps(obj)


class SettingsJSONView(BrowserView):
    """ Custom view controller
    """
    def __init__(self, context, request):
        super(SettingsJSONView, self).__init__(context, request)
        self._settings = None

    @property
    def settings(self):
        """ Settings
        """
        if self._settings is None:
            site = getSite()
            self._settings = queryAdapter(site, ISettings)
        return self._settings

    def __call__(self):
        return jsonify(self.settings, self.request.response)
