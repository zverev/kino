define(['views/View', 'utils', 'text!views/cinemaPopupView.html'], function(View, Utils, template) {
    return View.extend({
        className: 'cinemaPopup',
        initialize: function() {
            this.template = _.template(template);
        },
        render: function(model, seances) {
            this.$el.html(this.template(_.extend({}, model.attributes, {
                seances: seances && seances.map(function(seance) {
                    return {
                        timeStr: Utils.formatDate(new Date(seance.get('startTime')), 'hh:mm'),
                        id: seance.get('id')
                    }
                }) 
            })));
            this.$('.cinemaPopup-seance').click(function(je) {
                this.trigger('seance', $(je.target).attr('data-seance-id'))
            }.bind(this));
            this.$('.cinemaPopup-details').on('click', function() {
                this.trigger('details', model);
            }.bind(this));
            this.$('.cinemaPopup-seances').on('click', function() {
                this.trigger('seances', model);
            }.bind(this));
        }
    })
});