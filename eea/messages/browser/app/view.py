""" Browser views
"""
import json

from Products.Five.browser import BrowserView
from plone.registry.interfaces import IRegistry
from zope.component import getUtility
from eea.cache import cache

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
    @cache(get_key=lambda method, self: method.__name__)
    def messages_settings(self):
        registry = getUtility(IRegistry)
        records = registry.records
        reg_name = ISettings.__identifier__
        values = records.values(reg_name + ".", reg_name + "0")
        output = {}
        for value in values:
            output[value.fieldName] = value.value
        return jsonify(output, self.request.response)

    def __call__(self):
        return self.messages_settings()
