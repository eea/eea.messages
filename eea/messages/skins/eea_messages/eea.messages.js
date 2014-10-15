/* global window */
//// Top namespace
if (!window.EEA) {
    window.EEA = {};
}
if (!window.EEA.EEAMessages) {
    var EEAMessages = {"version": "1.0"};
}

// Constructor
EEAMessages.Message = function(context, options) {
    var self = this;
    self.context = context;
    self.settings = $.extend({}, $.fn.EEAMessages.options, options);

    self.initialize();
};

// Prototype
EEAMessages.Message.prototype = {
    constructor: EEAMessages.Message,
    _build: function() {
        var $holder = $(this.settings.id);
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
        self.context.bind('EEAMessages.add', function(evt, data) {
            self.handle_message_add(data);
            self.context.trigger('EEAMessages.added', self);
        });
        self.context.bind('EEAMessages.added', function(evt, data) {
            self.handle_message_added(data);
        });
        self.context.bind('EEAMessages.hide', function(evt, data) {
            self.handle_message_hide(data);
            self.context.trigger('EEAMessages.hidden', self);
        });

        self.context.bind('EEAMessages.render', function(evt, data) {
            self.handle_message_render(data);
            self.context.trigger('EEAMessages.rendered', self);
        });
    },
    _subscribeEvents: function() {

    },
    initialize: function() {
        var self = this;
        self._build();
        self._bindEvents();
        self._subscribeEvents();
        // trigger some events
        self.context.trigger('EEAMessages.add', self);
        return self;
    },

    // event handlers
    handle_message_add: function(data) {
        var self = data;
        self.context.hide().appendTo(self.settings.holder);
    },

    handle_message_added: function(data) {
        var self = data;
        var $elem = self.context;
        var linkFound = $elem.find('a').length;
        if (linkFound) {
            self.settings.isActionMenu = true;
            $elem.trigger('EEAMessages.ActionMessage', self);
        }
        $elem.trigger('EEAMessages.render', self);
    },

    handle_message_render: function(data) {
        var self = data;
        var timeout_count = self.settings.isActionMenu ?
            self.settings.timeout_action.toString() :
            self.settings.timeout.toString();
        var count = window.parseInt(timeout_count.substring(0, 2));
        var two_thirds = Math.round(count * 0.66);
        var two_thirds_color = self.settings.mediumThreshold;
        var one_third = Math.round(count * 0.33);
        var one_third_color = self.settings.lowThreshold;
        self.context.delay(500).slideDown(self.settings.animationTime);

        var $knob = $("<input />", {'class': 'knob', value: count}).appendTo(self.context);
        var message_hidden = false;
        $knob.knob({
            'min': 0,
            'max': count,
            'readOnly': true,
            'width': 30,
            'height': 30,
            'thickness': 0.1,
            'inputColor': self.settings.highThreshold,
            'inline': false
        });
        var animateKnob = function() {
            count -= 1;
            $knob.val(count).trigger('change');
            if (count < two_thirds) {
                $knob.css('color', two_thirds_color);
            }
            if (count < one_third) {
                $knob.css('color', one_third_color);
            }
            if (count <= 0) {
                window.clearInterval(intervalID);
                self.context.slideUp(self.settings.animationTime);
            }
        };
        var intervalID = window.setInterval(animateKnob, 1000);
        $knob.hover(function() {
            $knob.val('X');
        });
        $knob.click(function() {
            self.context.slideUp(self.settings.animationTime);
            message_hidden = true;
            window.clearInterval(intervalID);
        });
        self.context.hover(function() {
            window.clearInterval(intervalID);
        }, function() {
            if (!message_hidden) {
                intervalID = window.setInterval(animateKnob, 1000);
            }
        });
    },

    handle_message_hide: function(data) {
        var self = data || this;
        self.context.slideDown();
    }
};

// jQuery plugin
jQuery.fn.EEAMessages = function(options) {
    return this.each(function() {
        var context = jQuery(this);
        if ($.data(this, 'EEAMessages.Message')) {
            return;
        }
        var message = new EEAMessages.Message(context, options);
        $.data(this, 'EEAMessages.Message', message);
    });
};

// You can modify this object in order to get different defaults in case
// they are needed within eea.messages.init.js
// calling $(context).EEAMessages({id: 'someid'}) will override these defaults
jQuery.fn.EEAMessages.options = {
    wrapWith: "<div id='eea-messages-holder'/>",
    id: '#eea-messages-holder',
    timeout: 15000,
    timeout_action: 30000,
    animationTime: 400,
    isActionMenu: false,
    lowThreshold: 'red',
    mediumThreshold: 'orange',
    highThreshold: 'green'
};

