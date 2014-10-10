""" Control Panel
"""
from zope.component import queryUtility
from zope.interface import implements
from eea.messages.interfaces import ISettings
from eea.messages.config import EEAMessageFactory as _
from plone.app.controlpanel.form import ControlPanelForm
from plone.registry.interfaces import IRegistry
from Products.CMFDefault.formlib.schema import SchemaAdapterBase
from zope.formlib import form

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
