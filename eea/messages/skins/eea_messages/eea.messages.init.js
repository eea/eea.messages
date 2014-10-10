// Call eea.messages for all portalMessages which are not within content-core
// uses portal_url from plone_javascript_variables.js
/* global portal_url */
jQuery(function($) {
    var messages = $('.portalMessage').filter(function() {
        return $(this).closest('#content-core').length ? false : true;
    });

    $.getJSON(portal_url + '/eea.messages.settings').done(function(json){
       messages.EEAMessages(json);
    });

});

