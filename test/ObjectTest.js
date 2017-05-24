/* global jasmine, describe, it, beforeEach, expect, StateLog, window */

describe('Test array functionality', () => {
  beforeEach(() => {
    this.stateLog = new StateLog(getBaseObj());

    window.objStateLog = this.stateLog;
  });

  it("check if existing value is represented", () => {
    expect(this.stateLog.proxy).toEqual(getBaseObj());
  });

  it("check if event gets fired", () => {
    var setSpy = jasmine.createSpy("set foo");
    this.stateLog.on("set.foo", setSpy);

    this.stateLog.proxy.foo = 'barbar';
    expect(setSpy.calls.count()).toEqual(1);
    expect(setSpy).toHaveBeenCalledWith(this.stateLog);
  });

  it("check if event doesnt get fired", () => {
    var setSpy = jasmine.createSpy("set foo");
    this.stateLog.on("set.foo", setSpy);

    this.stateLog.proxy.foo = 'bar';
    expect(setSpy.calls.count()).toEqual(0);
  });

  it("check if nested event gets fired", () => {
    var setSpy = jasmine.createSpy("set foo");
    var nestedSetSpy = jasmine.createSpy("nesetdset foo");
    this.stateLog.on("set.foo", setSpy);

    this.stateLog.proxy.foo = {foo2: "bar2"};
    var nestedStateLog = this.stateLog.proxyHandler.getStateLogByIndex("foo");
    nestedStateLog.on("set.foo2", nestedSetSpy);
    this.stateLog.proxy.foo.foo2 = "bar3";

    expect(setSpy.calls.count()).toEqual(1);
    expect(setSpy).toHaveBeenCalledWith(this.stateLog);
    expect(nestedSetSpy.calls.count()).toEqual(1);
    expect(nestedSetSpy).toHaveBeenCalledWith(nestedStateLog);

    this.stateLog.proxy.foo = "barbar";
    expect(setSpy.calls.count()).toEqual(2);
    expect(nestedSetSpy.calls.count()).toEqual(1);
    expect(this.stateLog.proxyHandler.getStateLogByIndex("foo")).toBe(undefined);
  });
});

function getBaseObj() {
  return {foo: 'bar'};
}
