import { stringifyLocal } from "../src/utils";

describe("stringifyLocal", () => {
  it(`object`, async () => {
    const testObj = { classNameA: "classA", classNameB: "classB" };
    const actual = stringifyLocal(testObj);

    expect(
      actual === '{"classNameA":"classA","classNameB":"classB"}' ||
        actual === '{"classNameB":"classB","classNameA":"classA"}'
    ).toBe(true);
  });

  it(`primitive`, async () => {
    const testObj = "classA";

    expect(stringifyLocal(testObj)).toBe('"classA"');
  });

  it(`arrow function`, async () => {
    const testFn = () => "classA";

    expect(stringifyLocal(testFn)).toBe('() => "classA"');
  });

  it(`function`, async () => {
    const testFn = function () {
      return "classA";
    };

    expect(stringifyLocal(testFn)).toBe(
      'function () {\n      return "classA";\n    }'
    );
  });
});
