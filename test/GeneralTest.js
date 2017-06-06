/* global describe, it, beforeEach, expect, stateLog */

describe('Test array functionality', () => {
  beforeEach(() => {
    stateLog.idCount = 0; // Resets the id Count, for better testing
  });

  it("check if target and id are returned for null value", () => {
    expect(stateLog.create(null)).toEqual(null);
    expect(stateLog.idCount).toEqual(1);
  });

  it("check if target and id are returned for undefined value", () => {
    expect(stateLog.create(undefined)).toEqual(undefined);
    expect(stateLog.idCount).toEqual(1);
  });

  it("check if target and id are returned for number value", () => {
    expect(stateLog.create(42)).toEqual(42);
    expect(stateLog.idCount).toEqual(1);
  });

  it("check if target and id are returned for string value", () => {
    expect(stateLog.create("foo")).toEqual("foo");
    expect(stateLog.idCount).toEqual(1);
  });

  it("check if target and id are returned for boolean value", () => {
    expect(stateLog.create(true)).toEqual(true);
    expect(stateLog.idCount).toEqual(1);
    expect(stateLog.create(false)).toEqual(false);
    expect(stateLog.idCount).toEqual(2);
  });

  it("check if target and id are returned for function value", () => {
    var callback = () => {};
    expect(stateLog.create(callback)).toEqual(callback);
    expect(stateLog.idCount).toEqual(1);
  });
});
