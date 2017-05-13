/* global jasmine, describe, it, beforeEach, expect, StateLog */

const FROM = 0;
const TO   = 3;

describe('Test array functionality', () => {

  beforeEach(() => {
    this.changeSpyFirst  = jasmine.createSpy();
    this.changeSpySecond = jasmine.createSpy();
    this.stateLog        = new StateLog(generateValues(FROM, TO));
    this.stateLog.on(this.changeSpyFirst);
    this.stateLog.on(this.changeSpySecond);
  });

  it('The array should act like one', () => {
    expect(this.stateLog.proxy[0]).toEqual(generateValue(FROM));
    expect(this.stateLog.proxy[1]).toEqual(generateValue(FROM + 1));
    expect(this.stateLog.proxy[2]).toEqual(generateValue(FROM + 2));
    expect(this.stateLog.proxy).toEqual(generateValues(FROM, TO));
    expect(this.stateLog.proxy.length).toEqual(TO);
    expect(this.changeSpyFirst.calls.count()).toEqual(0);
    expect(this.changeSpySecond.calls.count()).toEqual(0);
  });

  it('The should be single pushable', () => {
    expect(this.stateLog.proxy.push(generateValue(TO))).toEqual(TO + 1);
    expect(this.changeSpyFirst.calls.count()).toEqual(1);
    expect(this.changeSpySecond.calls.count()).toEqual(1);
    expect(this.stateLog.proxy).toEqual(generateValues(FROM, TO).concat([generateValue(TO)]));
  });

  it('The should be single multiple pushable', () => {
    expect(this.stateLog.proxy.push(generateValue(TO), generateValue(TO + 1))).toEqual(TO + 2);
    expect(this.stateLog.proxy).toEqual(generateValues(FROM, TO + 2));
  });

  it('The map function should work', () => {
    var originalMapSpy = jasmine.createSpy().and.returnValue(true);
    var proxylMapSpy = jasmine.createSpy().and.returnValue(true);
    var original = generateValues(FROM, TO);
    expect(original.map(originalMapSpy)).toEqual(this.stateLog.proxy.map(proxylMapSpy));
  });
});

function generateValues(from, to) {
  var result = [];
  for(from; from < to; from++) {
    result.push(generateValue(from));
  }
  return result;
}

function generateValue(value) {
  return {
    value,
  };
}