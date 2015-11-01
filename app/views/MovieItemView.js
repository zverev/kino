define(['marionette', 'text!views/movieItemView.html'], function(Marionette, template) {
    return Marionette.ItemView.extend({
        className: 'movieItemView',
        template: _.template(template),
        events: {
            'click': function() {
                this.trigger('clack', this.model)
            }
        }
    });
});