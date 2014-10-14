// Call eea.messages for all portalMessages which are not within content-core
jQuery(function($) {
    var eea_messages_init = function() {
        var msgs =  $('.portalMessage').filter(function() {
            return $(this).closest('#content-core').length ? false : true;
        });
        msgs.EEAMessages({
            timeout: 15000, // defaut timeout
            timeout_action: 30000 // longer timeout for action portalMessages
        });
    };
    eea_messages_init();

    if (window.AsyncWorkflow) {
        $(window.AsyncWorkflow.Events).bind(window.AsyncWorkflow.Events.WORKFLOW_MENU_REFRESHED, function() {
            eea_messages_init();
        });
    }
});

