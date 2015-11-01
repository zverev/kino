define(['views/View', 'text!views/cinemaPopupView.html'], function(View, template) {
    return View.extend({
        className: 'cinemaPopup',
        initialize: function() {
            this.template = _.template(template);
        },
        render: function(model) {
            this.$el.html(this.template(model.attributes));
            this.$('.cinemaPopup-details').on('click', function() {
                this.trigger('details', model);
            }.bind(this)); 
            this.$('.cinemaPopup-seances').on('click', function() {
                this.trigger('seances', model);
            }.bind(this)); 
        }
    })
});