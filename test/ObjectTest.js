/* global jasmine, describe, it, beforeEach, expect, stateLog, window */

describe('Test array functionality', () => {
  beforeEach(() => {
    this.stateLogObj = stateLog.create(getBaseObj());

    window.objStateLog = this.stateLogObj;
  });

  it("check if existing value is represented", () => {
    expect(this.stateLogObj).toEqual(getBaseObj());
  });

  it("check if event gets fired", () => {
    var setSpy = jasmine.createSpy("set foo");
    this.stateLogObj.__stateLog__.on("set.foo", setSpy);

    this.stateLogObj.foo = 'barbar';
    expect(setSpy.calls.count()).toEqual(1);
  });

  it("check if event doesnt get fired", () => {
    var setSpy = jasmine.createSpy("set foo");
    this.stateLogObj.__stateLog__.on("set.foo", setSpy);

    this.stateLogObj.foo = 'bar';
    expect(setSpy.calls.count()).toEqual(0);
  });

  it("check if nested event gets fired", () => {
    var setSpy = jasmine.createSpy("set foo");
    var nestedSetSpy = jasmine.createSpy("nestedset foo");
    this.stateLogObj.__stateLog__.on("set.foo", setSpy);

    this.stateLogObj.foo = {foo2: "bar2"};
    this.stateLogObj.foo.__stateLog__.on("set.foo2", nestedSetSpy);
    this.stateLogObj.foo.foo2 = "bar3";

    expect(setSpy.calls.count()).toEqual(1);
    expect(nestedSetSpy.calls.count()).toEqual(1);

    this.stateLogObj.foo = "barbar";
    expect(setSpy.calls.count()).toEqual(2);
    expect(nestedSetSpy.calls.count()).toEqual(1);
    expect(this.stateLogObj.__stateLog__.getStateLogByIndex("foo")).toBe(undefined);
  });
});

function getBaseObj() {
  return {foo: 'bar'};
}
