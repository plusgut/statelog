/* global jasmine, describe, it, beforeEach, expect, stateLog*/

const FROM = 0;
const TO   = 3;

describe('Test array functionality', () => {
  beforeEach(() => {
    stateLog.idCount = 0; // Resets the id Count, for better testing

    this.createSpyFirst   = jasmine.createSpy('createFirst');
    this.createSpySecond  = jasmine.createSpy('createSecond');
    this.updateSpyFirst   = jasmine.createSpy('updateFirst');
    this.updateSpySecond  = jasmine.createSpy('updateSecond');
    this.deleteSpyFirst   = jasmine.createSpy('deleteFirst');
    this.deleteSpySecond  = jasmine.createSpy('deleteSecond');

    this.stateLogObj = stateLog.create(generateValues(FROM, TO));
    this.stateLogObj.__stateLog__.on('create', this.createSpyFirst);
    this.stateLogObj.__stateLog__.on('create', this.createSpySecond);
    this.stateLogObj.__stateLog__.on('update',  this.updateSpyFirst);
    this.stateLogObj.__stateLog__.on('update',  this.updateSpySecond);
    this.stateLogObj.__stateLog__.on('delete',  this.deleteSpyFirst);
    this.stateLogObj.__stateLog__.on('delete',  this.deleteSpySecond);

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
    expect(this.stateLogObj[0]).toEqual(generateValue(FROM));
    expect(this.stateLogObj[1]).toEqual(generateValue(FROM + 1));
    expect(this.stateLogObj[2]).toEqual(generateValue(FROM + 2));
    expect(this.stateLogObj).toEqual(generateValues(FROM, TO));
    expect(this.stateLogObj.length).toEqual(TO);
    this.checkEvents({
      create: 0,
      update: 0,
      delete: 0,
    });
  });

  it('The should be single pushable', () => {
    expect(this.stateLogObj.push(generateValue(TO))).toEqual(TO + 1);
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 0,
    });
    expect(this.stateLogObj).toEqual(generateValues(FROM, TO).concat([generateValue(TO)]));
  });

  it('The should be multiple pushable', () => {
    expect(this.stateLogObj.push(generateValue(TO), generateValue(TO + 1))).toEqual(TO + 2);
    expect(this.stateLogObj).toEqual(generateValues(FROM, TO + 2));
  });

  it('The should be single unshiftable', () => {
    expect(this.stateLogObj.unshift(generateValue(TO))).toEqual(TO + 1);
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 0,
    });
    expect(this.stateLogObj).toEqual([generateValue(TO)].concat(generateValues(FROM, TO)));
  });

  it('The should be single multiple unshiftable', () => {
    expect(this.stateLogObj.unshift(generateValue(TO), generateValue(TO + 1))).toEqual(TO + 2);
    expect(this.stateLogObj).toEqual(generateValues(TO, TO + 2).concat(generateValues(FROM, TO)));
  });


  it('The map function should work', () => {
    const originalMapSpy = jasmine.createSpy('original map').and.returnValue(true);
    const proxyMapSpy = jasmine.createSpy('proxy map').and.returnValue(true);
    const original = generateValues(FROM, TO);
    expect(original.map(originalMapSpy)).toEqual(this.stateLogObj.map(proxyMapSpy));
  });

  it('The map function should work, even with push', () => {
    const originalMapSpy = jasmine.createSpy('original map').and.returnValue(true);
    const proxyMapSpy = jasmine.createSpy('proxy map').and.returnValue(true);
    const original = generateValues(FROM, TO + 1);
    this.stateLogObj.push(generateValue(TO));

    expect(original.map(originalMapSpy)).toEqual(this.stateLogObj.map(proxyMapSpy));
  });

  it('insert event gets called at push', () => {
    this.stateLogObj.push('foo');
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 2], [TO + 1]);
    expect(this.createSpyFirst).not.toHaveBeenCalledWith([TO + 3], jasmine.any);

    this.stateLogObj.push('bar');
    this.checkEvents({
      create: 2,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 3], [TO + 2]);
  });

  it('insert event gets called at unshift', () => {
    this.stateLogObj.unshift('foo');
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 2], [0]);
    expect(this.createSpyFirst).not.toHaveBeenCalledWith([TO + 3], jasmine.any);

    this.stateLogObj.unshift('bar');
    this.checkEvents({
      create: 2,
      update: 0,
      delete: 0,
    });
    expect(this.createSpyFirst).toHaveBeenCalledWith([TO + 3], [0]);
  });


  it('splice should work', () => {
    const compareArray = generateValues(FROM, TO);
    expect(compareArray.splice(1, 2, TO + 1, TO + 2)).toEqual(this.stateLogObj.splice(1, 2, TO + 1, TO + 2));
    expect(compareArray).toEqual(this.stateLogObj);
    this.checkEvents({
      create: 1,
      update: 0,
      delete: 1,
    });

    expect(this.createSpyFirst).toHaveBeenCalledWith([5, 6], [1, 2]);
    expect(this.deleteSpyFirst).toHaveBeenCalledWith([3, 4], [1, 2]);

  });
});

function generateValues(from, to) {
  const result = [];
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