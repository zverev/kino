define(['backbone', 'text!views/selectedMovieWidget.html'], function(Backbone, tpl) {
    return Backbone.View.extend({
        className: 'selectedMovieWidget',
        initialize: function() {
            this.hide();
        },
        setMovie: function(movieModel) {
            this.render(movieModel);
        },
        render: function(movieModel) {
            this.$el.html(_.template(tpl)(movieModel.attributes));
            this.$('.selectedMovieWidget-resetButton').on('click', function() {
                this.hide();
                this.trigger('reset');
            }.bind(this))
            this.show();
        },
        appendTo: function(el) {
            this.$el.appendTo(el);
        },
        show: function() {
            this.$el.removeClass('hidden')
        },
        hide: function() {
            this.$el.addClass('hidden')
        }
    })
});