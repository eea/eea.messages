//// Top namespace
if (!window.EEA) {
    window.EEA = {};
}
if (!window.EEA.EEAMessages) {
    var EEAMessages = {"version": "1.0"};
}

// Constructor
EEAMessages.Message = function(context, options){
    var self = this;
    self.context = context;

    self.settings = $.extend( {}, $.fn.EEAMessages.options, options );

    if(options){
        jQuery.extend(self.settings, options);
    }

    self.initialize();
};

// Prototype
EEAMessages.Message.prototype = {
    constructor:  EEAMessages.Message,
    _build: function() {
        var $holder  = $(this.settings.id);
        if (!$holder.length) {
            this.settings.holder = $(this.settings.wrapWith).appendTo('body');
        }
        else {
            this.settings.holder = $holder;
        }
    },
    _bindEvents: function() {
        // Bind some events
        var self = this;
        self.context.bind('EEAMessages.add', function(evt, data){
            self.handle_message_add(data);
            self.context.trigger('EEAMessages.added', self);
        });
        self.context.bind('EEAMessages.added', function(evt, data){
            self.handle_message_added(data);
        });
        self.context.bind('EEAMessages.hide', function(evt, data){
            self.handle_message_hide(data);
            self.context.trigger('EEAMessages.hidden', self);
        });

        self.context.bind('EEAMessages.display', function(evt, data){
            self.handle_message_display(data);
            self.context.trigger('EEAMessages.displayed', self);
        });
    },
    initialize: function(){
        var self = this;
        self._build();
        self._bindEvents();
        // trigger some events
        self.context.trigger('EEAMessages.add', self);
        return self;
    },

    // event handlers
    handle_message_add: function(data){
        var self = data;
        self.context.appendTo(self.settings.holder);
    },

    handle_message_added: function(data) {
        var self = data;
        var $elem = self.context;
        var linkFound = $elem.find('a');
        if (linkFound) {
            $elem.trigger('EEAMessages.ActionMessage', self);
        }
        $elem.trigger('EEAMessages.display', self);
    },

    handle_message_display: function(data) {
        var self = data;
        var timeoutID = window.setTimeout(
            $.proxy(self.handle_message_hide, self), self.settings.timeout);
        self.context.mouseenter($.proxy(function(ev){
            console.log('entered');
            window.clearTimeout(timeoutID);
        }, data));
        self.context.mouseleave($.proxy(function(ev){
            timeoutID = window.setTimeout(
                $.proxy(self.handle_message_hide, self), self.settings.timeout);
            console.log('leaved');
        }, data));
    },

    handle_message_hide: function(data){
        var self = data || this;
        self.context.hide();
    }
};

// jQuery plugin
jQuery.fn.EEAMessages = function(options){
    return this.each(function(){
        var context = jQuery(this);
        var message = new EEAMessages.Message(context, options);
        $.data(this, 'EEAMessages.Message', message);
    });
};

jQuery.fn.EEAMessages.options = {
    wrapWith: "<div id='eea-messages-holder'/>",
    id: '#eea-messages-holder',
    timeout: 15000
};

// Call it
jQuery(function($) {
    $('.portalMessage').EEAMessages();
});

