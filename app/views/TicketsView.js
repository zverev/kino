define(['marionette', 'text!views/ticketsView.html'], function(Marionette, tpl) {
    return Marionette.ItemView.extend({
        className: 'ticketsView',
        template: _.template(tpl)
    })
});