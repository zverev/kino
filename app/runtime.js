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

        var tl = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/maptile/{mapID}/normal.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}', {
            attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
            subdomains: '1234',
            mapID: 'newest',
            app_id: 'Y8m9dK2brESDPGJPdrvs',
            app_code: 'dq2MYIvjAotR8tHvY8Q_Dg',
            base: 'base',
            maxZoom: 20
        })

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