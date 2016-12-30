import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { check, Match } from 'meteor/check';

let CONTAINER;
let LOADING_TEMPLATE_NAME;


/**
 * jQuery plugin to determine whether an element is "almost visible".
 * @return {Boolean}
 */
$.fn.isAlmostVisible = function jQueryIsAlmostVisible() {
  if (this.length === 0) {
    return undefined;
  }

  const rect = this[0].getBoundingClientRect();

  return (
  rect.top >= 0 &&
  rect.left >= 0 &&
  rect.bottom <= ($(CONTAINER).height() * 1.5) &&
  rect.right <= $(CONTAINER).width()
  );
};

/**
 * Enable infinite scrolling on a template.
 */
Blaze.TemplateInstance.prototype.infiniteScroll = function infiniteScroll(options) {
  // Validate the options
  check(options.container, String);
  check(options.loadingTemplateName, Match.Maybe(String));
  check(options.isDataReady, Function);
  check(options.onLoaded, Match.Maybe(Function));

  const template = this;

  /*
   * Create config from defaults
   */
  const _defaults = {
    // Container will use to scroll
    container: window,
    // On item loaded
    onLoaded() {},
  };
  const config = Object.assign(_defaults, options);


  CONTAINER = config.container || _defaults.container;
  LOADING_TEMPLATE_NAME = config.loadingTemplateName;

  template.isDataReady = config.isDataReady;


  const triggerLoadMore = () => {
    if ($('.infinite-load-more').isAlmostVisible()) {
      config.onLoaded();
    }
  };

  const triggerLoadMoreThrottled = _.throttle(triggerLoadMore, 500, { leading: false });
  // Trigger loadMore when we've scrolled/resized close to revealing .load-more
  $(CONTAINER).off('scroll resize');
  $(CONTAINER).on('scroll resize', triggerLoadMoreThrottled);
};

Template.infiniteScroll.helpers({
  loading() {
    // Loop through parent templates until we find isDataReady
    let template = Template.instance();

    while (!template.isDataReady) {
      const parent = template.parents();
      if (!parent) {
        break;
      }
      template = parent;
    }

    return !template.isDataReady();
  },
  loadingTemplateName() {
    return LOADING_TEMPLATE_NAME;
  },
});
