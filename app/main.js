requirejs.config({
    paths: {
        'text': 'lib/requirejs-plugins/lib/text',
        'json': 'lib/requirejs-plugins/src/json',
        'leaflet': 'lib/leaflet/dist/leaflet-src',
        'underscore': 'lib/underscore/underscore',
        'backbone': 'lib/backbone/backbone',
        'jquery': 'lib/jquery/dist/jquery',
        'quadTree': 'lib/leaflet.maskcanvas/src/QuadTree',
        'maskcanvas': 'lib/leaflet.maskcanvas/src/L.TileLayer.MaskCanvas'
    },
    shim: {
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'quadTree': {
            exports: 'QuadTree'
        },
        'maskcanvas': {
            deps: ['leaflet', 'quadTree'],
            exports: 'L.TileLayer.MaskCanvas'
        }
    }
});

define(['map'], function() {
    
});