define(['leaflet'], function(L) {
    var Animation = L.Class.extend({
        includes: L.Mixin.Events,
        options: {
            useAnimation: true
        },
        initialize: function(el, prefix, property, options) {
            this._el = el;
            this._prefix = prefix;
            this._property = property || '';

            L.setOptions(this, options);

            this._animationIsComplete = false;
            this._animationInProcess = false;
            this._switchClasses(this._animationIsComplete);

            if (this.options.useAnimation) {
                L.DomUtil.addClass(this._el, prefix + '-animated')
            }
        },
        _switchClasses: function(animationIsComplete) {
            L.DomUtil.addClass(this._el, this._prefix + (animationIsComplete ? '-afterAnimation' : '-beforeAnimation') + (this._property && '-' + this._property));
            L.DomUtil.removeClass(this._el, this._prefix + (animationIsComplete ? '-beforeAnimation' : '-afterAnimation') + (this._property && '-' + this._property));
        },
        run: function() {
            if (!this.options.useAnimation) {
                this._switchClasses(!this._animationIsComplete);
                this._animationIsComplete = !this._animationIsComplete;
                this.fire(this._animationIsComplete ? 'after' : 'before');
            } else if (!this._animationInProcess) {
                var onTransitionEnd = function(e) {
                    if (e.propertyName === this._property) {
                        this._animationIsComplete = !this._animationIsComplete;
                        L.DomEvent.removeListener(this._el, L.DomUtil.TRANSITION_END, onTransitionEnd);
                        this._animationInProcess = false;
                        this.fire(this._animationIsComplete ? 'after' : 'before');
                    }
                }

                L.DomEvent.addListener(this._el, L.DomUtil.TRANSITION_END, onTransitionEnd, this);
                this._switchClasses(!this._animationIsComplete); // run animation
                this._animationInProcess = true;
            }
        },
        animationIsComplete: function() {
            return this._animationIsComplete;
        }
    });

    var AnimationSequence = L.Class.extend({
        includes: L.Mixin.Events,
        options: {
            useAnimation: true
        },
        initialize: function(animations, options) {
            this._animations = animations;
            this._animationIsComplete = false;
            this._animationInProcess = false;
            L.setOptions(this, options);
        },
        _reverseArray: function(arr) {
            var n = [];
            for (var i = arr.length - 1; i > -1; i--) {
                n.push(arr[i]);
            }
            return n;
        },
        run: function() {
            var self = this;
            // run animations in different order
            var anims = this._animationIsComplete ? this._reverseArray(this._animations) : this._animations;
            if (!this.options.useAnimation) {
                anims.map(function(animation) {
                    animation.run(false);
                });
                self._animationIsComplete = !self._animationIsComplete;
                self._animationIsComplete ? self.fire('after') : self.fire('before');
            } else if (!this._animationInProcess) {
                var next = function(arr, index) {
                    var anim = arr[index];
                    anim.once('before after', function() {
                        if (index < arr.length - 1) {
                            next(arr, index + 1);
                        } else {
                            self._animationIsComplete = !self._animationIsComplete;
                            self._animationInProcess = false;
                            self._animationIsComplete ? self.fire('after') : self.fire('before');
                        }
                    });
                    anim.run(true);
                };

                this._animationInProcess = true;
                next(anims, 0);
            }
        },
        animationIsComplete: function() {
            return this._animationIsComplete;
        }
    });

    return L.Class.extend({
        includes: [L.Mixin.Events],
        options: {
            useAnimation: true,
            mobileScreenWidthLimit: 768
        },
        initialize: function(options) {
            this._createView();
            this._terminateMouseEvents();
            L.DomUtil.addClass(this._container, 'iconSidebarWidget-right');

            L.setOptions(this, options);

            this._mainAnimation = new AnimationSequence([
                new Animation(this._container, 'iconSidebarWidget', 'bottom', {
                    useAnimation: false
                }),
                new Animation(this._container, 'iconSidebarWidget', 'width', {
                    useAnimation: this.options.useAnimation
                })
            ], {
                useAnimation: this.options.useAnimation
            });

            function switchMobileClass() {
                if (window.innerWidth < this.options.mobileScreenWidthLimit) {
                    if (!L.DomUtil.hasClass(this._container, 'iconSidebarWidget-mobile')) {
                        L.DomUtil.addClass(this._container, 'iconSidebarWidget-mobile');
                        this._isStuck = true;
                        if (this._isOpened) {
                            this.fire('stick', {
                                isStuck: this._isStuck,
                                id: this._activeTabId
                            });
                        }
                    }
                } else {
                    if (L.DomUtil.hasClass(this._container, 'iconSidebarWidget-mobile')) {
                        L.DomUtil.removeClass(this._container, 'iconSidebarWidget-mobile');
                        this._isStuck = false;
                        if (this._isOpened) {
                            this.fire('stick', {
                                isStuck: this._isStuck,
                                id: this._activeTabId
                            });
                        }
                    }
                }
            }
            window.addEventListener('resize', switchMobileClass.bind(this));
            switchMobileClass.call(this);

            this._mainAnimation.on('before', function() {
                this._isOpened = false;
                this._setActiveClass('');
                if (this._isStuck) {
                    this.fire('stick', {
                        isStuck: false,
                        id: this._activeTabId
                    });
                }
                this.fire('closed');
            }.bind(this)).on('after', function() {
                this._isOpened = true;
                this.fire('opened', {
                    id: this._activeTabId
                });
                if (this._isStuck) {
                    this.fire('stick', {
                        isStuck: this._isStuck,
                        id: this._activeTabId
                    });
                }
            }.bind(this));
        },
        _createView: function() {
            var container = this._container = L.DomUtil.create('div', 'iconSidebarWidget');
            this._tabsContainer = L.DomUtil.create('ul', 'iconSidebarWidget-tabs', container);
            this._panesContainer = L.DomUtil.create('div', 'iconSidebarWidget-content', container);
            return container;
        },
        _createTab: function(tabId, ico) {
            var tabEl = L.DomUtil.create('li', 'iconSidebarWidget-tab');
            tabEl.setAttribute('data-tab-id', tabId);
            if (typeof ico === 'string') {
                var iconEl = L.DomUtil.create('i', '', tabEl);
                L.DomUtil.addClass(iconEl, ico);
            } else if (typeof ico.appendTo === 'function') {
                ico.appendTo(tabEl);
            }
            return tabEl;
        },
        _createPane: function(id) {
            var paneEl = L.DomUtil.create('div', 'iconSidebarWidget-pane');
            if (id) {
                paneEl.setAttribute('data-pane-id', id);
            }
            return paneEl;
        },
        _setActiveClass: function(activeId) {
            var i, id;
            for (i = 0; i < this._tabsContainer.children.length; i++) {
                id = this._tabsContainer.children[i].getAttribute('data-tab-id');
                if (id === activeId) {
                    L.DomUtil.addClass(this._tabsContainer.children[i], 'iconSidebarWidget-tab-active');
                    L.DomUtil.addClass(this._panesContainer.querySelector('[data-pane-id=' + id + ']'), 'iconSidebarWidget-pane-active');
                } else {
                    L.DomUtil.removeClass(this._tabsContainer.children[i], 'iconSidebarWidget-tab-active');
                    L.DomUtil.removeClass(this._panesContainer.querySelector('[data-pane-id=' + id + ']'), 'iconSidebarWidget-pane-active');
                }
            }
        },
        _onTabClick: function(e) {
            var activeTabId = e.currentTarget.getAttribute('data-tab-id');
            var previousTabId = this._activeTabId;
            this._activeTabId = activeTabId;
            this._setActiveClass(activeTabId);
            if (previousTabId === activeTabId || !this._mainAnimation.animationIsComplete()) {
                this._mainAnimation.run();
            } else {
                this.fire('opened', {
                    id: this._activeTabId
                });
            }
        },
        _sortTabs: function() {
            var container = this._tabsContainer;
            var tabs = Array.prototype.slice.call(container.children);
            var i, j, maxPosition, tabPosition, maxPositionIndex;
            for (i = 0; i < container.children.length; i++) {
                maxPositionIndex = 0;
                for (j = 0; j < tabs.length; j++) {
                    tabPosition = tabs[j].getAttribute('data-position');
                    maxPosition = tabs[maxPositionIndex].getAttribute('data-position');
                    maxPositionIndex = tabPosition > maxPosition ? j : maxPositionIndex;
                }
                container.appendChild(tabs.splice(maxPositionIndex, 1)[0])
            }
        },
        addTab: function(id, iconClass, position) {
            var tabEl = this._createTab(id, iconClass);
            position = typeof position === 'number' ? position : 0;
            tabEl.setAttribute('data-position', position);
            this._tabsContainer.appendChild(tabEl);
            var paneEl = this._createPane(id);
            this._panesContainer.appendChild(paneEl);
            L.DomEvent.on(tabEl, 'click', this._onTabClick, this);
            position && this._sortTabs();
            return paneEl;
        },
        getContainer: function() {
            return this._container;
        },
        appendTo: function(el) {
            el = el[0] || el;
            el.appendChild(this.getContainer());
        },
        show: function() {
            var el = this.getContainer();
            el.style.display = (this._previousStyleDisplayValue !== 'none' && this._previousStyleDisplayValue) || 'block';
            delete this._previousStyleDisplayValue;
        },
        hide: function() {
            var el = this.getContainer();
            this._previousStyleDisplayValue = el.style.display;
            el.style.display = 'none';
        },
        _terminateMouseEvents: function(el) {
            el = el || this.getContainer();
            L.DomEvent.disableClickPropagation(el);
            el.addEventListener('mousewheel', L.DomEvent.stopPropagation);
            el.addEventListener('mousemove', L.DomEvent.stopPropagation);
        }
    });
});