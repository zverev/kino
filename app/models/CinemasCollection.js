define(['backbone', 'jquery'], function(Backbone, $) {
    return Backbone.Collection.extend({
        initialize: function(options) {
            $.ajax(options.url).then(function(res) {
                res.map(function(m) {
                    this.add(m);
                }.bind(this));
            }.bind(this));
            this.trigger('ready');
        }
    });
});