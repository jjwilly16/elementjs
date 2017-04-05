(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.element = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

/**
 * El Class
 * @class
 * @classdesc Creates an HTML element and wraps it with convenience methods.
 */
var El = function () {

    /**
     * El class constructor.
     * @param {String} type - Type of element to create.
     * @param {Object} attrs - Attributes to set.
     * @param {Array} children - Child elements to nest.
     * @returns {Object} El class instance.
     */
    function El(type, attrs, children) {
        classCallCheck(this, El);


        if (El.isArray(attrs)) children = attrs;

        /**
         * @member
         * @type {Object}
         */
        this.attributes = El.isObject(attrs) ? attrs : {};

        /**
         * @member
         * @type {String}
         */
        this.type = type.split('.')[0].split('#')[0];

        /**
         * @member
         * @type {Array}
         */
        this.events = [];

        /**
         * @member
         * @type {Object}
         */
        this.element = this._createElement();

        // SET ATTRIBUTES
        this._setAttributes();

        this._parseType(type);

        /**
         * @member
         * @type {Array}
         */
        this.children = El.isArray(children) ? this._setChildren(children) : null;

        return this;
    }

    /**
     * Simple array check.
     * @static
     * @public
     * @param item - Item to check.
     * @returns {Boolean} Is array.
     */


    createClass(El, [{
        key: '_getChildren',


        /**
         * Gets all nested child El instances. Recursive.
         * @private
         * @param {String|Array} type - Element type filter.
         * @returns {Array} Child el instances.
         */
        value: function _getChildren(type, returnedEls) {
            type = type || [];
            returnedEls = returnedEls || [];
            var children = this.children;
            var i = 0;
            for (; i < children.length; i++) {
                var child = children[i];
                if (type && type.length) {
                    if (type.indexOf(child.type) > -1) returnedEls.push(child);
                } else {
                    returnedEls.push(child);
                }
                if (child.children) this._getChildren.call(child, type, returnedEls);
            }
            return returnedEls;
        }

        /**
         * Parse the type.
         * @private
         * @returns {String} Element type.
         */

    }, {
        key: '_parseType',
        value: function _parseType(type) {
            var matchPattern = /([a-z]+|#[\w-\d]+|\.[\w\d-]+)/g;
            if (!El.isString(type)) throw new Error('El TypeError: The first parameter must be a string!');
            var matches = type.match(matchPattern);
            var elementType = matches.shift();
            for (var i = 0; i < matches.length; i++) {
                if (matches[i].indexOf('#') > -1) this.setAttribute('id', matches[i].slice(1));
                if (matches[i].indexOf('.') > -1) this.addClass(matches[i].slice(1));
            }
            return elementType;
        }

        /**
         * Creates dom element.
         * @private
         * @returns {Object} Dom node.
         */

    }, {
        key: '_createElement',
        value: function _createElement() {

            return document.createElement(this.type);
        }

        /**
         * Sets all attributes.
         * @private
         */

    }, {
        key: '_setAttributes',
        value: function _setAttributes() {

            var attrs = this.attributes;

            for (var prop in attrs) {
                if (attrs.hasOwnProperty(prop)) {
                    if (attrs[prop] !== undefined && attrs[prop] !== null) {
                        this.element.setAttribute(prop, El.isArray(attrs[prop]) ? attrs[prop].join(' ') : attrs[prop]);
                    }
                }
            }
        }

        /**
         * Set the child elements.
         * @private
         * @returns {Array} Child elements.
         */

    }, {
        key: '_setChildren',
        value: function _setChildren(children) {

            var tracker = {};

            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                this.append(child);
                if (!tracker[child.type]) tracker[child.type] = [];
                tracker[child.type].push(child.type);
                child._key = child.getAttribute('id') || '' + child.type + (tracker[child.type].length - 1);
                this[child._key] = child;
            }

            return children;
        }

        /**
         * Adds a class or classes to an element.
         * @chainable
         * @public
         * @param {String|Array} myClass - ClassName(s) to add. Can be a space-separated string or an array.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'addClass',
        value: function addClass(myClass) {
            if (!myClass) return this;
            if (El.isArray(myClass)) myClass = myClass.join(' ');
            if (myClass.indexOf(' ') > -1) {
                myClass = myClass.split(' ');
                for (var i = 0; i < myClass.length; i++) {
                    if ((' ' + this.element.className + ' ').indexOf(' ' + myClass[i] + ' ') === -1) {

                        if (this.element.classList) this.element.classList.add(myClass[i]);else this.element.className += ' ' + myClass[i];
                    }
                }
            } else if ((' ' + this.element.className + ' ').indexOf(' ' + myClass + ' ') === -1) {

                if (this.element.classList) this.element.classList.add(myClass);else this.element.className += ' ' + myClass;
            }
            return this;
        }

        /**
         * Append an element or text node.
         * @chainable
         * @public
         * @param {Object|String} el - Element to append or string to become text node to append.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'append',
        value: function append(el) {
            if (!el) return this;
            if (El.isObject(el)) this.element.appendChild(el.element || el);
            if (El.isString(el)) this.element.appendChild(document.createTextNode(el));

            return this;
        }

        /**
         * Blur element (just a wrapper for the .blur DOM method).
         * @chainable
         * @public
         * @returns {Object} El class instance.
         */

    }, {
        key: 'blur',
        value: function blur() {
            this.element.blur();
            return this;
        }

        /**
         * Simulate an element click (just a wrapper for the .click DOM method).
         * @public
         * @chainable
         * @returns {Object} El class instance.
         */

    }, {
        key: 'click',
        value: function click() {
            this.element.click();
            return this;
        }

        /**
         * Disable an element by attribute and class.
         * @chainable
         * @public
         * @param {Boolean} [shouldDisable=true] - Conditionally disable.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'disable',
        value: function disable(shouldDisable) {
            shouldDisable = El.isBoolean(shouldDisable) ? shouldDisable : true;
            if (shouldDisable) this.setAttribute('disabled', 'disabled').addClass('disabled');
            return this;
        }

        /**
         * Empty an element's html content.
         * @chainable
         * @public
         * @returns {Object} El class instance.
         */

    }, {
        key: 'empty',
        value: function empty() {
            this.element.innerHTML = '';
            return this;
        }

        /**
         * Enable an element by attribute and class.
         * @chainable
         * @public
         * @param {Boolean} [shouldEnable=true] - Conditionally enable.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'enable',
        value: function enable(shouldEnable) {
            shouldEnable = El.isBoolean(shouldEnable) ? shouldEnable : true;
            if (shouldEnable) this.removeAttribute('disabled').removeClass('disabled');
            return this;
        }

        /**
         * Convert field value to URL encoded query string.
         * @public
         * @returns {String} URL encoded query string.
         */

    }, {
        key: 'encode',
        value: function encode() {
            return El.toQueryString(this.serialize('object'));
        }

        /**
         * Fade in element.
         * @chainable
         * @public
         * @param {Number} interval - Transition interval.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'fadeIn',
        value: function fadeIn(interval) {
            interval = interval || 0.3;
            this.element.style.opacity = 1;
            this.element.style.transition = 'opacity ' + interval + 's ease-in-out';
            return this;
        }

        /**
         * Fade out element.
         * @chainable
         * @public
         * @param {Number} interval - Transition interval.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'fadeOut',
        value: function fadeOut(interval) {
            interval = interval || 0.3;
            this.element.style.opacity = 0;
            this.element.style.transition = 'opacity ' + interval + 's ease-in-out';
            return this;
        }

        /**
         * Set focus on element.
         * @chainable
         * @public
         * @returns {Object} El class instance.
         */

    }, {
        key: 'focus',
        value: function focus() {
            this.element.focus();
            return this;
        }

        /**
         * Gets an attribute.
         * @public
         * @param {String} attr - Attribute name to get.
         * @returns {String} Attribute value.
         */

    }, {
        key: 'getAttribute',
        value: function getAttribute(attr) {
            if (!attr) return null;
            return this.element.getAttribute(attr);
        }

        /**
         * Gets all nested child El instances.
         * @public
         * @param {String|Array} typeFilter - Element type filter.
         * @returns {Array} Child El instances.
         */

    }, {
        key: 'getChildren',
        value: function getChildren(typeFilter) {
            typeFilter = typeFilter || [];
            typeFilter = El.isArray(typeFilter) ? typeFilter : typeFilter.split();
            return this._getChildren(typeFilter);
        }

        /**
         * Gets the html content.
         * @public
         * @returns {String} Html content.
         */

    }, {
        key: 'getHTML',
        value: function getHTML() {
            return this.element.innerHTML;
        }

        /**
         * Gets the text content.
         * @chainable
         * @public
         * @returns {String} Text content.
         */

    }, {
        key: 'getText',
        value: function getText() {
            return this.element.textContent;
        }

        /**
         * Gets the value.
         * @public
         * @returns {String} Element value.
         */

    }, {
        key: 'getValue',
        value: function getValue() {
            return this.element.value;
        }

        /**
         * Check for existence of an attribute.
         * @public
         * @param {String} attrToCheck - Attribute to check.
         * @returns {Booolean} Has attribute.
         */

    }, {
        key: 'hasAttribute',
        value: function hasAttribute(attrToCheck) {
            if (this.element.hasAttribute(attrToCheck)) return true;
            return false;
        }

        /**
         * Check for class existence.
         * @public
         * @param {String} classToCheck - Classname to check.
         * @returns {Boolean} Class exists.
         */

    }, {
        key: 'hasClass',
        value: function hasClass(classToCheck) {

            // return new RegExp(` ${classToCheck} `).test(` ${this.element.className} `);
            if (this.element.classList) return this.element.classList.contains(classToCheck);
            return new RegExp('(^| )' + classToCheck + '( |$)', 'gi').test(this.element.className);
        }

        /**
         * Check if an element has a value.
         * @public
         * @returns {Boolean} Element has value.
         */

    }, {
        key: 'hasValue',
        value: function hasValue() {

            var val = this.getValue();
            if (val !== '' && val.length > 0) return true;
            return false;
        }

        /**
         * Hide element with display rule.
         * @chainable
         * @public
         * @returns {Object} El class instance.
         */

    }, {
        key: 'hide',
        value: function hide() {
            this.element.style.display = 'none';
            return this;
        }

        /**
         * Call hide method, then show after x amount of ms.
         * @chainable
         * @public
         * @param {Number} [time=3000] - Interval to hide.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'hideFor',
        value: function hideFor(time) {
            var _this = this;

            time = time || 3000;
            this.hide();
            setTimeout(function () {
                return _this.show();
            }, time);
            return this;
        }

        /**
         * Return the next sibling element
         * @public
         * @returns {Object} node
         */

    }, {
        key: 'next',
        value: function next() {
            return this.element.nextElementSibling || null;
        }

        /**
         * Detach event handler.
         * @chainable
         * @public
         * @param {String} eventName - Name of event.
         * @param {Function} handler - Function reference.
         * @param {Boolean} [bubbles=false] - useCapture option.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'off',
        value: function off(eventName, handler, bubbles) {
            var events = this.events;
            if (!handler) {
                for (var i = events.length - 1; i >= 0; i--) {
                    if (events[i].event === eventName) {
                        this.element.removeEventListener(events[i].event, events[i].handler, events[i].useCapture);
                        events.splice(i, 1);
                    }
                }
                return this;
            }
            bubbles = bubbles || false;
            var index = events.map(function (i) {
                return i.event;
            }).indexOf(eventName);
            this.element.removeEventListener(eventName, handler, bubbles);
            events.splice(index, 1);
            return this;
        }

        /**
         * Listen for events.
         * @chainable
         * @public
         * @param {String|Array} eventsToBind - Name of event(s) to bind. Can be either space-separated string or array.
         * @param {Function} handler - Function handler reference.
         * @param {Boolean} [bubbles=false] - useCapture option.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'on',
        value: function on(eventsToBind, handler, bubbles) {
            var _this2 = this;

            bubbles = bubbles || false;
            var namespace = null;
            var eventParts = El.isArray(eventsToBind) ? eventsToBind : eventsToBind.split(/\s+/);
            for (var i = 0; i < eventParts.length; i++) {
                var eventName = eventParts[i];
                if (eventName.indexOf('.') > -1) {
                    var splitEvent = eventName.split('.');
                    namespace = splitEvent.slice(1).join('.');
                }
                var eventHandler = function eventHandler(e) {
                    e.namespace = namespace;
                    handler.call(_this2, e);
                };
                this.element.addEventListener(eventName, eventHandler, bubbles);
                this.events.push({
                    event: eventName,
                    handler: eventHandler,
                    namespace: namespace,
                    useCapture: bubbles,
                    once: false
                });
            }

            return this;
        }

        /**
         * Attach event handler once.
         * @chainable
         * @public
         * @param {String|Array} eventsToBind - Name of event(s).
         * @param {Function} handler - Function reference.
         * @param {Boolean} [bubbles=false] - useCapture option.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'one',
        value: function one(eventsToBind, handler, bubbles) {
            var _this3 = this;

            bubbles = bubbles || false;
            var namespace = null;
            var eventParts = El.isArray(eventsToBind) ? eventsToBind : eventsToBind.split(/\s+/);

            var _loop = function _loop(i) {
                var eventName = eventParts[i];
                if (eventName.indexOf('.') > -1) {
                    var splitEvent = eventName.split('.');
                    namespace = splitEvent.slice(1).join('.');
                }
                var eventHandler = function eventHandler(e) {
                    e.namespace = namespace;
                    handler.call(_this3, e);
                    _this3.off(eventName, eventHandler, bubbles);
                };
                _this3.element.addEventListener(eventName, eventHandler, bubbles);
                _this3.events.push({
                    event: eventName,
                    handler: eventHandler,
                    namespace: namespace,
                    useCapture: bubbles,
                    once: true
                });
            };

            for (var i = 0; i < eventParts.length; i++) {
                _loop(i);
            }

            return this;
        }

        /**
         * Return the parent element.
         * @public
         * @returns {Object} Parent element.
         */

    }, {
        key: 'parent',
        value: function parent() {
            return this.element.parentElement || this.element.parentNode || null;
        }

        /**
         * Prepend an element or text node.
         * @chainable
         * @public
         * @param {Object|String} el - Element to prepend or string to become text node to prepend.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'prepend',
        value: function prepend(el) {
            if (!el) return this;
            if (El.isObject(el)) this.element.insertBefore(el.element || el, this.element.firstChild);
            if (El.isString(el)) this.element.insertBefore(document.createTextNode(el), this.element.firstChild);

            return this;
        }

        /**
         * Completely remove an element.
         * @public
         */

    }, {
        key: 'remove',
        value: function remove() {
            this.parent().removeChild(this.element);
        }

        /**
         * Remove single attribute.
         * @chainable
         * @public
         * @param {String} attr - Attribute name to remove.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'removeAttribute',
        value: function removeAttribute(attr) {
            if (!attr) return this;
            this.element.removeAttribute(attr);
            return this;
        }

        /**
         * Removes a class. Accepts a space-separated string or an array.
         * @chainable
         * @public
         * @param {String|Array} myClass - ClassName(s) to remove.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'removeClass',
        value: function removeClass(myClass) {
            if (!myClass) return this;
            if (El.isArray(myClass)) myClass = myClass.join(' ');
            if (myClass.indexOf(' ') > -1) {
                myClass = myClass.split(' ');
                for (var i = 0; i < myClass.length; i++) {
                    if (this.element.classList) {
                        this.element.classList.remove(myClass[i]);
                    } else {
                        this.element.className = this.element.className.replace(myClass[i], '').replace(/^\s+|\s+$/g, '');
                    }
                }
            } else if (this.element.classList) {
                this.element.classList.remove(myClass);
            } else {
                this.element.className = this.element.className.replace(myClass, '').replace(/^\s+|\s+$/g, '');
            }

            return this;
        }

        /**
         * Transform an element value.
         * @public
         * @param {String} [returnType=object] - The type of returned value. Either 'object', 'array', or 'string'.
         * @returns {Object|Array|String} The transformed value.
         */

    }, {
        key: 'serialize',
        value: function serialize(returnType) {

            returnType = returnType || 'object';

            var key = this.getAttribute('name') || this.getAttribute('id') || this.getAttribute('class').split(' ').join('.');

            var value = this.getValue() || this.getText() || this.getHTML();

            var obj = {};
            obj[key] = value;

            switch (returnType.toLowerCase()) {
                case 'string':
                    return El.toQueryString(obj);
                case 'array':
                    {
                        var arr = [];
                        arr.push(obj);
                        return arr;
                    }
                case 'object':
                    return obj;
                default:
                    return obj;
            }
        }

        /**
         * Set single attribute.
         * @chainable
         * @public
         * @param {String} attr - Attribute name to set.
         * @param {String} attrValue - Attribute value.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'setAttribute',
        value: function setAttribute(attr, attrValue) {
            if (attrValue === undefined || attrValue === null) return this;
            this.element.setAttribute(attr, attrValue);
            return this;
        }

        /**
         * Sets the html content.
         * @chainable
         * @public
         * @param {String} html - Html to set.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'setHTML',
        value: function setHTML(html) {
            if (html === undefined || html === null || !El.isString(html)) return this;
            this.element.innerHTML = html;
            return this;
        }

        /**
         * Set styles.
         * @chainable
         * @public
         * @param {Object} styles - Styles to set.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'setStyles',
        value: function setStyles(styles) {
            if (!styles) return this;
            for (var style in styles) {
                if (styles.hasOwnProperty(style)) {
                    this.element.style[style] = styles[style];
                }
            }
            return this;
        }

        /**
         * Sets the text content.
         * @chainable
         * @public
         * @param {String} text - Text to set.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'setText',
        value: function setText(text) {
            if (text === undefined || text === null || !El.isString(text)) return this;
            var newText = document.createTextNode(text);
            if (this.element.firstChild) this.element.insertBefore(newText, this.element.firstChild);else this.element.appendChild(newText);
            return this;
        }

        /**
         * Sets the value property.
         * @chainable
         * @public
         * @param {String} val - value to set
         * @returns {Object} El class instance.
         */

    }, {
        key: 'setValue',
        value: function setValue(val) {
            if (val === undefined) return this;
            this.element.value = val;
            return this;
        }

        /**
         * Show element with display rule.
         * @chainable
         * @public
         * @returns {Object} El class instance.
         */

    }, {
        key: 'show',
        value: function show() {
            this.element.style.display = '';
            return this;
        }

        /**
         * Call show method, then hide for x amount of ms.
         * @chainable
         * @public
         * @param {Number} [time=3000] - Interval to show.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'showFor',
        value: function showFor(time) {
            var _this4 = this;

            time = time || 3000;
            this.show();
            setTimeout(function () {
                return _this4.hide();
            }, time);
            return this;
        }

        /**
         * Toggles the checked state of the element.
         * @public
         * @chainable
         * @param {Boolean} state - Desired check state.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'toggleCheck',
        value: function toggleCheck(state) {
            this.element.checked = El.isBoolean(state) ? state : !this.element.checked;
            return this;
        }

        /**
         * Trigger an event and dispatch it. Convenient for custom events.
         * @public
         * @chainable
         * @param {String} eventName - Event to trigger.
         * @param {Object} params - Event options.
         * @returns {Object} El class instance.
         */

    }, {
        key: 'trigger',
        value: function trigger(eventName, params) {
            if (!El.isObject(params)) params = {};
            params.bubbles = params.bubbles || false;
            params.cancelable = params.cancelable || false;

            var event = new CustomEvent(eventName, params);

            /**
             * Attach custom data to the event, if it exists
             */
            event.data = {};

            /**
             * No longer need these. They're already attached to the event
             */
            delete params.bubbles;
            delete params.cancelable;

            /**
             * Any leftover properties are custom data.
             * They need to be attached to the event.
             */
            for (var prop in params) {
                if (params.hasOwnProperty(prop)) {
                    event.data[prop] = params[prop];
                }
            }

            this.element.dispatchEvent(event);
            return this;
        }

        /**
         * Unbind all events associated with an element.
         * @chainable
         * @public
         * @returns {Object} El class instance.
         */

    }, {
        key: 'unbindEvents',
        value: function unbindEvents() {

            var events = this.events;
            var l = events.length;
            var i = l - 1;

            if (l) {
                for (; i >= 0; i--) {
                    this.off(events[i].event, events[i].handler, events[i].useCapture);
                }
            }

            return this;
        }

        /**
         * Unbind all events associated with a namespace.
         * @param {String} namespace - Namespace to unbind.
         * @chainable
         * @private
         * @returns {Object} El class instance.
         */

    }, {
        key: 'unbindNamespace',
        value: function unbindNamespace(namespace) {

            var events = this.events;
            var l = events.length;
            var i = l - 1;

            if (l) {
                for (; i >= 0; i--) {
                    if (events[i].namespace.indexOf(namespace) > -1) {
                        this.off(events[i].event, events[i].handler, events[i].useCapture);
                    }
                }
            }

            return this;
        }
    }], [{
        key: 'isArray',
        value: function isArray(item) {
            return Array.isArray(item);
        }

        /**
         * Simple object check. Arrays not included.
         * @static
         * @public
         * @param item - Item to check.
         * @returns {Boolean} Is object.
         */

    }, {
        key: 'isObject',
        value: function isObject(item) {
            return (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && item !== null;
        }

        /**
         * Simple string check.
         * @static
         * @public
         * @param item - Item to check.
         * @returns {Boolean} Is string.
         */

    }, {
        key: 'isString',
        value: function isString(item) {
            return typeof item === 'string' || item instanceof String;
        }

        /**
         * Simple boolean check.
         * @static
         * @public
         * @param item - Item to check.
         * @returns {Boolean} Is boolean.
         */

    }, {
        key: 'isBoolean',
        value: function isBoolean(item) {
            return typeof item === 'boolean';
        }

        /**
         * Convert an object to a query string.
         * @public
         * @static
         * @param  {Object} obj - JS object to encode.
         * @returns {String} URL encoded query string.
         */

    }, {
        key: 'toQueryString',
        value: function toQueryString(obj) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
                }
            }
            return str.join('&');
        }
    }]);
    return El;
}();

window.El = El;

return El;

})));
