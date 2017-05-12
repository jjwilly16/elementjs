import El from './element';

const extenders = [
    {
        name: 'class',
        fn(classNames) {
            if (!El.isString(classNames) || !El.isArray(classNames)) throw new Error('The "class" extender value must be a string or an array!');
            return this.addClass(classNames);
        },
    },
    {
        name: 'data',
        fn(attrs) {
            if (!El.isObject(attrs)) throw new Error('The "data" extender value must be an object!');
            for (const tag in attrs) {
                if (attrs.hasOwnProperty(tag)) {
                    const attribute = attrs[tag];
                    if (El.isTruthy(attribute)) this.setAttribute(`data-${tag}`, attribute);
                }
            }
        },
    },
    {
        name: 'style',
        fn(styles) {
            if (!El.isObject(styles)) throw new Error('The "style" extender value must be an object!');
            return this.setStyles(styles);
        },
    },
];

export default extenders;
