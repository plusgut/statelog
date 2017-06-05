/* global describe, it, expect, stateLog */

describe('Test array functionality', () => {

  it("check if exception gets thrown for null value", () => {
    expect(() => {
      stateLog(null);
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for undefined value", () => {
    expect(() => {
      stateLog(undefined);
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for number value", () => {
    expect(() => {
      stateLog(42);
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for string value", () => {
    expect(() => {
      stateLog("foo");
    }).toThrow(new TypeError('Given value is not referencable'));
  });

  it("check if exception gets thrown for boolean value", () => {
    expect(() => {
      stateLog(true);
    }).toThrow(new TypeError('Given value is not referencable'));
  });
});
