define(['marionette'], function(Marionette) {
    return Marionette.ItemView.extend({
        className: 'searchView',
        template: _.template('<input type="text" class="searchView-input"/>'),
        initialize: function(options) {
            Marionette.ItemView.prototype.initialize.apply(this);
            this.options = options;
        },
        render: function() {
            Marionette.ItemView.prototype.render.apply(this);
            if (this.options.placeholder) {
                this.$('.searchView-input').attr('placeholder', this.options.placeholder);
            }
        },
        events: {
            'keyup .searchView-input': function() {
                this.trigger('enter', this.$('.searchView-input').val());
            }
        }
    });
});