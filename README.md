# elementjs #

Create and interact with HTML elements easily with javascript.

Elementjs is simply a wrapper for html elements that includes convenient methods to interact with them, as well as an easy way to access them without using selectors.

Each El object holds all of it's children, which can be accessed easily by traversing the object.

# [Read Docs](https://jjwilly16.github.io/elementjs/) #

## Installation ##

#### NPM ####

```cmd
npm install --save elementjs
```

#### Dist ####

```html
<script src="dist/element.min.js"></script>
```

## Usage ##

#### Simple ####

```javascript
const mydiv = new El('div');

document.getElementsByTagName('body')[0].append('mydiv');
```

#### Set ids/classes ####

```javascript
// Shortcut method:
const mydiv = new El('div#myid.myclass');

// Or if you prefer:
const mydiv = new El('div', {
    id: 'myid',
}).addClass('myclass');

document.getElementsByTagName('body')[0].append('mydiv');
```

#### Set text and attributes ####

```javascript
const mydiv = new El('div#myid.myclass', {
    myattribute: 'myattributevalue',
}).setText('My text');

document.getElementsByTagName('body')[0].append('mydiv');
```

#### Set children elements ####

```javascript
const mydiv = new El('div#mydiv', {
    myattribute: 'myattributevalue',
}, [
    new El('ul', [
        new El('li').setText('List item 1'),
        new El('li').setText('List item 2'),
        new El('li').setText('List item 3'),
    ]),
]);
```

#### Object traversal ####

Child elements are accessible through their parents by traversing the created object. Items are bound by a *_key* property. This can be assigned by setting the *_key* in the attributes parameter (2nd). If the _key is not present, the element's ID will be used. If no id exists, the item will named with the tag name followed by the index (See example below).

```javascript
const myList = new El('ul#myul', [
    new El('li#item1', {
        _key: 'firstitem',
    }).setText('List item 1'),
    new El('li#item2').setText('List item 2'),
    new El('li#item3').setText('List item 3'),
]);

// If a _key is assigned
myList.firstitem.hide();

// If an ID exists, but no _key is assigned
myList.item1.hide();

// If neither a _key or id is assigned
myList.li1.hide();
```

Child elements are also pushed into an array that is accessible through the 'children' property.

## API ##

