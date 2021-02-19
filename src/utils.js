import NativeModule from 'module';

const MODULE_TYPE = 'css/mini-extract';

function findModuleById(compilation, id) {
  const { modules, chunkGraph } = compilation;

  for (const module of modules) {
    const moduleId =
      typeof chunkGraph !== 'undefined'
        ? chunkGraph.getModuleId(module)
        : module.id;

    if (moduleId === id) {
      return module;
    }
  }

  return null;
}

function evalModuleCode(loaderContext, code, filename) {
  const module = new NativeModule(filename, loaderContext);

  module.paths = NativeModule._nodeModulePaths(loaderContext.context); // eslint-disable-line no-underscore-dangle
  module.filename = filename;
  module._compile(code, filename); // eslint-disable-line no-underscore-dangle

  return module.exports;
}

function compareIds(a, b) {
  if (typeof a !== typeof b) {
    return typeof a < typeof b ? -1 : 1;
  }

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

function compareModulesByIdentifier(a, b) {
  return compareIds(a.identifier(), b.identifier());
}

function provideLoaderContext(compiler, name, handler, thisCompilation = true) {
  const NormalModule =
    compiler.webpack && compiler.webpack.NormalModule
      ? compiler.webpack.NormalModule
      : // eslint-disable-next-line global-require
        require('webpack/lib/NormalModule');

  compiler.hooks[thisCompilation ? 'thisCompilation' : 'compilation'].tap(
    name,
    (compilation) => {
      const normalModuleHook =
        typeof NormalModule.getCompilationHooks !== 'undefined'
          ? NormalModule.getCompilationHooks(compilation).loader
          : compilation.hooks.normalModuleLoader;

      normalModuleHook.tap(name, (loaderContext, module) =>
        handler(loaderContext, module, compilation)
      );
    }
  );
}

export {
  provideLoaderContext,
  MODULE_TYPE,
  findModuleById,
  evalModuleCode,
  compareModulesByIdentifier,
};
