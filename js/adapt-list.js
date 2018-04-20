define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var List = ComponentView.extend({

        preRender: function() {
          this.listenTo(Adapt, "audio:changeText", this.replaceText);
          this.checkIfResetOnRevisit();

          this.delay = [];

          for (var i = 0; i < this.model.get('_items').length; i++) {
            if(this.model.get('_items')[i]._delay !== null) {
              this.delay[i] = this.model.get('_items')[i]._delay * 1000;
            } else {
              this.delay[i] = 200 * i;
            }
          }

        },

        postRender: function() {
            /* option to animate list items - excpet when accessibility is enabled or touch device */
            if(this.model.get('_animateList') === true) {
                if (!Adapt.config.get("_accessibility")._isActive && !$('html').hasClass('touch')) {
                    this.$el.addClass('is-animated-list');
                    this.checkIfOnScreen();
                }
            }

            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
                this.replaceText(Adapt.audio.textSize);
            }

            this.setReadyStatus();

            this.setupInview();
        },

        setupInview: function() {
            var selector = this.getInviewElementSelector();

            if (!selector) {
                this.setCompletionStatus();
            } else {
                this.model.set('inviewElementSelector', selector);
                this.$(selector).on('inview', _.bind(this.inview, this));
            }
        },

        /**
         * determines which element should be used for inview logic - body, instruction or title - and returns the selector for that element
         */
        getInviewElementSelector: function() {
            if(this.model.get('body')) return '.component-body';

            if(this.model.get('instruction')) return '.component-instruction';

            if(this.model.get('displayTitle')) return '.component-title';

            return null;
        },

        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$(this.model.get('inviewElementSelector')).off('inview');
                    this.setCompletionStatus();
                }
            }
        },

        checkIfOnScreen: function() {
            this.$('.list-container').on('onscreen', _.bind(this.calculate, this));
        },

        calculate: function(event, listContainer) {
            var $listContainer = this.$(event.currentTarget);
            var triggerPercentage = 70;

            if (listContainer.percentFromTop < triggerPercentage) {
                if (!$listContainer.hasClass('inview')) {
                    $listContainer.addClass('inview');
                    /* animate list items on loop */
                    var allListItems = this.$('.list-item');
                    var count = allListItems.length;

                    for (var i = 0; i < count; i++) {
                      this.animateElement(i);
                    }
                }
            }
        },

        animateElement: function(i) {
          setTimeout(function(){
              this.$('.item-'+i).addClass('animate');
          }, this.delay[i]);
        },

        remove: function() {
            if(this.model.has('inviewElementSelector')) {
                this.$(this.model.get('inviewElementSelector')).off('inview');
            }
            ComponentView.prototype.remove.call(this);
        },

        // Reduced text
        replaceText: function(value) {
            // If enabled
            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
                // Change each items title and body
                for (var i = 0; i < this.model.get('_items').length; i++) {
                    if(value == 0) {
                        this.$('.list-item-title').eq(i).html(this.model.get('_items')[i].title);
                    } else {
                        this.$('.list-item-title').eq(i).html(this.model.get('_items')[i].titleReduced);
                    }
                }
            }
        }
    },
    {
        template: 'list'
    });

    Adapt.register('list', List);

    return List;
});
