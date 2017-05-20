/* global jasmine, describe, it, beforeEach, expect, StateLog, window */

const FROM = 0;
const TO   = 3;

describe('Test array functionality', () => {
  beforeEach(() => {
    this.createSpyFirst   = jasmine.createSpy("createFirst");
    this.createSpySecond  = jasmine.createSpy("createSecond");
    this.updateSpyFirst   = jasmine.createSpy("updateFirst");
    this.updateSpySecond  = jasmine.createSpy("updateSecond");
    this.deleteSpyFirst   = jasmine.createSpy("deleteFirst");
    this.deleteSpySecond  = jasmine.createSpy("deleteSecond");

    this.stateLog = new StateLog(generateValues(FROM, TO));
    this.stateLog.on('create', this.createSpyFirst);
    this.stateLog.on('create', this.createSpySecond);
    this.stateLog.on('update',  this.updateSpyFirst);
    this.stateLog.on('update',  this.updateSpySecond);
    this.stateLog.on('delete',  this.deleteSpyFirst);
    this.stateLog.on('delete',  this.deleteSpySecond);

    window.stateLog = this.stateLog;

    this.checkEvents = (opt) => {
      expect(this.createSpyFirst.calls.count()).toEqual(opt.create);
      expect(this.createSpySecond.calls.count()).toEqual(opt.create);
      expect(this.updateSpyFirst.calls.count()).toEqual(opt.update);
      expect(this.updateSpySecond.calls.count()).toEqual(opt.update);
      expect(this.deleteSpyFirst.calls.count()).toEqual(opt.delete);
      expect(this.deleteSpySecond.calls.count()).toEqual(opt.delete);
    };
  });

  it('The array should act like one', () => {
    expect(this.stateLog.proxy[0]).toEqual(generateValue(FROM));
    expect(this.stateLog.proxy[1]).toEqual(generateValue(FROM + 1));
    expect(this.stateLog.proxy[2]).toEqual(generateValue(FROM + 2));
    expect(this.stateLog.proxy).toEqual(generateValues(FROM, TO));
    expect(this.stateLog.proxy.length).toEqual(TO);
    this.checkEvents({
      create: 0,
      update: 0,
      delete: 0,
    });
  });

  it('The should be single pushable', () => {
    expect(this.stateLog.proxy.push(generateValue(TO))).toEqual(TO + 1);
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 0,
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
      create: 1,
      update: 0,
      delete: 0,
    });
    expect(this.stateLog.proxy).toEqual([generateValue(TO)].concat(generateValues(FROM, TO)));
  });

  it('The should be single multiple unshiftable', () => {
    expect(this.stateLog.proxy.unshift(generateValue(TO), generateValue(TO + 1))).toEqual(TO + 2);
    expect(this.stateLog.proxy).toEqual(generateValues(TO, TO + 2).concat(generateValues(FROM, TO)));
  });


  it('The map function should work', () => {
    var originalMapSpy = jasmine.createSpy().and.returnValue(true);
    var proxyMapSpy = jasmine.createSpy().and.returnValue(true);
    var original = generateValues(FROM, TO);
    expect(original.map(originalMapSpy)).toEqual(this.stateLog.proxy.map(proxyMapSpy));
  });

  it('The map function should work, even with push', () => {
    var originalMapSpy = jasmine.createSpy().and.returnValue(true);
    var proxyMapSpy = jasmine.createSpy().and.returnValue(true);
    var original = generateValues(FROM, TO + 1);
    this.stateLog.proxy.push(generateValue(TO));

    expect(original.map(originalMapSpy)).toEqual(this.stateLog.proxy.map(proxyMapSpy));
  });

  it("insert event gets called at push", () => {
    this.stateLog.proxy.push("foo");
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 1], [TO + 1], this.stateLog);
    expect(this.createSpyFirst).not.toHaveBeenCalledWith([TO + 2], jasmine.any, this.stateLog);

    this.stateLog.proxy.push("bar");
    this.checkEvents({
      create: 2,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 2], [TO + 2], this.stateLog);
  });

  it("insert event gets called at unshift", () => {
    this.stateLog.proxy.unshift("foo");
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 1], [0], this.stateLog);
    expect(this.createSpyFirst).not.toHaveBeenCalledWith([TO + 2], jasmine.any, this.stateLog);

    this.stateLog.proxy.unshift("bar");
    this.checkEvents({
      create: 2,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 2], [0], this.stateLog);
  });


  it("splice should work", () => {
    var compareArray = generateValues(FROM, TO);
    expect(compareArray.splice(1, 2, TO + 1, TO + 2)).toEqual(this.stateLog.proxy.splice(1, 2, TO + 1, TO + 2));
    expect(compareArray).toEqual(this.stateLog.proxy);
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 1,
    });

    expect(this.createSpyFirst).toHaveBeenCalledWith([4, 5], [1, 2], this.stateLog);
    expect(this.deleteSpyFirst).toHaveBeenCalledWith([1, 2], [1, 2], this.stateLog);

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