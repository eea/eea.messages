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

        self.context.bind('EEAMessages.render', function(evt, data){
            self.handle_message_render(data);
            self.context.trigger('EEAMessages.rendered', self);
        });
    },
    _subscribeEvents: function() {

    },
    initialize: function(){
        var self = this;
        self._build();
        self._bindEvents();
        self._subscribeEvents();
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
        $elem.trigger('EEAMessages.render', self);
    },

    handle_message_render: function(data) {
        var self = data;
        var $knob = $("<input class='knob'/>").appendTo(self.context);
        $knob.knob({
            value: 0,
            'readOnly': true,
            'width': 30,
            'height': 30,
            'background': 'white',
            'dynamicDraw': true,
            'thickness': 0.1,
            'tickColorizeValues': true,
            'skin': 'tron'
        });
        var $parent = $knob.closest('div');
        if($parent.css('display') === "inline") {
            $parent.css('display', 'block');
        }

        var count = window.parseInt(self.settings.timeout.toString().substring(0,2));
        var animateKnob = function() {
            $knob.val(count).trigger('change');
            count -= 1;
            if (count <= 0) {
               window.clearInterval(intervalID);
                self.context.fadeOut(self.settings.fadeTime);
            }
        };
        var intervalID = window.setInterval(animateKnob, 1000);
        self.context.hover(function(){
             window.clearInterval(intervalID);
        }, function() {
            intervalID = window.setInterval(animateKnob, 1000);
        });
    },

    handle_message_hide: function(data){
        var self = data || this;
        self.context.fadeOut();
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
    timeout: 15000,
    fadeTime: 500
};

// Call it
jQuery(function($) {
    $('.portalMessage').EEAMessages();
});

