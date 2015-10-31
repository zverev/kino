define(['leaflet'], function(L) {
    return L.FeatureGroup.extend({
        initialize: function(options) {
            L.FeatureGroup.prototype.initialize.apply(this, arguments)
            L.setOptions(this, options);
            this.options.collection.on('add', this.addMarker.bind(this));
        },
        addMarker: function(model) {
            var marker = L.marker([model.get('location').latitude, model.get('location').longitude]);
            this.addLayer(marker);
        }
    });
});