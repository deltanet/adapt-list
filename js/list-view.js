define([
  'core/js/adapt',
  'core/js/views/componentView'
], function (Adapt, ComponentView) {

  var ListView = ComponentView.extend({

    preRender: function () {
      this.listenTo(Adapt, { "audio:changeText": this.replaceText });
      this.checkIfResetOnRevisit();
    },

    postRender: function () {
      this.setReadyStatus();

      this.setupInviewCompletion('.component__widget');

      if (!this.model.get('_animateList')) return;

      if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
        this.replaceText(Adapt.audio.textSize);
      }

      this.$el.addClass('is-animated-list');
      this.$('.list__container').on('onscreen.animate', this.checkIfOnScreen.bind(this));
    },

    checkIfResetOnRevisit: function () {
      var isResetOnRevisit = this.model.get('_isResetOnRevisit');

      // If reset is enabled set defaults
      if (isResetOnRevisit) {
        this.model.reset(isResetOnRevisit);
      }
    },

    /**
     * Kicks off the list item animation once the list container is at least xx% on screen
     */
    checkIfOnScreen: function (event, measurements) {
      const percentage = this.model.get('_percentInviewVertical') || 70;
      if (measurements.percentInviewVertical < percentage) return;

      $(event.currentTarget).addClass('is-inview').off('onscreen.animate');

      this.animateListItems();
    },

    /**
     * animates the list items in one-by-one
     */
    animateListItems: function () {

      if (this.$el.hasClass('has-animated')) return;

      const itemArray = this.model.get('_items');
      let delay = 200;
      this.$('.list__item').each(function (index, listItem) {

        if (itemArray[index]._delay !== null) {
          delay = itemArray[index]._delay * 1000;
        } else {
          delay = delay * index;
        }

        setTimeout(function () {
          $(listItem).addClass('is-animating');
        }, delay);
      });

      this.$el.addClass('has-animated');
    },

    remove: function () {
      this.$('.list__container').off('onscreen.animate');

      ComponentView.prototype.remove.call(this);
    },

    // Reduced text
    replaceText: function(value) {
      if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._reducedTextisEnabled && this.model.get('_audio') && this.model.get('_audio')._reducedTextisEnabled) {
        // Change each items title and body
        const itemsArray = this.model.get('_items');
        for (var i = 0; i < itemsArray.length; i++) {
          if (value == 0) {
            this.$('.list__item-title').eq(i).html(itemsArray[i].title);
          } else {
            this.$('.list__item-title').eq(i).html(itemsArray[i].titleReduced);
          }
        }
      }
    }
  }, {
    template: 'list'
  });

  return ListView;

});
