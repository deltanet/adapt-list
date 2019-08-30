define([
    'core/js/adapt',
    'core/js/views/componentView',
    'core/js/models/componentModel'
], function(Adapt, ComponentView, ComponentModel) {

    var ListView = ComponentView.extend({

        preRender: function() {
          this.listenTo(Adapt, {
              'popup:opened': this.popupOpened,
              'popup:closed': this.popupClosed,
              'audio:changeText': this.replaceText
          });

          this.checkIfResetOnRevisit();

          this.allItemsAnimated = false;
          this.popupIsOpen = false;

          this.delay = [];
          this.animation = [];
          this.animationComplete = [];

          for (var i = 0; i < this.model.get('_items').length; i++) {
            this.animationComplete[i] = false;

            if(this.model.get('_items')[i]._delay !== null) {
              this.delay[i] = this.model.get('_items')[i]._delay * 1000;
            } else {
              this.delay[i] = 200 * i;
            }
          }
        },

        postRender: function() {
            // Check if notify is visible
            if ($('body').children('.notify').css('visibility') == 'visible') {
                this.popupOpened();
            }
            /* option to animate list items - excpet when accessibility is enabled or touch device */
            if (this.model.get('_animateList') === true) {
                if (!Adapt.config.get("_accessibility")._isActive && !$('html').hasClass('touch')) {
                    this.$el.addClass('is-animated-list');
                    this.allItemsAnimated = false;
                    this.checkIfOnScreen();
                }
            }

            if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
                this.replaceText(Adapt.audio.textSize);
            }

            this.setReadyStatus();

            this.setupInview();
        },

        popupOpened: function() {
            if (this.allItemsAnimated) return;

            this.popupIsOpen = true;

            this.$('.list-container').removeClass('inview');

            var allListItems = this.$('.list-item');

            for (var i = 0; i < allListItems.length; i++) {
              this.animateElement(i, false);
            }
        },

        popupClosed: function() {
            this.popupIsOpen = false;
            if (!this.allItemsAnimated) {
              this.checkIfOnScreen();
            }
        },

        setupInview: function() {
            var selector = this.getInviewElementSelector();
            if (!selector) {
                this.setCompletionStatus();
                return;
            }

            this.setupInviewCompletion(selector);
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

        checkIfOnScreen: function() {
            if (this.popupIsOpen == true) return;

            this.$('.list-container').on('onscreen', _.bind(this.calculate, this));
        },

        calculate: function(event, listContainer) {
          if (this.popupIsOpen == true) return;

          var $listContainer = this.$(event.currentTarget);
          var triggerPercentage = 70;

          if (listContainer.onscreen && listContainer.percentFromTop < triggerPercentage) {
            if (!$listContainer.hasClass('inview')) {
              $listContainer.addClass('inview');
              /* animate list items on loop */
              var allListItems = this.$('.list-item');
              var count = allListItems.length;

              for (var i = 0; i < count; i++) {
                this.animateElement(i, true);
              }
            }
          }
        },

        animateElement: function(i, status) {
          if (status) {
            var that = this;
            this.animation[i] = setTimeout(function(){
                that.updateItem(i, true);
            }, this.delay[i]);
          } else {
            clearTimeout(this.animation[i]);
            this.$('.item-'+i).removeClass('animate');
          }
        },

        updateItem: function(i, animate) {
          this.$('.item-'+i).addClass('animate');
          this.animationComplete[i] = true;
          this.checkAllItems();
        },

        checkAllItems: function() {
          for (var i = 0; i < this.model.get('_items').length; i++) {
            if (this.animationComplete[i] == true) {
              this.allItemsAnimated = true;
            }
          }
        },

        remove: function() {
            this.$('.list-container').off('onscreen');

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

    return Adapt.register('list', {
        model: ComponentModel.extend({}),// create a new class in the inheritance chain so it can be extended per component type if necessary later
        view: ListView
    });
});
