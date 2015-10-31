define(['leaflet'], function(L) {
    var LayoutManager = L.Class.extend({
        initialize: function(options) {
            this.el = options.el;
            this.mapContainer = L.DomUtil.create('div', 'mapContainer fullSizeContainer', this.el);
        },
        getMapContainer: function() {
            return this.mapContainer;
        }
    })

    return new LayoutManager({
        el: document.body
    })
});