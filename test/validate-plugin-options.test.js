import MiniCssExtractPlugin from '../src';

describe('validate options', () => {
  const tests = {
    filename: {
      success: ['[name].css'],
      failure: [true],
    },
    chunkFilename: {
      success: ['[id].css', () => '[id].css'],
      failure: [true],
    },
    moduleFilename: {
      success: [({ name }) => `${name.replace('/js/', '/css/')}.css`],
      failure: [true],
    },
    ignoreOrder: {
      success: [true, false],
      failure: [1],
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
      let error;

      try {
        // eslint-disable-next-line no-new
        new MiniCssExtractPlugin({ [key]: value });
      } catch (errorFromPlugin) {
        if (errorFromPlugin.name !== 'ValidationError') {
          throw errorFromPlugin;
        }

        error = errorFromPlugin;
      } finally {
        if (type === 'success') {
          expect(error).toBeUndefined();
        } else if (type === 'failure') {
          expect(() => {
            throw error;
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
