import MiniCssExtractPlugin from '../src';
import CJSMiniCssExtractPlugin from '../src/cjs';

describe('CJS', () => {
  it('should exported plugin', () => {
    expect(CJSMiniCssExtractPlugin).toEqual(MiniCssExtractPlugin);
  });
});
