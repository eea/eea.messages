""" Public interfaces
"""
# Browser layer
from eea.messages.browser.interfaces import ILayer

# Control Panel
from eea.messages.controlpanel.interfaces import ISettings

__all__ = [
    ILayer.__name__,
    ISettings.__name__,
]
