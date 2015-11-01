define(['marionette'], function(Marionette) {
    return Marionette.ItemView.extend({
        className: 'preloaderView',
        template: _.template('загрузка..')
    });
});