if(window.EEA === undefined){
  var EEA = {
    who: 'eea.messages',
    version: '1.0'
  };
}

EEA.Messages = function(context, options){
 var self = this;
  self.context = context;

  self.settings = {
  };

  if(options){
    jQuery.extend(self.settings, options);
  }

  self.initialize();
};

EEA.Messages.prototype = {
  initialize: function(){
    var self = this;
  }
};


jQuery.fn.EEAMessages = function(options){
  return this.each(function(){
    var context = jQuery(this);
    var adapter = new EEA.Messages(context, options);
    context.data('EEAMessages', adapter);
  });
};

jQuery(document).ready(function(){

  var items = jQuery(".eea-messages");
  if(!items.length){
    return;
  }

  var settings = {};
  items.EEAMessages(settings);

});
