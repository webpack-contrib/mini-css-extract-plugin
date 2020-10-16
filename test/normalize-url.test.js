import normalizeUrl from '../src/hmr/normalize-url';

import dataUrls from './fixtures/json/data-urls.json';

describe('normalize-url', () => {
  dataUrls.main.forEach((entry) => {
    it(`should work with "${entry}" url`, async () => {
      const [url] = entry;
      let [, expected] = entry;
      let options;

      if (entry.length === 3) {
        options = expected;
        // eslint-disable-next-line prefer-destructuring
        expected = entry[2];
      }

      const result = normalizeUrl(url, options);

      expect(result).toBe(expected);
    });
  });

  dataUrls.stripWWW.forEach((entry) => {
    it(`should work with stripWWW option and "${entry}" url`, async () => {
      const [url] = entry;
      let [, expected] = entry;
      let options;

      if (entry.length === 3) {
        options = expected;
        // eslint-disable-next-line prefer-destructuring
        expected = entry[2];
      }

      const result = normalizeUrl(url, options);

      expect(result).toBe(expected);
    });
  });
});
