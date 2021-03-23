import normalizeUrl from '../src/hmr/normalize-url';

import dataUrls from './fixtures/json/data-urls.json';

describe('normalize-url', () => {
  dataUrls.main.forEach((entry) => {
    const [url, expected] = entry;

    it(`should work with "${url}" url`, async () => {
      const result = normalizeUrl(url);

      expect(result).toBe(expected);
    });
  });
});
