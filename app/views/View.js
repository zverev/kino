define(['backbone'], function(Backbone) {
    return Backbone.View.extend({
        appendTo: function(el) {
            this.$el.append(el);
        }
    })
})