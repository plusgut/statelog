/* global jasmine, describe, it, beforeEach, expect, StateLog, window */

const FROM = 0;
const TO   = 3;

describe('Test array functionality', () => {
  beforeEach(() => {
    this.pushSpyFirst     = jasmine.createSpy();
    this.pushSpySecond    = jasmine.createSpy();
    this.unshiftSpyFirst  = jasmine.createSpy();
    this.unshiftSpySecond = jasmine.createSpy();
    this.removeSpyFirst   = jasmine.createSpy();
    this.removeSpySecond  = jasmine.createSpy();
    this.setSpyFirst      = jasmine.createSpy();
    this.setSpySecond     = jasmine.createSpy();

    this.stateLog = new StateLog(generateValues(FROM, TO));
    this.stateLog.on('push',    this.pushSpyFirst);
    this.stateLog.on('push',    this.pushSpySecond);
    this.stateLog.on('unshift', this.unshiftSpyFirst);
    this.stateLog.on('unshift', this.unshiftSpySecond);
    this.stateLog.on('remove',  this.removeSpyFirst);
    this.stateLog.on('remove',  this.removeSpySecond);
    this.stateLog.on('set',     this.setSpyFirst);
    this.stateLog.on('set',     this.setSpySecond);

    window.stateLog = this.stateLog;

    this.checkEvents = (opt) => {
      expect(this.pushSpyFirst.calls.count()).toEqual(opt.push);
      expect(this.pushSpySecond.calls.count()).toEqual(opt.push);
      expect(this.unshiftSpyFirst.calls.count()).toEqual(opt.unshift);
      expect(this.unshiftSpySecond.calls.count()).toEqual(opt.unshift);
      expect(this.removeSpyFirst.calls.count()).toEqual(opt.remove);
      expect(this.removeSpySecond.calls.count()).toEqual(opt.remove);
      expect(this.setSpyFirst.calls.count()).toEqual(opt.set);
      expect(this.setSpySecond.calls.count()).toEqual(opt.set);
    };
  });

  it('The array should act like one', () => {
    expect(this.stateLog.proxy[0]).toEqual(generateValue(FROM));
    expect(this.stateLog.proxy[1]).toEqual(generateValue(FROM + 1));
    expect(this.stateLog.proxy[2]).toEqual(generateValue(FROM + 2));
    expect(this.stateLog.proxy).toEqual(generateValues(FROM, TO));
    expect(this.stateLog.proxy.length).toEqual(TO);
    this.checkEvents({
      push: 0,
      unshift: 0,
      remove: 0,
      set: 0,
    });
  });

  it('The should be single pushable', () => {
    expect(this.stateLog.proxy.push(generateValue(TO))).toEqual(TO + 1);
    this.checkEvents({
      push: 1,
      unshift: 0,
      remove: 0,
      set: 0,
    });
    expect(this.stateLog.proxy).toEqual(generateValues(FROM, TO).concat([generateValue(TO)]));
  });

  it('The should be multiple pushable', () => {
    expect(this.stateLog.proxy.push(generateValue(TO), generateValue(TO + 1))).toEqual(TO + 2);
    expect(this.stateLog.proxy).toEqual(generateValues(FROM, TO + 2));
  });

  it('The should be single unshiftable', () => {
    expect(this.stateLog.proxy.unshift(generateValue(TO))).toEqual(TO + 1);
    this.checkEvents({
      push: 0,
      unshift: 1,
      remove: 0,
      set: 0,
    });
    expect(this.stateLog.proxy).toEqual([generateValue(TO)].concat(generateValues(FROM, TO)));
  });

  it('The should be single multiple unshiftable', () => {
    expect(this.stateLog.proxy.unshift(generateValue(TO), generateValue(TO + 1))).toEqual(TO + 2);
    expect(this.stateLog.proxy).toEqual(generateValues(TO, TO + 2).concat(generateValues(FROM, TO)));
  });


  it('The map function should work', () => {
    var originalMapSpy = jasmine.createSpy().and.returnValue(true);
    var proxylMapSpy = jasmine.createSpy().and.returnValue(true);
    var original = generateValues(FROM, TO);
    expect(original.map(originalMapSpy)).toEqual(this.stateLog.proxy.map(proxylMapSpy));
  });

  it('The map function should work, even with push', () => {
    var originalMapSpy = jasmine.createSpy().and.returnValue(true);
    var proxylMapSpy = jasmine.createSpy().and.returnValue(true);
    var original = generateValues(FROM, TO + 1);
    this.stateLog.proxy.push(generateValue(TO));

    expect(original.map(originalMapSpy)).toEqual(this.stateLog.proxy.map(proxylMapSpy));
  });

  it("push event gets called", () => {
    this.stateLog.proxy.push("foo");
    this.checkEvents({
      push: 1,
      unshift: 0,
      remove: 0,
      set: 0,
    });
    expect(this.pushSpyFirst).toHaveBeenCalledWith([TO + 1], this.stateLog);
    expect(this.pushSpyFirst).not.toHaveBeenCalledWith([TO + 2], this.stateLog);

    this.stateLog.proxy.push("bar");
    this.checkEvents({
      push: 2,
      unshift: 0,
      remove: 0,
      set: 0,
    });
    expect(this.pushSpyFirst).toHaveBeenCalledWith([TO + 2], this.stateLog);
  });

  it("unshift event gets called", () => {
    this.stateLog.proxy.unshift("foo");
    this.checkEvents({
      push: 0,
      unshift: 1,
      remove: 0,
      set: 0,
    });
    expect(this.unshiftSpyFirst).toHaveBeenCalledWith([TO + 1], this.stateLog);
    expect(this.unshiftSpyFirst).not.toHaveBeenCalledWith([TO + 2], this.stateLog);

    this.stateLog.proxy.unshift("bar");
    this.checkEvents({
      push: 0,
      unshift: 2,
      remove: 0,
      set: 0,
    });
    expect(this.unshiftSpyFirst).toHaveBeenCalledWith([TO + 2], this.stateLog);
  });

  it("remove event gets called", () => {

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