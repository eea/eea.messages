""" Browser views
"""
from Products.Five.browser import BrowserView
import json
from plone.registry.interfaces import IRegistry
from zope.component import queryAdapter, getUtility
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
        registry = getUtility(IRegistry)
        records = registry.records
        reg_name = ISettings.__identifier__
        values = records.values(reg_name + ".", reg_name + "0")
        output = {}
        for value in values:
            output[value.fieldName] = value.value
        return jsonify(output, self.request.response)
