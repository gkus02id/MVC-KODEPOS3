/*
 *  Remodal - v1.1.1
 *  Responsive, lightweight, fast, synchronized with CSS animations, fully customizable modal window plugin with declarative configuration and hash tracking.
 *  http://vodkabears.github.io/remodal/
 *
 *  Made by Ilya Makarov
 *  Under MIT License
 */

!(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], function($) {
      return factory(root, $);
    });
  } else if (typeof exports === 'object') {
    factory(root, require('jquery'));
  } else {
    factory(root, root.jQuery || root.Zepto);
  }
})(this, function(global, $) {

  'use strict';

  /**
   * Name of the plugin
   * @private
   * @const
   * @type {String}
   */
  var PLUGIN_NAME = 'printremodal';

  /**
   * Namespace for CSS and events
   * @private
   * @const
   * @type {String}
   */
  var NAMESPACE = global.PRINTREMODAL_GLOBALS && global.PRINTREMODAL_GLOBALS.NAMESPACE || PLUGIN_NAME;

  /**
   * Animationstart event with vendor prefixes
   * @private
   * @const
   * @type {String}
   */
  var ANIMATIONSTART_EVENTS = $.map(
    ['animationstart', 'webkitAnimationStart', 'MSAnimationStart', 'oAnimationStart'],

    function(eventName) {
      return eventName + '.' + NAMESPACE;
    }

  ).join(' ');

  /**
   * Animationend event with vendor prefixes
   * @private
   * @const
   * @type {String}
   */
  var ANIMATIONEND_EVENTS = $.map(
    ['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'],

    function(eventName) {
      return eventName + '.' + NAMESPACE;
    }

  ).join(' ');

  /**
   * Default settings
   * @private
   * @const
   * @type {Object}
   */
  var DEFAULTS = $.extend({
    hashTracking: true,
    closeOnConfirm: true,
    closeOnCancel: true,
    closeOnEscape: true,
    closeOnOutsideClick: true,
    modifier: '',
    appendTo: null
  }, global.PRINTREMODAL_GLOBALS && global.PRINTREMODAL_GLOBALS.DEFAULTS);

  /**
   * States of the printremodal
   * @private
   * @const
   * @enum {String}
   */
  var STATES = {
    CLOSING: 'printclosing',
    CLOSED: 'printclosed',
    OPENING: 'printopening',
    OPENED: 'printopened'
  };

  /**
   * Reasons of the state change.
   * @private
   * @const
   * @enum {String}
   */
  var STATE_CHANGE_REASONS = {
    CONFIRMATION: 'printconfirmation',
    CANCELLATION: 'printcancellation'
  };

  /**
   * Is animation supported?
   * @private
   * @const
   * @type {Boolean}
   */
  var IS_ANIMATION = (function() {
    var style = document.createElement('div').style;

    return style.animationName !== undefined ||
      style.WebkitAnimationName !== undefined ||
      style.MozAnimationName !== undefined ||
      style.msAnimationName !== undefined ||
      style.OAnimationName !== undefined;
  })();

  /**
   * Is iOS?
   * @private
   * @const
   * @type {Boolean}
   */
  var IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform);

  /**
   * Current modal
   * @private
   * @type {printremodal}
   */
  var current;

  /**
   * Scrollbar position
   * @private
   * @type {Number}
   */
  var scrollTop;

  /**
   * Returns an animation duration
   * @private
   * @param {jQuery} $elem
   * @returns {Number}
   */
  function getAnimationDuration($elem) {
    if (
      IS_ANIMATION &&
      $elem.css('animation-name') === 'none' &&
      $elem.css('-webkit-animation-name') === 'none' &&
      $elem.css('-moz-animation-name') === 'none' &&
      $elem.css('-o-animation-name') === 'none' &&
      $elem.css('-ms-animation-name') === 'none'
    ) {
      return 0;
    }

    var duration = $elem.css('animation-duration') ||
      $elem.css('-webkit-animation-duration') ||
      $elem.css('-moz-animation-duration') ||
      $elem.css('-o-animation-duration') ||
      $elem.css('-ms-animation-duration') ||
      '0s';

    var delay = $elem.css('animation-delay') ||
      $elem.css('-webkit-animation-delay') ||
      $elem.css('-moz-animation-delay') ||
      $elem.css('-o-animation-delay') ||
      $elem.css('-ms-animation-delay') ||
      '0s';

    var iterationCount = $elem.css('animation-iteration-count') ||
      $elem.css('-webkit-animation-iteration-count') ||
      $elem.css('-moz-animation-iteration-count') ||
      $elem.css('-o-animation-iteration-count') ||
      $elem.css('-ms-animation-iteration-count') ||
      '1';

    var max;
    var len;
    var num;
    var i;

    duration = duration.split(', ');
    delay = delay.split(', ');
    iterationCount = iterationCount.split(', ');

    // The 'duration' size is the same as the 'delay' size
    for (i = 0, len = duration.length, max = Number.NEGATIVE_INFINITY; i < len; i++) {
      num = parseFloat(duration[i]) * parseInt(iterationCount[i], 10) + parseFloat(delay[i]);

      if (num > max) {
        max = num;
      }
    }

    return max;
  }

  /**
   * Returns a scrollbar width
   * @private
   * @returns {Number}
   */
  function getScrollbarWidth() {
    if ($(document).height() <= $(window).height()) {
      return 0;
    }

    var outer = document.createElement('div');
    var inner = document.createElement('div');
    var widthNoScroll;
    var widthWithScroll;

    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    document.body.appendChild(outer);

    widthNoScroll = outer.offsetWidth;

    // Force scrollbars
    outer.style.overflow = 'scroll';

    // Add inner div
    inner.style.width = '100%';
    outer.appendChild(inner);

    widthWithScroll = inner.offsetWidth;

    // Remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }

  /**
   * Locks the screen
   * @private
   */
  function lockScreen() {
    if (IS_IOS) {
      return;
    }

    var $html = $('html');
    var lockedClass = namespacify('is-locked');
    var paddingRight;
    var $body;

    if (!$html.hasClass(lockedClass)) {
      $body = $(document.body);

      // Zepto does not support '-=', '+=' in the `css` method
      paddingRight = parseInt($body.css('padding-right'), 10) + getScrollbarWidth();

      $body.css('padding-right', paddingRight + 'px');
      $html.addClass(lockedClass);
    }
  }

  /**
   * Unlocks the screen
   * @private
   */
  function unlockScreen() {
    if (IS_IOS) {
      return;
    }

    var $html = $('html');
    var lockedClass = namespacify('is-locked');
    var paddingRight;
    var $body;

    if ($html.hasClass(lockedClass)) {
      $body = $(document.body);

      // Zepto does not support '-=', '+=' in the `css` method
      paddingRight = parseInt($body.css('padding-right'), 10) - getScrollbarWidth();

      $body.css('padding-right', paddingRight + 'px');
      $html.removeClass(lockedClass);
    }
  }

  /**
   * Sets a state for an instance
   * @private
   * @param {printremodal} instance
   * @param {STATES} state
   * @param {Boolean} isSilent If true, printremodal does not trigger events
   * @param {String} Reason of a state change.
   */
  function setState(instance, state, isSilent, reason) {

    var newState = namespacify('is', state);
    var allStates = [namespacify('is', STATES.CLOSING),
                     namespacify('is', STATES.OPENING),
                     namespacify('is', STATES.CLOSED),
                     namespacify('is', STATES.OPENED)].join(' ');

    instance.$bg
      .removeClass(allStates)
      .addClass(newState);

    instance.$overlay
      .removeClass(allStates)
      .addClass(newState);

    instance.$wrapper
      .removeClass(allStates)
      .addClass(newState);

    instance.$modal
      .removeClass(allStates)
      .addClass(newState);

    instance.state = state;
    !isSilent && instance.$modal.trigger({
      type: state,
      reason: reason
    }, [{ reason: reason }]);
  }

  /**
   * Synchronizes with the animation
   * @param {Function} doBeforeAnimation
   * @param {Function} doAfterAnimation
   * @param {printremodal} instance
   */
  function syncWithAnimation(doBeforeAnimation, doAfterAnimation, instance) {
    var runningAnimationsCount = 0;

    var handleAnimationStart = function(e) {
      if (e.target !== this) {
        return;
      }

      runningAnimationsCount++;
    };

    var handleAnimationEnd = function(e) {
      if (e.target !== this) {
        return;
      }

      if (--runningAnimationsCount === 0) {

        // Remove event listeners
        $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
          instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
        });

        doAfterAnimation();
      }
    };

    $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
      instance[elemName]
        .on(ANIMATIONSTART_EVENTS, handleAnimationStart)
        .on(ANIMATIONEND_EVENTS, handleAnimationEnd);
    });

    doBeforeAnimation();

    // If the animation is not supported by a browser or its duration is 0
    if (
      getAnimationDuration(instance.$bg) === 0 &&
      getAnimationDuration(instance.$overlay) === 0 &&
      getAnimationDuration(instance.$wrapper) === 0 &&
      getAnimationDuration(instance.$modal) === 0
    ) {

      // Remove event listeners
      $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
        instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
      });

      doAfterAnimation();
    }
  }

  /**
   * Closes immediately
   * @private
   * @param {printremodal} instance
   */
  function halt(instance) {
    if (instance.state === STATES.CLOSED) {
      return;
    }

    $.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName) {
      instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
    });

    instance.$bg.removeClass(instance.settings.modifier);
    instance.$overlay.removeClass(instance.settings.modifier).hide();
    instance.$wrapper.hide();
    unlockScreen();
    setState(instance, STATES.CLOSED, true);
  }

  /**
   * Parses a string with options
   * @private
   * @param str
   * @returns {Object}
   */
  function parseOptions(str) {
    var obj = {};
    var arr;
    var len;
    var val;
    var i;

    // Remove spaces before and after delimiters
    str = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');

    // Parse a string
    arr = str.split(',');
    for (i = 0, len = arr.length; i < len; i++) {
      arr[i] = arr[i].split(':');
      val = arr[i][1];

      // Convert a string value if it is like a boolean
      if (typeof val === 'string' || val instanceof String) {
        val = val === 'true' || (val === 'false' ? false : val);
      }

      // Convert a string value if it is like a number
      if (typeof val === 'string' || val instanceof String) {
        val = !isNaN(val) ? +val : val;
      }

      obj[arr[i][0]] = val;
    }

    return obj;
  }

  /**
   * Generates a string separated by dashes and prefixed with NAMESPACE
   * @private
   * @param {...String}
   * @returns {String}
   */
  function namespacify() {
    var result = NAMESPACE;

    for (var i = 0; i < arguments.length; ++i) {
      result += '-' + arguments[i];
    }

    return result;
  }

  /**
   * Handles the hashchange event
   * @private
   * @listens hashchange
   */
  function handleHashChangeEvent() {
    var id = location.hash.replace('#', '');
    var instance;
    var $elem;

    if (!id) {

      // Check if we have currently opened modal and animation was completed
      if (current && current.state === STATES.OPENED && current.settings.hashTracking) {
        current.close();
      }
    } else {

      // Catch syntax error if your hash is bad
      try {
        $elem = $(
          '[data-' + PLUGIN_NAME + '-id="' + id + '"]'
        );
      } catch (err) {}

      if ($elem && $elem.length) {
        instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];

        if (instance && instance.settings.hashTracking) {
          instance.open();
        }
      }

    }
  }

  /**
   * Printremodal constructor
   * @constructor
   * @param {jQuery} $modal
   * @param {Object} options
   */
  function Printremodal($modal, options) {
    var $body = $(document.body);
    var $appendTo = $body;
    var printremodal = this;

    printremodal.settings = $.extend({}, DEFAULTS, options);
    printremodal.index = $[PLUGIN_NAME].lookup.push(printremodal) - 1;
    printremodal.state = STATES.CLOSED;

    printremodal.$overlay = $('.' + namespacify('overlay'));

    if (printremodal.settings.appendTo !== null && printremodal.settings.appendTo.length) {
      $appendTo = $(printremodal.settings.appendTo);
    }

    if (!printremodal.$overlay.length) {
      printremodal.$overlay = $('<div>').addClass(namespacify('overlay') + ' ' + namespacify('is', STATES.CLOSED)).hide();
      $appendTo.append(printremodal.$overlay);
    }

    printremodal.$bg = $('.' + namespacify('bg')).addClass(namespacify('is', STATES.CLOSED));

    printremodal.$modal = $modal
      .addClass(
        NAMESPACE + ' ' +
        namespacify('is-initialized') + ' ' +
        printremodal.settings.modifier + ' ' +
        namespacify('is', STATES.CLOSED))
      .attr('tabindex', '-1');

    printremodal.$wrapper = $('<div>')
      .addClass(
        namespacify('wrapper') + ' ' +
        printremodal.settings.modifier + ' ' +
        namespacify('is', STATES.CLOSED))
      .hide()
      .append(printremodal.$modal);
    $appendTo.append(printremodal.$wrapper);

    // Add the event listener for the close button
    printremodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="close"]', function(e) {
      e.preventDefault();
	  
	  printremodal.close();
    });
	
    // Add the event listener for the cancel button
    printremodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="cancel"]', function(e) {
      e.preventDefault();

      printremodal.$modal.trigger(STATE_CHANGE_REASONS.CANCELLATION);

      if (printremodal.settings.closeOnCancel) {
        printremodal.close(STATE_CHANGE_REASONS.CANCELLATION);
      }
    });

    // Add the event listener for the confirm button
    printremodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="confirm"]', function(e) {
      e.preventDefault();

      printremodal.$modal.trigger(STATE_CHANGE_REASONS.CONFIRMATION);

      if (printremodal.settings.closeOnConfirm) {
        printremodal.close(STATE_CHANGE_REASONS.CONFIRMATION);
      }
    });

    // Add the event listener for the overlay
    printremodal.$wrapper.on('click.' + NAMESPACE, function(e) {
      var $target = $(e.target);

      if (!$target.hasClass(namespacify('wrapper'))) {
        return;
      }

      if (printremodal.settings.closeOnOutsideClick) {
        printremodal.close();
      }
    });
  }

  /**
   * Opens a modal window
   * @public
   */
  Printremodal.prototype.open = function() {
    var printremodal = this;
    var id;

    // Check if the animation was completed
    if (printremodal.state === STATES.OPENING || printremodal.state === STATES.CLOSING) {
      return;
    }

    id = printremodal.$modal.attr('data-' + PLUGIN_NAME + '-id');

    if (id && printremodal.settings.hashTracking) {
      scrollTop = $(window).scrollTop();
      location.hash = id;
    }

    if (current && current !== printremodal) {
      halt(current);
    }

    current = printremodal;
    lockScreen();
    printremodal.$bg.addClass(printremodal.settings.modifier);
    printremodal.$overlay.addClass(printremodal.settings.modifier).show();
    printremodal.$wrapper.show().scrollTop(0);
    printremodal.$modal.focus();

    syncWithAnimation(
      function() {
        setState(printremodal, STATES.OPENING);
      },

      function() {
        setState(printremodal, STATES.OPENED);
      },

      printremodal);
  };

  /**
   * Closes a modal window
   * @public
   * @param {String} reason
   */
  Printremodal.prototype.close = function(reason) {
    var printremodal = this;
	
	// Check if the animation was completed
    if (printremodal.state === STATES.OPENING || printremodal.state === STATES.CLOSING || printremodal.state === STATES.CLOSED) {
      return;
    }
	
	if (
      printremodal.settings.hashTracking &&
      printremodal.$modal.attr('data-' + PLUGIN_NAME + '-id') === location.hash.substr(1)
    ) {
      //location.hash = '';
      //$(window).scrollTop(scrollTop);
    }
	
	syncWithAnimation(
      function() {
        setState(printremodal, STATES.CLOSING, false, reason);
      },

      function() {
        printremodal.$bg.removeClass(printremodal.settings.modifier);
        printremodal.$overlay.removeClass(printremodal.settings.modifier).hide();
        printremodal.$wrapper.hide();
        unlockScreen();

        setState(printremodal, STATES.CLOSED, false, reason);
      },

      printremodal);
	  
  };

  /**
   * Returns a current state of a modal
   * @public
   * @returns {STATES}
   */
  Printremodal.prototype.getState = function () {
    return this.state;
  };

  /**
   * Destroys a modal
   * @public
   */
  Printremodal.prototype.destroy = function () {
    var lookup = $[PLUGIN_NAME].lookup;
    var instanceCount;
	
	halt(this);
    this.$wrapper.remove();

    delete lookup[this.index];
    instanceCount = $.grep(lookup, function(instance) {
      return !!instance;
    }).length;

    if (instanceCount === 0) {
      this.$overlay.remove();
      this.$bg.removeClass(
        namespacify('is', STATES.CLOSING) + ' ' +
        namespacify('is', STATES.OPENING) + ' ' +
        namespacify('is', STATES.CLOSED) + ' ' +
        namespacify('is', STATES.OPENED));
    }
  };

  /**
   * Special plugin object for instances
   * @public
   * @type {Object}
   */
  $[PLUGIN_NAME] = {
    lookup: []
  };

  /**
   * Plugin constructor
   * @constructor
   * @param {Object} options
   * @returns {JQuery}
   */
  $.fn[PLUGIN_NAME] = function(opts) {
    var instance;
    var $elem;

    this.each(function(index, elem) {
      $elem = $(elem);

      if ($elem.data(PLUGIN_NAME) == null) {
        instance = new Printremodal($elem, opts);
        $elem.data(PLUGIN_NAME, instance.index);

        if (
          instance.settings.hashTracking &&
          $elem.attr('data-' + PLUGIN_NAME + '-id') === location.hash.substr(1)
        ) {
          instance.open();
        }
      } else {
        instance = $[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];
      }
    });

    return instance;
  };

  $(document).ready(function() {

    // data-printremodal-target opens a modal window with the special Id
    $(document).on('click', '[data-' + PLUGIN_NAME + '-target]', function(e) {
      e.preventDefault();
	 
      var elem = e.currentTarget;
      var id = elem.getAttribute('data-' + PLUGIN_NAME + '-target');
      var $target = $('[data-' + PLUGIN_NAME + '-id="' + id + '"]');
	  
	  $[PLUGIN_NAME].lookup[$target.data(PLUGIN_NAME)].open();
    });

    // Auto initialization of modal windows
    // They should have the 'printremodal' class attribute
    // Also you can write the `data-printremodal-options` attribute to pass params into the modal
    $(document).find('.' + NAMESPACE).each(function(i, container) {
      var $container = $(container);
      var options = $container.data(PLUGIN_NAME + '-options');

      if (!options) {
        options = {};
      } else if (typeof options === 'string' || options instanceof String) {
        options = parseOptions(options);
      }

      $container[PLUGIN_NAME](options);
    });

    // Handles the keydown event
    $(document).on('keydown.' + NAMESPACE, function(e) {
      if (current && current.settings.closeOnEscape && current.state === STATES.OPENED && e.keyCode === 27) {
        current.close();
      }
    });

    // Handles the hashchange event
    $(window).on('hashchange.' + NAMESPACE, handleHashChangeEvent);
  });
});
