// Call eea.messages for all portalMessages which are not within content-core
jQuery(function($) {
    var messages = $('.portalMessage').filter(function() {
        return $(this).closest('#content-core').length ? false : true;
    });

    messages.EEAMessages();
});

