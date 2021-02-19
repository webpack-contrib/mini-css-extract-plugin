import MiniCssExtractPlugin from '../src';

import { getCompiler } from './helpers'

describe('API', () => {
  it('should return the same CssModule when same webpack instance provided', () => {
    const { webpack } = getCompiler('');
    expect(MiniCssExtractPlugin.getCssModule(webpack)).toEqual(MiniCssExtractPlugin.getCssModule(webpack));
  });
});
