""" Control Panel
"""
import json

from zope.component import queryUtility
from zope.interface import implements
from plone.app.controlpanel.form import ControlPanelForm
from Products.CMFDefault.formlib.schema import SchemaAdapterBase
from zope.formlib import form
from Products.Five.browser import BrowserView
from plone.registry.interfaces import IRegistry
from zope.component import getUtility

from eea.messages.config import EEAMessageFactory as _
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


class ControlPanel(ControlPanelForm):
    """ API
    """
    form_fields = form.FormFields(ISettings)
    label = _(u"EEA Messages Settings")
    description = _(u"EEA Messages settings")
    form_name = _(u"EEA Messages settings")


class ControlPanelAdapter(SchemaAdapterBase):
    """ Form adapter
    """
    implements(ISettings)

    def __init__(self, context):
        super(ControlPanelAdapter, self).__init__(context)
        self._settings = None

    @property
    def settings(self):
        """ Settings
        """
        if self._settings is None:
            self._settings = queryUtility(
                IRegistry).forInterface(ISettings, False)
        return self._settings

    @property
    def timeout(self):
        """ Get timeout
        """
        name = u"timeout"
        return getattr(self.settings, name, ISettings[name].default)

    @timeout.setter
    def timeout(self, value):
        """ Set timeout
        """
        self.settings.timeout = value

    @property
    def timeout_action(self):
        """ Get Action Messages timeout
        """
        name = u"timeout_action"
        return getattr(self.settings, name, ISettings[name].default)

    @timeout_action.setter
    def timeout_action(self, value):
        """ Set Action Messages timeout
        """
        self.settings.timeout_action = value


class SettingsJSONView(BrowserView):
    """ Custom view controller
    """
    @cache(get_key=lambda method, self: method.__name__)
    def messages_settings(self):
        """
        :return: JSON output of EEA Messages settings
        :rtype: dict
        """
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
