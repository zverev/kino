define(['marionette', 'views/CinemaItemView', 'views/SearchView'], function(Marionette, CinemaItemView, SearchView) {
    var CollectionView = Marionette.CollectionView.extend({
        setFilter: function(filterStr) {
            this.filterStr = filterStr;
            this.render();
        },
        getChildView: function(item) {
            if (item.get('title').search(new RegExp(this.filterStr, 'ig')) !== -1) {
                return CinemaItemView;
            } else {
                return Marionette.View;
            }
        }
    });

    return Marionette.LayoutView.extend({
        className: 'cinemasListView',
        template: _.template('<div class="cinemasListView-search"/><div class="cinemasListView-collection"/>'),
        regions: {
            search: ".cinemasListView-search",
            collection: ".cinemasListView-collection"
        },
        initialize: function(options) {
            Marionette.LayoutView.prototype.initialize.apply(this);
            this.collection = options.collection;
        },
        render: function() {
            Marionette.LayoutView.prototype.render.apply(this);
            this.searchView = new SearchView({
                placeholder: 'Поиск по кинотеатрам'
            });
            this.searchView.on('enter', function(val) {
                this.collectionView.setFilter(val)
            }.bind(this));
            this.collectionView = new CollectionView({
                collection: this.collection
            });
            this.getRegion('search').show(this.searchView);
            this.getRegion('collection').show(this.collectionView);
        }
    });
});