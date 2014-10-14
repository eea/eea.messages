// Call eea.messages for all portalMessages which are not within content-core
// uses portal_url from plone_javascript_variables.js
/* global portal_url */
jQuery(function($) {
    var messages = function() {
        return $('.portalMessage').filter(function() {
            return $(this).closest('#content-core').length ? false : true;
        });
    };

    $.getJSON(portal_url + '/eea.messages.settings').done(function(json){
       messages().EEAMessages(json);
    });

    if (window.AsyncWorkflow) {
        $(window.AsyncWorkflow.Events).bind(window.AsyncWorkflow.Events.WORKFLOW_MENU_REFRESHED, function() {
            messages().EEAMessages();
        });
    }
});

