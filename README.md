# statelog 

[![NPM version](http://img.shields.io/npm/v/statelog.svg)](https://npmjs.org/package/detect-repo-linters)
[![Build Status](https://travis-ci.org/plusgut/statelog.svg)](https://travis-ci.org/plusgut/statelog)
[![Coverage Status](https://coveralls.io/repos/github/plusgut/statelog/badge.svg)](https://coveralls.io/github/plusgut/statelog)
[![Dependency status](https://david-dm.org/plusgut/statelog/status.svg)](https://david-dm.org/plusgut/statelog)
[![Dev Dependency status](https://david-dm.org/plusgut/statelog/dev-status.svg)](https://david-dm.org/plusgut/statelog?type=dev)

This lib adds events to objects which are triggered when something changes

```javascript
  const obj = stateLog.create({foo: 'bar'});

  obj.__stateLog__.on('set.foo', () => {
    console.log('gets triggered when foo changes');
  });

  obj.foo = 'barbar';
```
