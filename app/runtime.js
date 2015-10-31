define([
    'componentsManager',
    'leaflet',
    'LayoutManager',
    'models/CinemasCollection',
    'layers/CinemasLayer'
], function(
    ComponentsManager,
    L,
    LayoutManager,
    CinemasCollection,
    CinemasLayer
) {
    var cm = window.cm = new ComponentsManager();

    cm.define('layoutManager', [], function() {
        return new LayoutManager({
            el: document.body
        });
    });

    cm.define('map', ['layoutManager'], function(cm) {
        var layoutManager = cm.get('layoutManager');

        var map = L.map(layoutManager.getMapContainer()).setView({
            lat: 55.7529120574368,
            lng: 37.622079849243164
        }, 12);

        var tl = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
            attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20,
            ext: 'png'
        });

        tl.addTo(map);

        return map;
    });

    cm.define('cinemasCollection', [], function(cm) {
        return new CinemasCollection({
            url: 'app/models/cinemas.json'
        });
    });

    cm.define('cinemasLayer', ['cinemasCollection'], function(cm) {
        var cinemasCollection = cm.get('cinemasCollection');
        return new CinemasLayer({
            collection: cinemasCollection
        });
    });

    cm.define('layersManager', ['map', 'cinemasLayer'], function(cm) {
        var map = cm.get('map');
        var cinemasLayer = cm.get('cinemasLayer');
        map.addLayer(cinemasLayer);
        return null;
    });

    cm.create();
});