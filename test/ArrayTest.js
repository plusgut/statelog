/* global jasmine, describe, it, beforeEach, expect, StateLog */

describe('Test array functionality', function () {

  beforeEach(() => {
    this.changeSpyFirst  = jasmine.createSpy();
    this.changeSpySecond = jasmine.createSpy();
    this.stateLog        = new StateLog(['one', 'two', 'three']);
    this.stateLog.on(this.changeSpyFirst);
    this.stateLog.on(this.changeSpySecond);
  });

  it('The array should act like one',() => {
    expect(this.stateLog.proxy[0]).toEqual('one');
    expect(this.stateLog.proxy[1]).toEqual('two');
    expect(this.stateLog.proxy[2]).toEqual('three');
    expect(this.stateLog.proxy).toEqual(['one', 'two', 'three']);
    expect(this.stateLog.proxy.length).toEqual(3);
    expect(this.changeSpyFirst.calls.count()).toEqual(0);
  });


  it('The should be single pushable',() => {
    expect(this.stateLog.proxy.push('foo')).toEqual(4);
    expect(this.changeSpyFirst.calls.count()).toEqual(1);
    expect(this.stateLog.proxy).toEqual(['one', 'two', 'three', 'foo']);
  });

  it('The should be single multiple pushable',() => {
    expect(this.stateLog.proxy.push('foo', "bar")).toEqual(5);
    expect(this.stateLog.proxy).toEqual(['one', 'two', 'three', 'foo', 'bar']);
  });
});
