# statelog [![Build Status](https://travis-ci.org/plusgut/statelog.svg)](https://travis-ci.org/plusgut/statelog) [![Coverage Status](https://coveralls.io/repos/github/plusgut/statelog/badge.svg)](https://coveralls.io/github/plusgut/statelog)

This lib adds events to objects which are triggered when something changes

```javascript
  const obj = stateLog.create({foo: 'bar'});

  obj.__stateLog__.on('set.foo', () => {
    console.log('gets triggered when foo is changed');
  });

  obj.foo = 'barbar';
```
