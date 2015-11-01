define(['backbone', 'jquery'], function(Backbone, $) {
    return Backbone.Collection.extend({
        initialize: function(els, options) {
            this.options = options;
            this.restore();
        },
        restore: function() {
            $.ajax(this.options.url).then(function(res) {
                res.map(function(m) {
                    this.add(m);
                }.bind(this));
                this.trigger('ready');
            }.bind(this));
        }
    });
});