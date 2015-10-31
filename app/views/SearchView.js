define(['marionette'], function(Marionette) {
    return Marionette.ItemView.extend({
        className: 'searchView',
        template: _.template('<input type="text" class="searchView-input"/>'),
        events: {
            'keyup .searchView-input': function() {
                this.trigger('enter', this.$('.searchView-input').val());
            }
        }
    });
});