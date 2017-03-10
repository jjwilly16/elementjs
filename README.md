# elementjs #

Create and interact with HTML elements easily with javascript.

Elementjs is simply a wrapper for html elements that includes convenient methods to interact with them, as well as an easy way to access them without using selectors.

Each El object holds all of it's children, which can be accessed easily by traversing the object.

## Installation ##

NPM

```cmd
npm install --save elementjs
```

Dist

```html
<script src="dist/element.min.js"></script>
```

## Usage ##

Simple

```javascript
const mydiv = new El('div');

document.getElementsByTagName('body')[0].append('mydiv');
```

Set ids/classes

```javascript
const mydiv = new El('div#myid.myclass');

document.getElementsByTagName('body')[0].append('mydiv');
```

Set text and attributes

```javascript
const mydiv = new El('div#myid.myclass', {
    myattribute: 'myattributevalue',
}).setText('My text');

document.getElementsByTagName('body')[0].append('mydiv');
```

Set children elements

Object traversal

## API ##