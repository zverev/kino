define(['leaflet'], function(L) {
    return L.Class.extend({
        initialize: function(options) {
            this.el = options.el;
            this.mapContainer = L.DomUtil.create('div', 'mapContainer fullSizeContainer', this.el);
            this.widgetsContainer = L.DomUtil.create('div', 'widgetsContainer fullSizeContainer', this.el);
            this.dialogsContainer = L.DomUtil.create('div', 'dialogsContainer fullSizeContainer', this.el);
        },
        getMapContainer: function() {
            return this.mapContainer;
        },
        getWidgetsContainer: function() {
            return this.widgetsContainer;
        },
        getDialogsContainer: function() {
            return this.dialogsContainer;
        }
    });
});