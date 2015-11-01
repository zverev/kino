define(['marionette', 'text!views/dialogView.html'], function(Marionette, tpl) {
    return Marionette.LayoutView.extend({
        className: 'dialogView',
        events: {
            'click': function(je) {
                je.stopPropagation();
            },
            'click .dialogView-closeButton': function() {
                this.destroy();
            }
        },
        template: _.template(tpl),
        regions: {
            content: ".dialogView-contentView"
        },
        initialize: function(options) {
            Marionette.LayoutView.prototype.initialize.apply(this);
            this.contentView = options.contentView;
        },
        render: function() {
            Marionette.LayoutView.prototype.render.apply(this);
            this.getRegion('content').show(this.contentView);
        }
    });
});