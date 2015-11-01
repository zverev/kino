define(['marionette', 'views/SearchView'], function(Marionette, SearchView) {
    var CollectionView = Marionette.CollectionView.extend({
        initialize: function(options) {
            this.itemView = options.itemView;
        },
        setFilter: function(filterStr) {
            this.filterStr = filterStr;
            this.render();
        },
        getChildView: function(item) {
            if (item.get('title').search(new RegExp(this.filterStr, 'ig')) !== -1) {
                return this.itemView;
            } else {
                return Marionette.View;
            }
        }
    });

    return Marionette.LayoutView.extend({
        className: 'searchCollectionView',
        template: _.template('<div class="searchCollectionView-search"/><div class="searchCollectionView-collection"/>'),
        regions: {
            search: ".searchCollectionView-search",
            collection: ".searchCollectionView-collection"
        },
        // options.collection
        // options.searchViewOptions
        initialize: function(options) {
            Marionette.LayoutView.prototype.initialize.apply(this);
            this.options = options;
        },
        render: function() {
            Marionette.LayoutView.prototype.render.apply(this);
            this.searchView = new SearchView(this.options.searchViewOptions);
            this.searchView.on('enter', function(val) {
                this.collectionView.setFilter(val)
            }.bind(this));
            this.collectionView = new CollectionView({
                itemView: this.options.itemView,
                collection: this.options.collection
            });
            this.collectionView.on('all', function() {
                this.trigger.apply(this, arguments)
            }.bind(this));
            this.getRegion('search').show(this.searchView);
            this.getRegion('collection').show(this.collectionView);
        }
    });
});