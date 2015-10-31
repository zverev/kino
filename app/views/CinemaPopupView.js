define(['views/View', 'text!views/cinemaPopupView.html'], function(View, template) {
    return View.extend({
        className: 'cinemaPopup',
        initialize: function() {
            this.template = _.template(template);
        },
        render: function(model) {
            this.$el.html(this.template(model.attributes))
        }
    })
});