define(['marionette', 'text!views/cinemaDetailsView.html'], function(Marionette, tpl) {
    return Marionette.ItemView.extend({
        template: _.template(tpl)
    });
});