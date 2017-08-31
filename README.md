# statelog  [![NPM version](http://img.shields.io/npm/v/statelog.svg)](https://npmjs.org/package/detect-repo-linters) [![Build Status](https://travis-ci.org/plusnew/statelog.svg)](https://travis-ci.org/plusnew/statelog) [![Coverage Status](https://coveralls.io/repos/github/plusnew/statelog/badge.svg)](https://coveralls.io/github/plusnew/statelog) [![Dependency status](https://david-dm.org/plusnew/statelog/status.svg)](https://david-dm.org/plusnew/statelog) [![Dev Dependency status](https://david-dm.org/plusnew/statelog/dev-status.svg)](https://david-dm.org/plusnew/statelog?type=dev)

This lib adds events to objects which are triggered when something changes

```javascript
  const obj = stateLog.create({foo: 'bar'});

  obj.__stateLog__.on('set.foo', () => {
    console.log('gets triggered when foo changes');
  });

  obj.foo = 'barbar';
```
