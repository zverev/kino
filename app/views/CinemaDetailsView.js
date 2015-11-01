define(['marionette', 'text!views/cinemaDetailsView.html'], function(Marionette, tpl) {
    return Marionette.ItemView.extend({
        className: 'cinemaDetailsView',
        template: function(modelAttrs) {
            var photo = null;
            if (modelAttrs.photo && modelAttrs.photo.length && modelAttrs.photo[0]) {
                url = modelAttrs.photo[0];
                photo = 'http://kinohod.ru/p/800x600/' + url.slice(0,2) + '/' + url.slice(2, 4) + '/' + url
            }
            return _.template(tpl)({
                title: modelAttrs.title,
                address: modelAttrs.address,
                photo: photo
            })
        }
    });
});