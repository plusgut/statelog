/* global describe, it, expect, StateLog */

describe('Test array functionality', () => {

  it("check if exception gets thrown for null value", () => {
    expect(() => {
      new StateLog(null);
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for undefined value", () => {
    expect(() => {
      new StateLog(undefined);
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for number value", () => {
    expect(() => {
      new StateLog(42);
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for string value", () => {
    expect(() => {
      new StateLog("foo");
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for boolean value", () => {
    expect(() => {
      new StateLog(true);
    }).toThrow(new TypeError('Given value is not referencable'));
  });
});
