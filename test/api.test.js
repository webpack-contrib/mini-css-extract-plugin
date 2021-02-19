import webpack from 'webpack';

import MiniCssExtractPlugin from '../src';

describe('API', () => {
  it('should return the same CssModule when same webpack instance provided', () => {
    expect(MiniCssExtractPlugin.getCssModule(webpack)).toEqual(MiniCssExtractPlugin.getCssModule(webpack));
  });
});
