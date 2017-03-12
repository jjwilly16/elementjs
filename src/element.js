/**
 * El Class
 * @class
 * @classdesc Creates an HTML element and wraps it with convenience methods.
 */
class El {

    /**
     * Element class constructor.
     * @param {String} type - Type of element to create.
     * @param {Object} attrs - Attributes to set.
     * @returns {Element} Element instance.
     */
    constructor(type, attrs, children) {

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

        /**
         * @member
         * @type {Array}
         */
        this.children = El.isArray(children) ? this._setChildren(children) : null;

        // SET ATTRIBUTES
        this._setAttributes();

        this._parseType(type);

        return this;

    }

    static isArray(item) {
        return Array.isArray(item);
    }

    static isObject(item) {
        return typeof item === 'object' && !Array.isArray(item) && item !== null;
    }

    static isString(item) {
        return typeof item === 'string' || item instanceof String;
    }

    static isBoolean(item) {
        return typeof item === 'boolean';
    }

    /**
     * Convert an object to a query string.
     * @param  {Object} obj - JS object to encode.
     * @returns {String} URL encoded query string.
     * @private
     */
    static toQueryString(obj) {
        const str = [];
        for (const p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
            }
        }
        return str.join('&');
    }

    /**
     * Parse the type.
     */
    _parseType(type) {
        const matchPattern = /([a-z]+|#[\w-\d]+|\.[\w\d-]+)/g;
        if (!El.isString(type)) throw new Error('El TypeError: The first parameter must be a string!');
        const matches = type.match(matchPattern);
        const elementType = matches.shift();
        for (let i = 0; i < matches.length; i++) {
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
    _createElement() {

        return document.createElement(this.type);

    }

    /**
     * Sets all attributes.
     * @private
     */
    _setAttributes() {

        const attrs = this.attributes;

        for (const prop in attrs) {
            if (attrs.hasOwnProperty(prop)) {
                if (attrs[prop] !== undefined && attrs[prop] !== null) {
                    this.element.setAttribute(prop, El.isArray(attrs[prop]) ? attrs[prop].join(' ') : attrs[prop]);
                }
            }
        }

    }

    /**
     * Set the child elements.
     *
     */
    _setChildren(children) {

        const tracker = {};

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            this.append(child);
            if (!tracker[child.type]) tracker[child.type] = [];
            tracker[child.type].push(child.type);
            // child._key = this.getAttribute('id') || (this.getAttribute('class') && this.getAttribute('class').split(' ')[0]) || `${child.type}${tracker[child.type].length - 1}`;
            // this[child._key] = child;
            this[`${child.type}${tracker[child.type].length - 1}`] = child;
        }

    }

    /**
     * Adds a class or classes to an element.
     * @chainable
     * @public
     * @param {String|Array} myClass - ClassName(s) to add. Can be a space-separated string or an array.
     * @returns {Element} Element instance.
     */
    addClass(myClass) {
        if (!myClass) return this;
        if (El.isArray(myClass)) myClass = myClass.join(' ');
        if (myClass.indexOf(' ') > -1) {
            myClass = myClass.split(' ');
            for (let i = 0; i < myClass.length; i++) {
                if ((` ${this.element.className} `).indexOf(` ${myClass[i]} `) === -1) {

                    if (this.element.classList) this.element.classList.add(myClass[i]);
                    else this.element.className += ` ${myClass[i]}`;

                }
            }
        } else if ((` ${this.element.className} `).indexOf(` ${myClass} `) === -1) {

            if (this.element.classList) this.element.classList.add(myClass);
            else this.element.className += ` ${myClass}`;

        }
        return this;
    }

    /**
     * Append an element or text node
     * @chainable
     * @public
     * @param {Object|String} el - element to append or string to become text node to append
     * @returns {Element} instance
     */
    append(el) {
        if (!el) return this;
        if (El.isObject(el)) this.element.appendChild(el.element || el);
        if (El.isString(el)) this.element.appendChild(document.createTextNode(el));

        return this;
    }

    /**
     * Blur element
     * @chainable
     * @public
     * @returns {Element} Element class instance.
     */
    blur() {
        this.element.blur();
        return this;
    }

    /**
     * Simulate an element click (just a wrapper for the .click DOM method).
     * @public
     * @chainable
     * @returns {Element} Element class instance.
     */
    click() {
        this.element.click();
        return this;
    }

    /**
     * Disable an element by attribute and class
     * @param {Boolean} [shouldDisable=true] - conditionally disable
     * @chainable
     * @public
     * @returns {Element} instance
     */
    disable(shouldDisable) {
        shouldDisable = El.isBoolean(shouldDisable) ? shouldDisable : true;
        if (shouldDisable) this.setAttribute('disabled', 'disabled').addClass('disabled');
        return this;
    }

    /**
     * Empty an element's html content
     * @chainable
     * @public
     * @returns {Element} instance
     */
    empty() {
        this.element.innerHTML = '';
        return this;
    }

    /**
     * Enable an element by attribute and class
     * @param {Boolean} [shouldEnable=true] - conditionally enable
     * @chainable
     * @public
     * @returns {Element} instance
     */
    enable(shouldEnable) {
        shouldEnable = El.isBoolean(shouldEnable) ? shouldEnable : true;
        if (shouldEnable) this.removeAttribute('disabled').removeClass('disabled');
        return this;
    }

    /**
     * Convert field value to URL encoded query string.
     * @public
     * @returns {String} URL encoded query string.
     */
    encode() {
        return El.toQueryString(this.serialize('object'));
    }

    /**
     * Fade in element
     * @chainable
     * @public
     * @param {Number} interval - transition interval
     * @returns {Element} instance
     */
    fadeIn(interval) {
        interval = interval || 0.3;
        this.element.style.visibility = 'visible';
        this.element.style.opacity = 1;
        this.element.style.transition = `opacity ${interval}s ease-in-out`;
        return this;
    }

    /**
     * Fade out element
     * @chainable
     * @public
     * @param {Number} interval - transition interval
     * @returns {Element} instance
     */
    fadeOut(interval) {
        interval = interval || 0.3;
        // this.element.style.visibility = 'hidden';
        this.element.style.opacity = 0;
        this.element.style.transition = `opacity ${interval}s ease-in-out`;
        return this;
    }

    /**
     * Set focus on element
     * @chainable
     * @public
     * @returns {Element} instance
     */
    focus() {
        this.element.focus();
        return this;
    }

    /**
     * Gets an attribute
     * @public
     * @param {String} attr - attribute name to get
     * @returns {String} attribute value
     */
    getAttribute(attr) {
        if (!attr) return null;
        return this.element.getAttribute(attr);
    }

    /**
     * Gets the html content
     * @public
     * @returns {String} html content
     */
    getHTML() {
        return this.element.innerHTML;
    }

    /**
     * Gets the text content
     * @chainable
     * @public
     * @returns {String} text content
     */
    getText() {
        return this.element.textContent;
    }

    /**
     * Gets the value
     * @public
     * @returns {String} element value
     */
    getValue() {
        return this.element.value;
    }

    /**
     * Check for an attribute
     * @public
     * @param {String} attrToCheck - attribute to check
     * @returns {Booolean} has attribute
     */
    hasAttribute(attrToCheck) {
        if (this.element.hasAttribute(attrToCheck)) return true;
        return false;
    }

    /**
     * Check for class
     * @public
     * @param {String} classToCheck - classname to check
     * @returns {Boolean} class exists
     */
    hasClass(classToCheck) {

        // return new RegExp(` ${classToCheck} `).test(` ${this.element.className} `);
        if (this.element.classList) return this.element.classList.contains(classToCheck);
        return new RegExp('(^| )' + classToCheck + '( |$)', 'gi').test(this.element.className);

    }

    /**
     * Check if an element has a value.
     * @public
     * @returns {Boolean} Element has value.
     */
    hasValue() {

        const val = this.getValue();
        if (val !== '' && val.length > 0) return true;
        return false;

    }

    /**
     * Hide element with display rule
     * @chainable
     * @public
     * @returns {Element} instance
     */
    hide() {
        this.element.style.display = 'none';
        return this;
    }

    /**
     * Call hide method, then show after x amount of ms.
     * @chainable
     * @public
     * @param {Number} [time=3000] - interval to hide
     * @returns {Element} instance
     */
    hideFor(time) {
        time = time || 3000;
        this.hide();
        setTimeout(() => this.show(), time);
        return this;
    }

    /**
     * Return the next sibling element
     * @public
     * @returns {Object} node
     */
    next() {
        return this.element.nextElementSibling || null;
    }

    /**
     * Detach event handler
     * @chainable
     * @public
     * @param {String} eventName - name of event
     * @param {Function} handler - function reference
     * @param {Boolean} [bubbles=false] - useCapture
     * @returns {Element} instance
     * @todo Find a way to remove specific event handlers from an element. EX: If there are two keyup events assigned to one element, I can't tell the difference between them.
     */
    off(eventName, handler, bubbles) {
        const events = this.events;
        if (!handler) {
            for (let i = events.length - 1; i >= 0; i--) {
                if (events[i].event === eventName) {
                    this.element.removeEventListener(events[i].event, events[i].handler, events[i].useCapture);
                    events.splice(i, 1);
                }
            }
            return this;
        }
        bubbles = bubbles || false;
        const index = events.map(i => i.event).indexOf(eventName);
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
     * @returns {Element} instance
     */
    on(eventsToBind, handler, bubbles) {
        bubbles = bubbles || false;
        let namespace = null;
        const eventParts = El.isArray(eventsToBind) ? eventsToBind : eventsToBind.split(/\s+/);
        for (let i = 0; i < eventParts.length; i++) {
            const eventName = eventParts[i];
            if (eventName.indexOf('.') > -1) {
                const splitEvent = eventName.split('.');
                namespace = splitEvent.slice(1).join('.');
            }
            const eventHandler = e => {
                e.namespace = namespace;
                handler.call(this, e);
            };
            this.element.addEventListener(eventName, eventHandler, bubbles);
            this.events.push({
                event: eventName,
                handler: eventHandler,
                namespace,
                useCapture: bubbles,
                once: false,
            });
        }

        return this;
    }

    /**
     * Attach event handler once
     * Using a wrapper function to handle. This is so we have
     * the function reference to unbind it later, if needed.
     * @chainable
     * @public
     * @param {String|Array} eventsToBind - name of event(s)
     * @param {Function} handler - function reference
     * @param {Boolean} [bubbles=false] - useCapture
     * @returns {Element} instance
     */
    one(eventsToBind, handler, bubbles) {
        bubbles = bubbles || false;
        let namespace = null;
        const eventParts = El.isArray(eventsToBind) ? eventsToBind : eventsToBind.split(/\s+/);
        for (let i = 0; i < eventParts.length; i++) {
            const eventName = eventParts[i];
            if (eventName.indexOf('.') > -1) {
                const splitEvent = eventName.split('.');
                namespace = splitEvent.slice(1).join('.');
            }
            const eventHandler = e => {
                e.namespace = namespace;
                handler.call(this, e);
                this.off(eventName, eventHandler, bubbles);
            };
            this.element.addEventListener(eventName, eventHandler, bubbles);
            this.events.push({
                event: eventName,
                handler: eventHandler,
                namespace,
                useCapture: bubbles,
                once: true,
            });
        }


        return this;
    }

    /**
     * Return the parent element
     * @returns {Object} element
     * @public
     */
    parent() {
        return this.element.parentElement || this.element.parentNode || null;
    }

    /**
     * Prepend an element or text node
     * @chainable
     * @public
     * @param {Object|String} el - element to prepend or string to become text node to prepend
     * @returns {Element} instance
     */
    prepend(el) {
        if (!el) return this;
        if (El.isObject(el)) this.element.insertBefore(el.element || el, this.element.firstChild);
        if (El.isString(el)) this.element.insertBefore(document.createTextNode(el), this.element.firstChild);

        return this;
    }

    /**
     * Completely remove an element
     * @public
     */
    remove() {
        this.parent().removeChild(this.element);
    }

    /**
     * Remove single attribute
     * @chainable
     * @public
     * @param {String} attr - attribute name to remove
     * @returns {Element} instance
     */
    removeAttribute(attr) {
        if (!attr) return this;
        this.element.removeAttribute(attr);
        return this;
    }

    /**
     * Removes a class
     * Able to accept multiple classes as a string separated with spaces or an array
     * @chainable
     * @public
     * @param {String|Array} myClass - className(s) to remove
     * @returns {Element} instance
     */
    removeClass(myClass) {
        if (!myClass) return this;
        if (El.isArray(myClass)) myClass = myClass.join(' ');
        if (myClass.indexOf(' ') > -1) {
            myClass = myClass.split(' ');
            for (let i = 0; i < myClass.length; i++) {
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
     * @param {String} [returnType=object] - The type of returned value. Either 'object', 'array', or 'string'.
     * @returns {Object|Array|String} The transformed value.
     * @public
     */
    serialize(returnType) {

        returnType = returnType || 'object';

        const key = this.getAttribute('name') || this.getAttribute('id') || this.getAttribute('class').split(' ').join('.');

        const value = this.getValue() || this.getText() || this.getHTML();

        const obj = {};
        obj[key] = value;

        switch (returnType.toLowerCase()) {
            case 'string':
                return El.toQueryString(obj);
            case 'array': {
                const arr = [];
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
     * Set single attribute
     * @chainable
     * @public
     * @param {String} attr - attribute name to set
     * @param {String} attrValue - attribute value
     * @returns {Element} instance
     */
    setAttribute(attr, attrValue) {
        if (attrValue === undefined || attrValue === null) return this;
        this.element.setAttribute(attr, attrValue);
        return this;
    }

    /**
     * Sets the html content
     * @chainable
     * @public
     * @param {String} html - html to set
     * @returns {Element} instance
     */
    setHTML(html) {
        if (html === undefined || html === null || !El.isString(html)) return this;
        this.element.innerHTML = html;
        return this;
    }

    /**
     * Set styles
     * @chainable
     * @public
     * @param {Object} styles - styles to set
     * @returns {Element} instance
     */
    setStyles(styles) {
        if (!styles) return this;
        for (const style in styles) {
            if (styles.hasOwnProperty(style)) {
                this.element.style[style] = styles[style];
            }
        }
        return this;
    }

    /**
     * Sets the text content
     * @chainable
     * @public
     * @param {String} text - text to set
     * @returns {Element} instance
     */
    setText(text) {
        if (text === undefined || text === null || !El.isString(text)) return this;
        const newText = document.createTextNode(text);
        if (this.element.firstChild) this.element.insertBefore(newText, this.element.firstChild);
        else this.element.appendChild(newText);
        return this;
    }

    /**
     * Sets the value property
     * @chainable
     * @public
     * @param {String} val - value to set
     * @returns {Element} instance
     */
    setValue(val) {
        if (val === undefined) return this;
        this.element.value = val;
        return this;
    }

    /**
     * Show element with display rule.
     * @chainable
     * @public
     * @returns {Element} Element instance.
     */
    show() {
        this.element.style.display = '';
        return this;
    }

    /**
     * Call show method, then hide for x amount of ms.
     * @chainable
     * @public
     * @param {Number} [time=3000] - Interval to show.
     * @returns {Element} Element instance.
     */
    showFor(time) {
        time = time || 3000;
        this.show();
        setTimeout(() => this.hide(), time);
        return this;
    }

    /**
     * Toggles the checked state of the element.
     * @param {Boolean} state - Desired check state.
     * @returns {Element} Element instance.
     * @public
     * @chainable
     */
    toggleCheck(state) {
        this.element.checked = El.isBoolean(state) ? state : !this.element.checked;
        return this;
    }

    /**
     * Trigger an event and dispatch it. Convenient for custom events.
     * @param {String} eventName - Event to trigger.
     * @param {Object} params - Event options.
     * @returns {Element} Element instance.
     * @public
     * @chainable
     */
    trigger(eventName, params) {
        if (!El.isObject(params)) params = {};
        params.bubbles = params.bubbles || false;
        params.cancelable = params.cancelable || false;

        const event = new CustomEvent(eventName, params);

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
        for (const prop in params) {
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
     * @returns {Element} ELement instance.
     */
    unbindEvents() {

        const events = this.events;
        const l = events.length;
        let i = l - 1;

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
     * @returns {Element} Element instance.
     */
    unbindNamespace(namespace) {

        const events = this.events;
        const l = events.length;
        let i = l - 1;

        if (l) {
            for (; i >= 0; i--) {
                if (events[i].namespace.indexOf(namespace) > -1) {
                    this.off(events[i].event, events[i].handler, events[i].useCapture);
                }
            }
        }

        return this;

    }

}

window.El = El;

export default El;
