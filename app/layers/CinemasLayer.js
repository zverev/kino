define(['leaflet', 'layers/PopupMarker', 'views/CinemaPopupView'], function(L, PopupMarker, CinemaPopupView) {
    return L.FeatureGroup.extend({
        initialize: function(options) {
            L.FeatureGroup.prototype.initialize.apply(this, arguments)
            L.setOptions(this, options);
            
            this.popup = new CinemaPopupView();
            this.popup.on('details', function(model) {
                this.fire('details', {
                    model: model
                });
            }.bind(this));
            this.popup.on('seances', function(model) {
                this.fire('seances', {
                    model: model
                });
            }.bind(this));

            this.addMarkerBound = this.addMarker.bind(this);
            this.setCollection(this.options.collection);
        },
        setCollection: function(collection) {
            this.clearLayers();
            if (this.collection) {
                this.collection.off('add', this.addMarkerBound);
            }
            this.collection = collection;
            collection.forEach(function(it) {
                this.addMarker(it);
            }.bind(this));
            collection.on('add', this.addMarkerBound);
        },
        addMarker: function(model) {
            var marker = new PopupMarker([model.get('location').latitude, model.get('location').longitude]);
            //L.Marker.prototype.bindPopup.call(marker, this.popup.el);
            marker.bindPopup(this.popup.el, {
                showOnMouseOver: true
            });
            marker.on('popupopen', function() {
                this.popup.render(model);
            }.bind(this));
            this.addLayer(marker);
        },
        navigateCinema: function(cinemaModel) {
            this._map.setView([
                cinemaModel.get('location').latitude,
                cinemaModel.get('location').longitude
            ], 15);
        }
    });
});