import { getCompiler, compile } from './helpers';

describe('validate options', () => {
  const tests = {
    publicPath: {
      success: ['/public/path/to/'],
      failure: [true],
    },
    esModule: {
      success: [true, false],
      failure: [1],
    },
    hmr: {
      success: [true, false],
      failure: [1],
    },
    reloadAll: {
      success: [true, false],
      failure: [1],
    },
    modules: {
      success: [{ namedExport: true }, { namedExport: false }],
      failure: ['true', { namedExport: 'false' }],
    },
    unknown: {
      success: [],
      // TODO failed in next release
      // failure: [1, true, false, 'test', /test/, [], {}, { foo: 'bar' }],
    },
  };

  function stringifyValue(value) {
    if (
      Array.isArray(value) ||
      (value && typeof value === 'object' && value.constructor === Object)
    ) {
      return JSON.stringify(value);
    }

    return value;
  }

  async function createTestCase(key, value, type) {
    it(`should ${
      type === 'success' ? 'successfully validate' : 'throw an error on'
    } the "${key}" option with "${stringifyValue(value)}" value`, async () => {
      const compiler = getCompiler('simple.js', { [key]: value });

      let stats;

      try {
        stats = await compile(compiler);
      } finally {
        if (type === 'success') {
          expect(stats.hasErrors()).toBe(false);
        } else if (type === 'failure') {
          const {
            compilation: { errors },
          } = stats;

          expect(errors).toHaveLength(1);
          expect(() => {
            throw new Error(errors[0].error.message);
          }).toThrowErrorMatchingSnapshot();
        }
      }
    });
  }

  for (const [key, values] of Object.entries(tests)) {
    for (const type of Object.keys(values)) {
      for (const value of values[type]) {
        createTestCase(key, value, type);
      }
    }
  }
});
