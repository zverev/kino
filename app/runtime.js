define([
    'componentsManager',
    'leaflet',
    'jquery',
    'marionette',
    'LayoutManager',
    'models/ItemsCollection',
    'layers/CinemasLayer',
    'lib/iconSidebarWidget/iconSidebarWidget',
    'views/SearchCollectionView',
    'views/DialogView',
    'views/CinemaDetailsView',
    'views/CinemaItemView',
    'views/MovieItemView'
], function(
    ComponentsManager,
    L,
    $,
    Marionette,
    LayoutManager,
    ItemsCollection,
    CinemasLayer,
    IconSidebarWidget,
    SearchCollectionView,
    DialogView,
    CinemaDetailsView,
    CinemaItemView,
    MovieItemView
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

    cm.define('dialogsRegion', ['layoutManager'], function(cm) {
        var layoutManager = cm.get('layoutManager');
        var dialogsContainer = layoutManager.getDialogsContainer();

        var reg = new Marionette.Region({
            el: '.dialogsContainer'
        });

        reg.on('show', function() {
            $(dialogsContainer).addClass('active');
        });

        reg.on('empty', function() {
            $(dialogsContainer).removeClass('active');
        });

        $(dialogsContainer).on('click', function() {
            reg.reset();
        });

        return reg;
    });

    cm.define('cinemasCollection', [], function(cm) {
        return new ItemsCollection([], {
            url: 'mock/cinemas.json'
        });
    });

    cm.define('moviesCollection', [], function(cm) {
        return new ItemsCollection([], {
            url: 'http://68a2bba2.ngrok.io/get/50_movies'
        });
    });

    cm.define('cinemasLayer', ['cinemasCollection', 'dialogsRegion'], function(cm) {
        var dialogsRegion = cm.get('dialogsRegion');
        var cinemasCollection = cm.get('cinemasCollection');
        var cinemasLayer = new CinemasLayer({
            collection: cinemasCollection
        });

        cinemasLayer.on('details', function(le) {
            dialogsRegion.show(new DialogView({
                contentView: new CinemaDetailsView({
                    model: le.model
                })
            }));
        });

        return cinemasLayer;
    });

    cm.define('layersManager', ['map', 'cinemasLayer'], function(cm) {
        var map = cm.get('map');
        var cinemasLayer = cm.get('cinemasLayer');
        map.addLayer(cinemasLayer);
        return null;
    });

    cm.define('sidebarWidget', ['layoutManager'], function(cm) {
        var layoutManager = cm.get('layoutManager');
        var sidebarWidget = new IconSidebarWidget();
        sidebarWidget.appendTo(layoutManager.getWidgetsContainer());
        return sidebarWidget;
    });

    cm.define('moviesTab', ['sidebarWidget', 'moviesCollection', 'cinemasCollection'], function(cm) {
        var cinemasLayer = cm.get('cinemasLayer')
        var sidebarWidget = cm.get('sidebarWidget');
        var moviesCollection = cm.get('moviesCollection');
        var cinemasCollection = cm.get('cinemasCollection');

        var reg = new Marionette.Region({
            el: sidebarWidget.addTab('moviesTab', 'icon-video')
        })

        var cinemasListView = new SearchCollectionView({
            itemView: MovieItemView,
            collection: moviesCollection,
            searchViewOptions: {
                placeholder: 'Поиск по фильмам'
            }

        });
        cinemasListView.on('childview:clack', function(child, model) {
            console.log(model);
        });

        reg.show(cinemasListView);

        return cinemasListView;
    });

    cm.define('cinemasTab', ['sidebarWidget', 'cinemasCollection', 'cinemasLayer'], function(cm) {
        var cinemasLayer = cm.get('cinemasLayer')
        var sidebarWidget = cm.get('sidebarWidget');
        var cinemasCollection = cm.get('cinemasCollection');

        var reg = new Marionette.Region({
            el: sidebarWidget.addTab('cinemasTab', 'icon-videocam')
        })
        var cinemasListView = new SearchCollectionView({
            itemView: CinemaItemView,
            collection: cinemasCollection,
            searchViewOptions: {
                placeholder: 'Поиск по фильмам'
            }
        });

        cinemasListView.on('childview:clack', function(child, model) {
            cinemasLayer.navigateCinema(model);
        });

        reg.show(cinemasListView);

        return cinemasListView;
    });

    cm.create();
});