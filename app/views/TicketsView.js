define(['marionette', 'text!views/ticketsView.html', 'text!views/ticketsIdleView.html'], function(Marionette, tpl, tplIdle) {
    return Marionette.ItemView.extend({
        className: 'ticketsView',
        render: function() {
            this.$el.html(_.template(tplIdle)(this.model.attributes));
            setTimeout(function() {
                this.$el.html(_.template(tpl)(this.model.attributes))
            }.bind(this), 3000);
            return this;
        }
    })
});