define(['leaflet', 'layers/PopupMarker', 'views/CinemaPopupView'], function(L, PopupMarker, CinemaPopupView) {
    return L.FeatureGroup.extend({
        initialize: function(options) {
            L.FeatureGroup.prototype.initialize.apply(this, arguments)
            L.setOptions(this, options);
            this.options.collection.on('add', this.addMarker.bind(this));
            this.popup = new CinemaPopupView();
        },
        addMarker: function(model) {
            var marker = new PopupMarker([model.get('location').latitude, model.get('location').longitude]);
            //L.Marker.prototype.bindPopup.call(marker, this.popup.el);
            marker.bindPopup(this.popup.el, {
                showOnMouseOver: true
            });
            marker.on('click', function() {
                console.log('test');
                marker.openPopup();
            })
            marker.on('popupopen', function() {
                this.popup.render(model)
            }.bind(this));
            this.addLayer(marker);
        }
    });
});