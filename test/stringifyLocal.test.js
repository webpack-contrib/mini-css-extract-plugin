import { stringifyLocal } from "../src/utils";

describe("stringifyLocal", () => {
  it("primitive", async () => {
    const testObj = "classA";

    expect(stringifyLocal(testObj)).toBe('"classA"');
  });

  it("arrow function", async () => {
    const testFn = () => "classA";

    expect(stringifyLocal(testFn)).toBe('() => "classA"');
  });

  it("function", async () => {
    // eslint-disable-next-line func-style
    const testFn = function testFn() {
      return "classA";
    };

    expect(stringifyLocal(testFn)).toBe(
      'function testFn() {\n      return "classA";\n    }',
    );
  });
});
