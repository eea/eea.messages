""" Control Panel Interfaces

   >>> portal = layer['portal']
   >>> sandbox = portal['sandbox']

"""
from zope.interface import Interface
from zope import schema
from eea.messages.config import EEAMessageFactory as _

class ISettings(Interface):
    """ Alchemy settings

        >>> from eea.messages.interfaces import ISettings
        >>> ISettings(portal).timeout = 123
        >>> ISettings(portal).timeout
        123

    """
    timeout = schema.Int(
        title=_(u"Timeout"),
        description=_(u"Default time in miliseconds before the message "
                      u"dissapears"),
        required=True,
        default=15000
    )
    timeout_action = schema.Int(
        title=_(u"Action Timeout"),
        description=_(u"Default time for messages with links in miliseconds "
                      u"before the message dissapears"),
        required=True,
        default=30000
    )
