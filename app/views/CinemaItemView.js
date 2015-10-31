define(['marionette', 'text!views/cinemaItemView.html'], function(Marionette, template) {
    return Marionette.ItemView.extend({
        className: 'cinemaItemView',
        template: _.template(template)
    });
});